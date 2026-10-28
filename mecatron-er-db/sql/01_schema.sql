-- =====================================================================
-- Mecatron External Relations Agent - database schema
-- MySQL 8.0.16+ (CHECK constraints are enforced from 8.0.16)
--
-- Re-runnable: drops and recreates the whole database.
-- Works from setup_db.py or opened directly in MySQL Workbench
-- (Query > Execute All, or Ctrl+Shift+Enter).
-- =====================================================================

SET NAMES utf8mb4 COLLATE utf8mb4_0900_ai_ci;

DROP DATABASE IF EXISTS mecatron_er;
CREATE DATABASE mecatron_er
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;
USE mecatron_er;

-- ---------------------------------------------------------------------
-- Internal people
-- ---------------------------------------------------------------------

CREATE TABLE members (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name        VARCHAR(120) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  role_title  VARCHAR(120) NOT NULL,
  sub_team    ENUM('Mechanical','Electrical','Software','Business/ER') NOT NULL,
  is_lead     BOOLEAN NOT NULL DEFAULT FALSE,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_members_email (email),
  KEY idx_members_sub_team (sub_team),
  KEY idx_members_lead_active (is_lead, is_active)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Module 1 - Sponsor knowledge base
-- ---------------------------------------------------------------------

CREATE TABLE sponsors (
  id                    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name                  VARCHAR(200) NOT NULL,
  industry              VARCHAR(150) NULL,
  website               VARCHAR(255) NULL,
  sponsor_type          ENUM('corporate','university','foundation','government','other') NOT NULL,
  tier                  ENUM('platinum','gold','silver','bronze','in_kind','prospect') NOT NULL DEFAULT 'prospect',
  relationship_status   ENUM('prospect','contacted','active','lapsed','declined') NOT NULL DEFAULT 'prospect',
  relationship_owner_id INT UNSIGNED NULL,
  first_contact_date    DATE NULL,
  notes                 TEXT NULL,
  created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_sponsors_name (name),
  KEY idx_sponsors_status (relationship_status),
  KEY idx_sponsors_tier (tier),
  KEY idx_sponsors_owner (relationship_owner_id),
  CONSTRAINT fk_sponsors_owner
    FOREIGN KEY (relationship_owner_id) REFERENCES members (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE sponsor_contacts (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  sponsor_id   INT UNSIGNED NOT NULL,
  name         VARCHAR(120) NOT NULL,
  job_title    VARCHAR(150) NULL,
  email        VARCHAR(255) NOT NULL,
  phone        VARCHAR(40) NULL,
  is_primary   BOOLEAN NOT NULL DEFAULT FALSE,
  default_cc   BOOLEAN NOT NULL DEFAULT FALSE,
  notes        TEXT NULL,
  -- 1 when primary, NULL otherwise: lets a UNIQUE key allow only one primary per sponsor
  primary_flag TINYINT GENERATED ALWAYS AS (IF(is_primary, 1, NULL)) STORED,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_contacts_sponsor_email (sponsor_id, email),
  UNIQUE KEY uq_contacts_one_primary (sponsor_id, primary_flag),
  UNIQUE KEY uq_contacts_id_sponsor (id, sponsor_id),   -- target of composite FKs
  KEY idx_contacts_email (email),
  CONSTRAINT fk_contacts_sponsor
    FOREIGN KEY (sponsor_id) REFERENCES sponsors (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Module 2 - Drafting templates
-- ---------------------------------------------------------------------

CREATE TABLE email_templates (
  id               INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name             VARCHAR(150) NOT NULL,
  scenario         ENUM('sponsorship_request','thank_you','follow_up','logo_request',
                        'event_coordination','funding_update','report_submission') NOT NULL,
  subject_template VARCHAR(255) NOT NULL,
  body_template    TEXT NOT NULL,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_templates_name (name),
  KEY idx_templates_scenario (scenario, is_active)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Module 3-ready - Email cases & approvals
-- ---------------------------------------------------------------------

CREATE TABLE email_cases (
  id                 INT UNSIGNED NOT NULL AUTO_INCREMENT,
  case_code          VARCHAR(12) NOT NULL,
  title              VARCHAR(200) NOT NULL,
  sponsor_id         INT UNSIGNED NOT NULL,
  primary_contact_id INT UNSIGNED NOT NULL,
  template_id        INT UNSIGNED NULL,
  initiated_by       INT UNSIGNED NOT NULL,
  assigned_sender_id INT UNSIGNED NOT NULL,          -- must be a lead (enforced by trigger)
  purpose            TEXT NOT NULL,
  desired_outcome    TEXT NULL,
  status             ENUM('draft','awaiting_approval','changes_requested',
                          'approved_ready_to_send','completed','cancelled') NOT NULL DEFAULT 'draft',
  completed_by       INT UNSIGNED NULL,
  completed_at       DATETIME NULL,
  created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_cases_code (case_code),
  KEY idx_cases_status (status),
  KEY idx_cases_sponsor (sponsor_id),
  KEY idx_cases_contact_sponsor (primary_contact_id, sponsor_id),
  KEY idx_cases_template (template_id),
  KEY idx_cases_initiated_by (initiated_by),
  KEY idx_cases_sender (assigned_sender_id),
  KEY idx_cases_completed_by (completed_by),
  CONSTRAINT chk_cases_code CHECK (case_code REGEXP '^ER-[0-9]{3,}$'),
  CONSTRAINT chk_cases_completion CHECK (
    (status = 'completed'  AND completed_by IS NOT NULL AND completed_at IS NOT NULL) OR
    (status <> 'completed' AND completed_by IS NULL     AND completed_at IS NULL)),
  CONSTRAINT fk_cases_sponsor
    FOREIGN KEY (sponsor_id) REFERENCES sponsors (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  -- composite FK guarantees the primary contact belongs to the case's sponsor
  CONSTRAINT fk_cases_primary_contact
    FOREIGN KEY (primary_contact_id, sponsor_id) REFERENCES sponsor_contacts (id, sponsor_id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_cases_template
    FOREIGN KEY (template_id) REFERENCES email_templates (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_cases_initiated_by
    FOREIGN KEY (initiated_by) REFERENCES members (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_cases_sender
    FOREIGN KEY (assigned_sender_id) REFERENCES members (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_cases_completed_by
    FOREIGN KEY (completed_by) REFERENCES members (id)
    ON DELETE RESTRICT ON UPDATE RESTRICT   -- no CASCADE: column is used in chk_cases_completion
) ENGINE=InnoDB;

CREATE TABLE case_drafts (
  id                 INT UNSIGNED NOT NULL AUTO_INCREMENT,
  case_id            INT UNSIGNED NOT NULL,
  version_no         SMALLINT UNSIGNED NOT NULL,
  subject            VARCHAR(255) NOT NULL,
  body               TEXT NOT NULL,
  retrieved_context  JSON NULL,      -- sponsor facts the AI used when drafting
  missing_info_flags JSON NULL,      -- list of gaps the AI could not fill
  created_by         INT UNSIGNED NOT NULL,
  is_current         BOOLEAN NOT NULL DEFAULT TRUE,
  -- 1 when current, NULL otherwise: only one current draft per case
  current_flag       TINYINT GENERATED ALWAYS AS (IF(is_current, 1, NULL)) STORED,
  created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_drafts_case_version (case_id, version_no),
  UNIQUE KEY uq_drafts_one_current (case_id, current_flag),
  UNIQUE KEY uq_drafts_id_case (id, case_id),   -- target of composite FK from case_approvers
  KEY idx_drafts_created_by (created_by),
  CONSTRAINT chk_drafts_version CHECK (version_no >= 1),
  CONSTRAINT fk_drafts_case
    FOREIGN KEY (case_id) REFERENCES email_cases (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_drafts_created_by
    FOREIGN KEY (created_by) REFERENCES members (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE case_recipients (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  case_id        INT UNSIGNED NOT NULL,
  recipient_type ENUM('to','cc','bcc') NOT NULL,
  email          VARCHAR(255) NOT NULL,
  contact_id     INT UNSIGNED NULL,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_recipients_case_email (case_id, email),
  KEY idx_recipients_contact (contact_id),
  CONSTRAINT fk_recipients_case
    FOREIGN KEY (case_id) REFERENCES email_cases (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_recipients_contact
    FOREIGN KEY (contact_id) REFERENCES sponsor_contacts (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE case_approvers (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  case_id     INT UNSIGNED NOT NULL,
  draft_id    INT UNSIGNED NOT NULL,     -- approval is tied to one draft version
  approver_id INT UNSIGNED NOT NULL,
  decision    ENUM('pending','approved','changes_requested') NOT NULL DEFAULT 'pending',
  comment     TEXT NULL,
  decided_at  DATETIME NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_approvers_draft_approver (draft_id, approver_id),
  KEY idx_approvers_draft_case (draft_id, case_id),
  KEY idx_approvers_case (case_id),
  KEY idx_approvers_approver_decision (approver_id, decision),
  CONSTRAINT chk_approvers_decided CHECK ((decision = 'pending') = (decided_at IS NULL)),
  CONSTRAINT fk_approvers_case
    FOREIGN KEY (case_id) REFERENCES email_cases (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  -- composite FK guarantees the draft belongs to the same case
  CONSTRAINT fk_approvers_draft
    FOREIGN KEY (draft_id, case_id) REFERENCES case_drafts (id, case_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_approvers_member
    FOREIGN KEY (approver_id) REFERENCES members (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE case_events (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  case_id    INT UNSIGNED NOT NULL,
  actor_id   INT UNSIGNED NULL,          -- NULL = system (e.g. automatic notification)
  event_type ENUM('created','draft_generated','draft_edited','submitted','approved',
                  'changes_requested','notified','marked_done','cancelled',
                  'recipients_updated','note') NOT NULL,
  details    TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,   -- audit rows are append-only
  PRIMARY KEY (id),
  KEY idx_events_case_time (case_id, created_at),
  KEY idx_events_actor (actor_id),
  KEY idx_events_type (event_type),
  CONSTRAINT fk_events_case
    FOREIGN KEY (case_id) REFERENCES email_cases (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_events_actor
    FOREIGN KEY (actor_id) REFERENCES members (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Module 1 (continued) - records that may reference email cases
-- ---------------------------------------------------------------------

CREATE TABLE commitments (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  sponsor_id      INT UNSIGNED NOT NULL,
  direction       ENUM('sponsor_to_mecatron','mecatron_to_sponsor') NOT NULL,
  type            ENUM('cash','in_kind','logo_placement','report','event','other') NOT NULL,
  description     VARCHAR(500) NOT NULL,
  amount_sgd      DECIMAL(12,2) NULL,
  due_date        DATE NULL,
  status          ENUM('promised','in_progress','fulfilled','cancelled') NOT NULL DEFAULT 'promised',
  owner_member_id INT UNSIGNED NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_commitments_sponsor (sponsor_id),
  KEY idx_commitments_status_due (status, due_date),
  KEY idx_commitments_due (due_date),
  KEY idx_commitments_owner (owner_member_id),
  CONSTRAINT chk_commitments_amount CHECK (amount_sgd IS NULL OR amount_sgd >= 0),
  CONSTRAINT fk_commitments_sponsor
    FOREIGN KEY (sponsor_id) REFERENCES sponsors (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_commitments_owner
    FOREIGN KEY (owner_member_id) REFERENCES members (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE interactions (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  sponsor_id    INT UNSIGNED NOT NULL,
  contact_id    INT UNSIGNED NULL,
  member_id     INT UNSIGNED NOT NULL,
  case_id       INT UNSIGNED NULL,
  channel       ENUM('email','meeting','call','event','other') NOT NULL,
  direction     ENUM('inbound','outbound','internal_note') NOT NULL,
  occurred_at   DATETIME NOT NULL,
  subject       VARCHAR(255) NOT NULL,
  summary       TEXT NULL,
  key_decisions TEXT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_interactions_sponsor_time (sponsor_id, occurred_at),
  KEY idx_interactions_time (occurred_at),
  KEY idx_interactions_contact (contact_id),
  KEY idx_interactions_member (member_id),
  KEY idx_interactions_case (case_id),
  CONSTRAINT fk_interactions_sponsor
    FOREIGN KEY (sponsor_id) REFERENCES sponsors (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_interactions_contact
    FOREIGN KEY (contact_id) REFERENCES sponsor_contacts (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_interactions_member
    FOREIGN KEY (member_id) REFERENCES members (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_interactions_case
    FOREIGN KEY (case_id) REFERENCES email_cases (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE follow_up_tasks (
  id                 INT UNSIGNED NOT NULL AUTO_INCREMENT,
  sponsor_id         INT UNSIGNED NOT NULL,
  interaction_id     INT UNSIGNED NULL,
  commitment_id      INT UNSIGNED NULL,
  assigned_member_id INT UNSIGNED NOT NULL,
  description        VARCHAR(500) NOT NULL,
  priority           ENUM('low','medium','high') NOT NULL DEFAULT 'medium',
  due_date           DATE NULL,
  status             ENUM('open','in_progress','done','cancelled') NOT NULL DEFAULT 'open',
  completed_at       DATETIME NULL,
  created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_tasks_sponsor (sponsor_id),
  KEY idx_tasks_status_due (status, due_date),
  KEY idx_tasks_due (due_date),
  KEY idx_tasks_assignee (assigned_member_id),
  KEY idx_tasks_interaction (interaction_id),
  KEY idx_tasks_commitment (commitment_id),
  CONSTRAINT chk_tasks_completed CHECK ((status = 'done') = (completed_at IS NOT NULL)),
  CONSTRAINT fk_tasks_sponsor
    FOREIGN KEY (sponsor_id) REFERENCES sponsors (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_tasks_interaction
    FOREIGN KEY (interaction_id) REFERENCES interactions (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_tasks_commitment
    FOREIGN KEY (commitment_id) REFERENCES commitments (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_tasks_assignee
    FOREIGN KEY (assigned_member_id) REFERENCES members (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE documents (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  sponsor_id  INT UNSIGNED NULL,          -- NULL = general team document
  title       VARCHAR(255) NOT NULL,
  doc_type    ENUM('proposal','contract','deck','report','email_thread','logo','other') NOT NULL,
  url_or_path VARCHAR(1000) NOT NULL,
  uploaded_by INT UNSIGNED NOT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_documents_sponsor (sponsor_id),
  KEY idx_documents_type (doc_type),
  KEY idx_documents_uploaded_by (uploaded_by),
  CONSTRAINT fk_documents_sponsor
    FOREIGN KEY (sponsor_id) REFERENCES sponsors (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_documents_uploaded_by
    FOREIGN KEY (uploaded_by) REFERENCES members (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Business rule: the assigned sender of an email case must be a lead
-- ---------------------------------------------------------------------

DELIMITER $$

CREATE TRIGGER trg_email_cases_sender_is_lead_bi
BEFORE INSERT ON email_cases
FOR EACH ROW
BEGIN
  IF NOT EXISTS (SELECT 1 FROM members WHERE id = NEW.assigned_sender_id AND is_lead = TRUE) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'email_cases.assigned_sender_id must reference a member with is_lead = TRUE';
  END IF;
END$$

CREATE TRIGGER trg_email_cases_sender_is_lead_bu
BEFORE UPDATE ON email_cases
FOR EACH ROW
BEGIN
  IF NEW.assigned_sender_id <> OLD.assigned_sender_id
     AND NOT EXISTS (SELECT 1 FROM members WHERE id = NEW.assigned_sender_id AND is_lead = TRUE) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'email_cases.assigned_sender_id must reference a member with is_lead = TRUE';
  END IF;
END$$

DELIMITER ;
