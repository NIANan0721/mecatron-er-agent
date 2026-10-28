-- =====================================================================
-- Mecatron External Relations Agent - seed data
-- Run after 01_schema.sql. Inserts are in FK-safe order.
--
-- Real organisations are listed using public information only. Every
-- contact person, email address and phone number is a FICTIONAL
-- PLACEHOLDER (@example.com, +65 0000 xxxx). Commitments, amounts and
-- interactions are illustrative seed data, not real records.
-- =====================================================================

SET NAMES utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE mecatron_er;

START TRANSACTION;

-- ---------------------------------------------------------------------
-- members (1-4 = initial approval group of leads)
-- ---------------------------------------------------------------------
INSERT INTO members (id, name, email, role_title, sub_team, is_lead, is_active) VALUES
  ( 1, 'Timothy',       'timothy@example.com',       'Team Lead',                        'Business/ER', TRUE,  TRUE),
  ( 2, 'Scott',         'scott@example.com',         'Technical Lead',                   'Mechanical',  TRUE,  TRUE),
  ( 3, 'Poh Hian',      'pohhian@example.com',       'Electrical Lead',                  'Electrical',  TRUE,  TRUE),
  ( 4, 'Zi Xuan',       'zixuan@example.com',        'Software Lead',                    'Software',    TRUE,  TRUE),
  ( 5, 'Rachel Ong',    'rachel.ong@example.com',    'External Relations Executive',     'Business/ER', FALSE, TRUE),
  ( 6, 'Marcus Tay',    'marcus.tay@example.com',    'Outreach & Events Coordinator',    'Business/ER', FALSE, TRUE),
  ( 7, 'Priya Nair',    'priya.nair@example.com',    'Mechanical Engineer (Thrusters)',  'Mechanical',  FALSE, TRUE),
  ( 8, 'Daniel Koh',    'daniel.koh@example.com',    'Mechanical Engineer (Hull & Test)','Mechanical',  FALSE, TRUE),
  ( 9, 'Hannah Lim',    'hannah.lim@example.com',    'Electrical Engineer (Power/PCB)',  'Electrical',  FALSE, TRUE),
  (10, 'Aisyah Rahman', 'aisyah.rahman@example.com', 'Software Engineer (Perception)',   'Software',    FALSE, TRUE),
  (11, 'Ethan Chua',    'ethan.chua@example.com',    'Finance & Logistics Executive',    'Business/ER', FALSE, TRUE),
  (12, 'Kenneth Yeo',   'kenneth.yeo@example.com',   'Founding Member (Alumni, 2023)',   'Electrical',  FALSE, FALSE);

-- ---------------------------------------------------------------------
-- sponsors (1-4 real organisations, 5-10 fictional companies)
-- ---------------------------------------------------------------------
INSERT INTO sponsors (id, name, industry, website, sponsor_type, tier, relationship_status,
                      relationship_owner_id, first_contact_date, notes) VALUES
  ( 1, 'NTU College of Engineering', 'Higher education', 'https://www.ntu.edu.sg/engineering',
       'university', 'platinum', 'active', 1, '2023-03-01',
       'Home college of Mecatron (founded 2023). Provides student-project grants and competition travel subsidies. Commitments here are illustrative seed data.'),
  ( 2, 'James Dyson Foundation', 'Engineering education charity', 'https://www.jamesdysonfoundation.com',
       'foundation', 'gold', 'active', 1, '2023-05-15',
       'Mecatron is based in the Dyson-NTU Studio. Commitments here are illustrative seed data.'),
  ( 3, 'NTU SRC Aquatic Centre', 'Sports & recreation venue', NULL,
       'university', 'in_kind', 'active', 6, '2023-09-01',
       'Pool testing venue for AUV/ROV trials. Bookings need a safety plan each semester.'),
  ( 4, 'GPS Lands', NULL, NULL,
       'corporate', 'silver', 'active', 5, '2025-02-10',
       'Referenced in the ER planning doc. Industry and website to be verified from public sources. Commitments here are illustrative seed data.'),
  ( 5, 'Abyssal Sensing Pte Ltd', 'Subsea sensors (DVLs, imaging sonar, pressure sensors)', 'https://abyssal-sensing.example.com',
       'corporate', 'prospect', 'contacted', 5, '2026-08-20',
       'FICTIONAL. Met at a maritime tech expo. Has an academic programme for sensor loans/discounts.'),
  ( 6, 'LayerForge 3D Pte Ltd', 'Additive manufacturing services (SLS, MJF, resin)', 'https://layerforge3d.example.com',
       'corporate', 'in_kind', 'active', 7, '2024-01-10',
       'FICTIONAL. Prints thruster mounts and electronics housings at a student discount.'),
  ( 7, 'CircuitHarbour PCB Pte Ltd', 'PCB fabrication & assembly', 'https://circuitharbour.example.com',
       'corporate', 'bronze', 'active', 9, '2024-02-05',
       'FICTIONAL. Fabricates power-distribution and sensor boards.'),
  ( 8, 'Straits Meridian Logistics Pte Ltd', 'Maritime logistics & freight forwarding', 'https://straitsmeridian.example.com',
       'corporate', 'gold', 'active', 1, '2024-03-12',
       'FICTIONAL. Cash sponsor; shipped the ROV to the MATE ROV World Championship 2024 in Kingsport, Tennessee.'),
  ( 9, 'VoltCell Energy Pte Ltd', 'Lithium-ion battery packs', 'https://voltcell.example.com',
       'corporate', 'prospect', 'declined', 11, '2026-05-04',
       'FICTIONAL. Declined for the 2026 cycle (budget committed elsewhere). Revisit in 2027.'),
  (10, 'Kelpwave Software Pte Ltd', 'Simulation & cloud software', 'https://kelpwave.example.com',
       'corporate', 'bronze', 'lapsed', 4, '2024-06-20',
       'FICTIONAL. Provided simulation licences 2024-2025; university programme paused in mid-2025.');

-- ---------------------------------------------------------------------
-- sponsor_contacts (all fictional placeholders)
-- ---------------------------------------------------------------------
INSERT INTO sponsor_contacts (id, sponsor_id, name, job_title, email, phone, is_primary, default_cc, notes) VALUES
  ( 1,  1, 'Dr Alex Placeholder', 'Assistant Dean, Student Projects', 'alex.placeholder@example.com', '+65 0000 0101', TRUE,  FALSE, 'Placeholder contact - replace with real details.'),
  ( 2,  1, 'Jamie Sample',        'Finance Executive',                'jamie.sample@example.com',     '+65 0000 0102', FALSE, TRUE,  'Placeholder. Handles grant claims.'),
  ( 3,  1, 'Prof Morgan Demo',    'Faculty Advisor',                  'morgan.demo@example.com',      '+65 0000 0103', FALSE, TRUE,  'Placeholder. CC on all college correspondence.'),
  ( 4,  2, 'Riley Example',       'Programme Manager',                'riley.example@example.com',    '+65 0000 0201', TRUE,  FALSE, 'Placeholder contact - replace with real details.'),
  ( 5,  2, 'Casey Sample',        'Studio Coordinator, Dyson-NTU Studio', 'casey.sample@example.com', '+65 0000 0202', FALSE, TRUE,  'Placeholder. Day-to-day studio access.'),
  ( 6,  3, 'Taylor Placeholder',  'Facility Booking Officer',         'taylor.placeholder@example.com','+65 0000 0301', TRUE,  FALSE, 'Placeholder. Pool bookings need 2 weeks notice.'),
  ( 7,  3, 'Quinn Demo',          'Duty Manager',                     'quinn.demo@example.com',       '+65 0000 0302', FALSE, TRUE,  'Placeholder. On-site contact during test sessions.'),
  ( 8,  4, 'Avery Sample',        'Marketing Manager',                'avery.sample@example.com',     '+65 0000 0401', TRUE,  FALSE, 'Placeholder. Owns brand assets.'),
  ( 9,  4, 'Drew Placeholder',    'Corporate Communications Executive','drew.placeholder@example.com','+65 0000 0402', FALSE, TRUE,  'Placeholder.'),
  (10,  4, 'Sam Example',         'Director',                         'sam.example@example.com',      '+65 0000 0403', FALSE, FALSE, 'Placeholder. Signs off sponsorship budget.'),
  (11,  5, 'Robin Testwell',      'Business Development Manager',     'robin.testwell@example.com',   '+65 0000 0501', TRUE,  FALSE, 'Fictional.'),
  (12,  5, 'Kai Mockford',        'Applications Engineer',            'kai.mockford@example.com',     '+65 0000 0502', FALSE, TRUE,  'Fictional. Technical questions on DVL integration.'),
  (13,  6, 'Jesse Fictional',     'Account Manager',                  'jesse.fictional@example.com',  '+65 0000 0601', TRUE,  FALSE, 'Fictional.'),
  (14,  6, 'Lee Placeholder',     'Production Engineer',              'lee.placeholder@example.com',  '+65 0000 0602', FALSE, TRUE,  'Fictional.'),
  (15,  7, 'Charlie Sample',      'Sales Engineer',                   'charlie.sample@example.com',   '+65 0000 0701', TRUE,  FALSE, 'Fictional.'),
  (16,  7, 'Frankie Demo',        'Marketing Executive',              'frankie.demo@example.com',     '+65 0000 0702', FALSE, TRUE,  'Fictional.'),
  (17,  8, 'Dana Example',        'CSR Manager',                      'dana.example@example.com',     '+65 0000 0801', TRUE,  FALSE, 'Fictional.'),
  (18,  8, 'Parker Sample',       'Operations Manager',               'parker.sample@example.com',    '+65 0000 0802', FALSE, TRUE,  'Fictional. Arranged ROV freight in 2024.'),
  (19,  8, 'Rowan Placeholder',   'Finance Manager',                  'rowan.placeholder@example.com','+65 0000 0803', FALSE, FALSE, 'Fictional.'),
  (20,  9, 'Emerson Demo',        'Head of Partnerships',             'emerson.demo@example.com',     '+65 0000 0901', TRUE,  FALSE, 'Fictional.'),
  (21,  9, 'Skyler Sample',       'Product Manager',                  'skyler.sample@example.com',    '+65 0000 0902', FALSE, FALSE, 'Fictional.'),
  (22, 10, 'Harper Example',      'Developer Relations Lead',         'harper.example@example.com',   '+65 0000 1001', TRUE,  FALSE, 'Fictional.'),
  (23, 10, 'Reese Placeholder',   'Partnerships Associate',           'reese.placeholder@example.com','+65 0000 1002', FALSE, TRUE,  'Fictional.');

-- ---------------------------------------------------------------------
-- email_templates (one per scenario)
-- ---------------------------------------------------------------------
INSERT INTO email_templates (id, name, scenario, subject_template, body_template, is_active) VALUES
  (1, 'Sponsorship Request - Standard', 'sponsorship_request',
      'Sponsorship Opportunity with Mecatron NTU - {{sponsor_name}}',
      'Dear {{contact_name}},\n\nI am {{member_name}}, {{member_role}} of Mecatron, NTU Singapore''s student marine-robotics team building autonomous and remotely operated underwater vehicles. Since our founding in 2023 we placed 3rd at the Singapore AUV Challenge (SAUVC) 2024 and competed in the MATE ROV World Championship 2024 (Explorer Class) in Kingsport, Tennessee.\n\n{{custom_ask}}\n\nIn return, {{sponsor_name}} would receive {{benefits}}.\n\nWould you be open to a short call in the coming weeks?\n\nBest regards,\n{{member_name}}\n{{member_role}}, Mecatron NTU', TRUE),
  (2, 'Thank You - Post-Event', 'thank_you',
      'Thank You from Mecatron NTU',
      'Dear {{contact_name}},\n\nOn behalf of Mecatron NTU, thank you for {{support_description}}. {{impact_statement}}\n\nWe look forward to continuing our partnership with {{sponsor_name}}.\n\nWarm regards,\n{{member_name}}\n{{member_role}}, Mecatron NTU', TRUE),
  (3, 'Follow-up - Gentle Reminder', 'follow_up',
      'Following up: {{original_subject}}',
      'Dear {{contact_name}},\n\nI hope you are well. I am following up on my email of {{original_date}} regarding {{topic}}.\n\n{{custom_ask}}\n\nPlease let me know if any further information would help.\n\nBest regards,\n{{member_name}}\n{{member_role}}, Mecatron NTU', TRUE),
  (4, 'Logo Request for Sponsor Placement', 'logo_request',
      'Request for Sponsor Logo - Mecatron NTU',
      'Dear {{contact_name}},\n\nThank you for {{sponsor_name}}''s support of Mecatron NTU. As part of our sponsor recognition, we will place your logo on {{placement_locations}}.\n\nCould you share a high-resolution vector logo (AI, SVG or EPS) and any brand guidelines by {{deadline}}? We will send a mock-up for your approval before printing.\n\nBest regards,\n{{member_name}}\n{{member_role}}, Mecatron NTU', TRUE),
  (5, 'Event / Venue Coordination', 'event_coordination',
      '{{event_name}} - Coordination Request',
      'Dear {{contact_name}},\n\nMecatron NTU would like to arrange {{event_name}} on {{event_dates}}.\n\nDetails:\n- Purpose: {{purpose}}\n- Participants: {{headcount}}\n- Requirements: {{requirements}}\n\nPlease let us know if these dates work or if alternatives are available.\n\nBest regards,\n{{member_name}}\n{{member_role}}, Mecatron NTU', TRUE),
  (6, 'Funding Update', 'funding_update',
      'Mecatron NTU - Funding Update {{period}}',
      'Dear {{contact_name}},\n\nHere is a brief update on how {{sponsor_name}}''s funding has been used during {{period}}:\n\n{{spend_summary}}\n\nUpcoming milestones: {{milestones}}\n\n{{custom_ask}}\n\nThank you for your continued support.\n\nBest regards,\n{{member_name}}\n{{member_role}}, Mecatron NTU', TRUE),
  (7, 'Report Submission', 'report_submission',
      '{{report_name}} - Mecatron NTU',
      'Dear {{contact_name}},\n\nPlease find attached our {{report_name}} covering {{period}}. Highlights include:\n\n{{highlights}}\n\nWe are happy to walk you through the report at your convenience.\n\nBest regards,\n{{member_name}}\n{{member_role}}, Mecatron NTU', TRUE);

-- ---------------------------------------------------------------------
-- email_cases - one per status
--   ER-001 awaiting_approval (2/4)   ER-002 completed
--   ER-003 changes_requested (v2)    ER-004 approved_ready_to_send (4/4)
--   ER-005 draft                     ER-006 cancelled
-- ---------------------------------------------------------------------
INSERT INTO email_cases (id, case_code, title, sponsor_id, primary_contact_id, template_id,
                         initiated_by, assigned_sender_id, purpose, desired_outcome, status,
                         completed_by, completed_at, created_at, updated_at) VALUES
  (1, 'ER-001', 'Request for Sponsor Logo', 4, 8, 4, 5, 1,
      'Request a high-resolution vector logo from GPS Lands for placement on the AUV hull, team T-shirts and SAUVC 2027 poster.',
      'Receive AI/SVG logo files and brand guidelines by 15 Nov 2026.',
      'awaiting_approval', NULL, NULL, '2026-10-21 09:00:00', '2026-10-22 14:10:00'),
  (2, 'ER-002', 'Thank You for Supporting Our 2026 Season', 2, 4, 2, 6, 1,
      'Thank the James Dyson Foundation for workspace at the Dyson-NTU Studio and support of our September outreach workshop.',
      'Strengthen the relationship ahead of the 2027 season.',
      'completed', 1, '2026-09-18 16:30:00', '2026-09-14 10:00:00', '2026-09-18 16:30:00'),
  (3, 'ER-003', 'Sponsorship Request - Subsea Sensor Support', 5, 11, 1, 5, 4,
      'Ask Abyssal Sensing for a DVL loan or academic discount for the 2027 AUV.',
      'Secure a call with their academic programme and a DVL loan/discount offer.',
      'changes_requested', NULL, NULL, '2026-10-08 11:00:00', '2026-10-12 15:00:00'),
  (4, 'ER-004', 'Pool Booking for November Test Sessions', 3, 6, 5, 8, 1,
      'Book pool lanes at the NTU SRC Aquatic Centre for AUV integration tests in November.',
      'Confirmed Saturday slots on 7, 14 and 21 Nov 2026.',
      'approved_ready_to_send', NULL, NULL, '2026-10-22 10:00:00', '2026-10-24 11:05:00'),
  (5, 'ER-005', 'FY2026 Funding Update & Tranche 2 Request', 1, 1, 6, 11, 1,
      'Update the College of Engineering on how FY2026 funds were used and request release of tranche 2.',
      'Tranche 2 released before the SAUVC 2027 build freeze.',
      'draft', NULL, NULL, '2026-10-26 14:00:00', '2026-10-26 14:05:00'),
  (6, 'ER-006', 'Follow-up on Battery Sponsorship', 9, 20, 3, 11, 4,
      'Follow up on our May enquiry about sponsored Li-ion battery packs.',
      'Obtain a decision on in-kind battery sponsorship.',
      'cancelled', NULL, NULL, '2026-06-01 09:30:00', '2026-06-11 10:00:00');

-- ---------------------------------------------------------------------
-- case_drafts (versioned; exactly one current per case)
-- ---------------------------------------------------------------------
INSERT INTO case_drafts (id, case_id, version_no, subject, body, retrieved_context, missing_info_flags,
                         created_by, is_current, created_at, updated_at) VALUES
  (1, 1, 1, 'Request for Sponsor Logo - Mecatron NTU',
      'Dear Avery,\n\nThank you for GPS Lands'' support of Mecatron NTU for our SAUVC 2027 campaign. As part of our sponsor recognition, we will place the GPS Lands logo on our AUV hull, team T-shirts and competition poster.\n\nCould you share a high-resolution vector logo (AI, SVG or EPS) and any brand guidelines by 15 November 2026? We will send a mock-up for your approval before anything goes to print.\n\nBest regards,\nTimothy\nTeam Lead, Mecatron NTU',
      '{"sponsor": "GPS Lands", "tier": "silver", "primary_contact": "Avery Sample", "open_commitments": ["Logo on AUV hull, T-shirts and poster (due 2026-11-30)", "S$5,000 for SAUVC 2027 campaign"], "last_interaction": "2026-10-10: logo files to be provided once request received"}',
      '[]', 5, TRUE, '2026-10-21 09:05:00', '2026-10-21 09:20:00'),
  (2, 2, 1, 'Thank You from Mecatron NTU',
      'Dear Riley,\n\nOn behalf of Mecatron NTU, thank you for the James Dyson Foundation''s continued support, including our workspace at the Dyson-NTU Studio and help with our marine-science outreach workshop for primary-school students on 12 September.\n\nOver 40 students built simple ROVs at the workshop, and the studio has been central to our 2026 vehicle build.\n\nWe look forward to sharing our SAUVC 2027 progress with you.\n\nWarm regards,\nTimothy\nTeam Lead, Mecatron NTU',
      '{"sponsor": "James Dyson Foundation", "tier": "gold", "primary_contact": "Riley Example", "recent": ["2026-09-12 outreach workshop at Dyson-NTU Studio"], "commitments": ["Workspace & equipment access at the Dyson-NTU Studio"]}',
      '[]', 6, TRUE, '2026-09-14 10:05:00', '2026-09-14 10:25:00'),
  (3, 3, 1, 'Sponsorship Opportunity with Mecatron NTU - Abyssal Sensing',
      'Dear Robin,\n\nI am Zi Xuan, Software Lead of Mecatron, NTU Singapore''s student marine-robotics team. We would love to explore a sponsorship with Abyssal Sensing to support our next AUV.\n\nWould you be open to a short call?\n\nBest regards,\nZi Xuan\nSoftware Lead, Mecatron NTU',
      '{"sponsor": "Abyssal Sensing Pte Ltd", "status": "contacted", "primary_contact": "Robin Testwell", "interactions": ["2026-08-20 met at maritime tech expo", "2026-09-02 shared academic programme info"]}',
      '["Specific product/ask not stated", "Sponsor benefits not stated"]', 5, FALSE, '2026-10-08 11:05:00', '2026-10-08 11:30:00'),
  (4, 3, 2, 'Sponsorship Request: DVL Support for Mecatron NTU''s 2027 AUV',
      'Dear Robin,\n\nIt was great meeting you at the maritime tech expo in August. I am Zi Xuan, Software Lead of Mecatron, NTU Singapore''s student marine-robotics team. Since our founding in 2023 we placed 3rd at SAUVC 2024 and competed in the MATE ROV World Championship 2024 (Explorer Class).\n\nFor our 2027 AUV we are looking to integrate a Doppler velocity log for navigation. Through your academic programme, would Abyssal Sensing consider a loan or discounted unit?\n\nIn return, Abyssal Sensing would receive logo placement on our AUV and team shirts, social-media features and a technical write-up of the integration.\n\nWould you be open to a short call in the coming weeks?\n\nBest regards,\nZi Xuan\nSoftware Lead, Mecatron NTU',
      '{"sponsor": "Abyssal Sensing Pte Ltd", "status": "contacted", "primary_contact": "Robin Testwell", "team_achievements": ["3rd place SAUVC 2024", "MATE ROV World Championship 2024 Explorer Class"], "review_comments": ["Scott: specify the sensor and the ask; mention achievements"]}',
      '["DVL model and quantity to confirm with Software sub-team"]', 5, TRUE, '2026-10-12 15:00:00', '2026-10-12 15:00:00'),
  (5, 4, 1, 'November Pool Test Sessions - Coordination Request',
      'Dear Taylor,\n\nMecatron NTU would like to book two lanes at the NTU SRC Aquatic Centre for AUV integration tests on Saturdays 7, 14 and 21 November 2026, 9am-12pm.\n\nDetails:\n- Purpose: AUV navigation and buoyancy testing\n- Participants: up to 10 members\n- Requirements: two lanes, deck power point; our semester safety plan was submitted on 1 August\n\nPlease let us know if these dates work or if alternatives are available.\n\nBest regards,\nTimothy\nTeam Lead, Mecatron NTU',
      '{"sponsor": "NTU SRC Aquatic Centre", "primary_contact": "Taylor Placeholder", "notes": "Bookings need 2 weeks notice", "commitments": ["Semester pool safety plan - fulfilled 2026-08-01"]}',
      '[]', 8, TRUE, '2026-10-22 10:05:00', '2026-10-22 10:40:00'),
  (6, 5, 1, 'Mecatron NTU - Funding Update FY2026',
      'Dear Dr Alex,\n\nHere is a brief update on how the College''s FY2026 funding has been used:\n\n- Thrusters and electronics housings for the 2027 AUV\n- PCB fabrication for power distribution\n- Pool testing consumables\n\nUpcoming milestones: mid-year progress report (15 Nov 2026) and SAUVC 2027 build freeze.\n\nWe would be grateful if tranche 2 of the FY2026 grant could be released after the mid-year report.\n\nThank you for your continued support.\n\nBest regards,\nTimothy\nTeam Lead, Mecatron NTU',
      '{"sponsor": "NTU College of Engineering", "tier": "platinum", "commitments": ["FY2026 grant tranche 2 (S$18,000, in progress)", "Mid-year progress report due 2026-11-15"], "notes": "Internal note 2026-10-05: tranche 2 needs mid-year report first"}',
      '["Tranche 2 amount not confirmed with Finance", "Spend breakdown figures missing"]', 11, TRUE, '2026-10-26 14:05:00', '2026-10-26 14:05:00'),
  (7, 6, 1, 'Following up: Battery Sponsorship Enquiry',
      'Dear Emerson,\n\nI hope you are well. I am following up on my email of 4 May regarding in-kind sponsorship of Li-ion battery packs for our AUV.\n\nWould VoltCell be able to share a decision by the end of June?\n\nBest regards,\nZi Xuan\nSoftware Lead, Mecatron NTU',
      '{"sponsor": "VoltCell Energy Pte Ltd", "status": "contacted", "interactions": ["2026-05-04 battery sponsorship enquiry"]}',
      '[]', 11, TRUE, '2026-06-01 09:35:00', '2026-06-01 09:35:00');

-- ---------------------------------------------------------------------
-- case_recipients
-- ---------------------------------------------------------------------
INSERT INTO case_recipients (case_id, recipient_type, email, contact_id) VALUES
  (1, 'to',  'avery.sample@example.com',       8),
  (1, 'cc',  'drew.placeholder@example.com',   9),
  (1, 'cc',  'rachel.ong@example.com',         NULL),
  (2, 'to',  'riley.example@example.com',      4),
  (2, 'cc',  'casey.sample@example.com',       5),
  (2, 'bcc', 'marcus.tay@example.com',         NULL),
  (3, 'to',  'robin.testwell@example.com',     11),
  (3, 'cc',  'kai.mockford@example.com',       12),
  (4, 'to',  'taylor.placeholder@example.com', 6),
  (4, 'cc',  'quinn.demo@example.com',         7),
  (5, 'to',  'alex.placeholder@example.com',   1),
  (5, 'cc',  'jamie.sample@example.com',       2),
  (5, 'cc',  'morgan.demo@example.com',        3),
  (6, 'to',  'emerson.demo@example.com',       20);

-- ---------------------------------------------------------------------
-- case_approvers (rows exist only for submitted drafts)
-- ---------------------------------------------------------------------
INSERT INTO case_approvers (case_id, draft_id, approver_id, decision, comment, decided_at) VALUES
  -- ER-001 v1: 2/4 approved
  (1, 1, 1, 'approved', 'Looks good.',                         '2026-10-22 10:00:00'),
  (1, 1, 3, 'approved', NULL,                                  '2026-10-22 14:10:00'),
  (1, 1, 2, 'pending',  NULL,                                  NULL),
  (1, 1, 4, 'pending',  NULL,                                  NULL),
  -- ER-002 v1: 4/4 approved, then sent
  (2, 2, 1, 'approved', NULL,                                  '2026-09-15 09:10:00'),
  (2, 2, 2, 'approved', NULL,                                  '2026-09-15 13:00:00'),
  (2, 2, 3, 'approved', 'Add the student headcount - done.',  '2026-09-16 10:30:00'),
  (2, 2, 4, 'approved', NULL,                                  '2026-09-16 11:45:00'),
  -- ER-003 v1: changes requested (v2 drafted, not yet resubmitted)
  (3, 3, 1, 'approved', NULL,                                  '2026-10-09 09:00:00'),
  (3, 3, 2, 'changes_requested', 'Too vague - name the sensor (DVL) and the exact ask, and mention SAUVC 2024 / MATE 2024.', '2026-10-09 16:20:00'),
  (3, 3, 3, 'approved', NULL,                                  '2026-10-10 08:45:00'),
  (3, 3, 4, 'pending',  NULL,                                  NULL),
  -- ER-004 v1: 4/4 approved
  (4, 5, 1, 'approved', NULL,                                  '2026-10-23 09:30:00'),
  (4, 5, 2, 'approved', NULL,                                  '2026-10-23 12:15:00'),
  (4, 5, 3, 'approved', NULL,                                  '2026-10-23 18:40:00'),
  (4, 5, 4, 'approved', 'Good to go.',                         '2026-10-24 11:00:00'),
  -- ER-006 v1: submitted, then cancelled after the sponsor declined
  (6, 7, 1, 'approved', NULL,                                  '2026-06-02 10:00:00'),
  (6, 7, 2, 'pending',  NULL,                                  NULL),
  (6, 7, 3, 'pending',  NULL,                                  NULL),
  (6, 7, 4, 'pending',  NULL,                                  NULL);

-- ---------------------------------------------------------------------
-- case_events (audit log)
-- ---------------------------------------------------------------------
INSERT INTO case_events (case_id, actor_id, event_type, details, created_at) VALUES
  (1, 5,    'created',           'Case opened from template "Logo Request for Sponsor Placement".', '2026-10-21 09:00:00'),
  (1, 5,    'draft_generated',   'v1 generated by AI.',                                    '2026-10-21 09:05:00'),
  (1, 5,    'submitted',         'v1 submitted to Timothy, Scott, Poh Hian, Zi Xuan.',     '2026-10-21 09:30:00'),
  (1, 1,    'approved',          'v1 approved.',                                           '2026-10-22 10:00:00'),
  (1, 3,    'approved',          'v1 approved.',                                           '2026-10-22 14:10:00'),

  (2, 6,    'created',           'Case opened from template "Thank You - Post-Event".',    '2026-09-14 10:00:00'),
  (2, 6,    'draft_generated',   'v1 generated by AI.',                                    '2026-09-14 10:05:00'),
  (2, 6,    'submitted',         'v1 submitted for approval.',                             '2026-09-14 10:30:00'),
  (2, 1,    'approved',          'v1 approved.',                                           '2026-09-15 09:10:00'),
  (2, 2,    'approved',          'v1 approved.',                                           '2026-09-15 13:00:00'),
  (2, 3,    'approved',          'v1 approved.',                                           '2026-09-16 10:30:00'),
  (2, 4,    'approved',          'v1 approved. All approvals received.',                   '2026-09-16 11:45:00'),
  (2, NULL, 'notified',          'Assigned sender Timothy notified: ready to send.',       '2026-09-16 11:46:00'),
  (2, 1,    'marked_done',       'Sent manually from team mailbox and marked done.',       '2026-09-18 16:30:00'),

  (3, 5,    'created',           'Case opened from template "Sponsorship Request - Standard".', '2026-10-08 11:00:00'),
  (3, 5,    'draft_generated',   'v1 generated by AI.',                                    '2026-10-08 11:05:00'),
  (3, 5,    'submitted',         'v1 submitted for approval.',                             '2026-10-08 11:30:00'),
  (3, 1,    'approved',          'v1 approved.',                                           '2026-10-09 09:00:00'),
  (3, 2,    'changes_requested', 'v1: name the sensor and the exact ask.',                 '2026-10-09 16:20:00'),
  (3, 3,    'approved',          'v1 approved.',                                           '2026-10-10 08:45:00'),
  (3, 5,    'draft_generated',   'v2 generated addressing review comments; v1 approvals no longer apply.', '2026-10-12 15:00:00'),

  (4, 8,    'created',           'Case opened from template "Event / Venue Coordination".', '2026-10-22 10:00:00'),
  (4, 8,    'draft_generated',   'v1 generated by AI.',                                    '2026-10-22 10:05:00'),
  (4, 8,    'submitted',         'v1 submitted for approval.',                             '2026-10-22 10:40:00'),
  (4, 1,    'approved',          'v1 approved.',                                           '2026-10-23 09:30:00'),
  (4, 2,    'approved',          'v1 approved.',                                           '2026-10-23 12:15:00'),
  (4, 3,    'approved',          'v1 approved.',                                           '2026-10-23 18:40:00'),
  (4, 4,    'approved',          'v1 approved. All approvals received.',                   '2026-10-24 11:00:00'),
  (4, NULL, 'notified',          'Assigned sender Timothy notified: ready to send.',       '2026-10-24 11:05:00'),

  (5, 11,   'created',           'Case opened from template "Funding Update".',            '2026-10-26 14:00:00'),
  (5, 11,   'draft_generated',   'v1 generated by AI with 2 missing-info flags.',          '2026-10-26 14:05:00'),

  (6, 11,   'created',           'Case opened from template "Follow-up - Gentle Reminder".', '2026-06-01 09:30:00'),
  (6, 11,   'draft_generated',   'v1 generated by AI.',                                    '2026-06-01 09:35:00'),
  (6, 11,   'submitted',         'v1 submitted for approval.',                             '2026-06-01 10:00:00'),
  (6, 1,    'approved',          'v1 approved.',                                           '2026-06-02 10:00:00'),
  (6, 11,   'cancelled',         'VoltCell declined on 10 Jun 2026; follow-up no longer needed.', '2026-06-11 10:00:00');

-- ---------------------------------------------------------------------
-- commitments (both directions)
-- ---------------------------------------------------------------------
INSERT INTO commitments (id, sponsor_id, direction, type, description, amount_sgd, due_date, status,
                         owner_member_id, created_at) VALUES
  ( 1,  1, 'sponsor_to_mecatron', 'cash',           'FY2024 student-project grant for first AUV and SAUVC 2024 entry',            15000.00, '2024-01-31', 'fulfilled',   1,  '2024-01-15 11:00:00'),
  ( 2,  1, 'sponsor_to_mecatron', 'cash',           'Travel subsidy for MATE ROV World Championship 2024 (Kingsport, Tennessee)',   8000.00, '2024-05-15', 'fulfilled',  11,  '2024-04-25 10:00:00'),
  ( 3,  1, 'mecatron_to_sponsor', 'report',         'FY2024 technical & financial report',                                           NULL, '2025-01-31', 'fulfilled',   1,  '2024-01-15 11:00:00'),
  ( 4,  1, 'sponsor_to_mecatron', 'cash',           'FY2026 project grant - tranche 2 (released after mid-year report)',         18000.00, '2026-12-15', 'in_progress', 1,  '2026-01-20 10:00:00'),
  ( 5,  1, 'mecatron_to_sponsor', 'report',         'FY2026 mid-year progress report',                                               NULL, '2026-11-15', 'in_progress', 4,  '2026-01-20 10:00:00'),
  ( 6,  2, 'sponsor_to_mecatron', 'in_kind',        'Workspace and equipment access at the Dyson-NTU Studio',                        NULL, NULL,         'in_progress', 1,  '2023-05-15 09:00:00'),
  ( 7,  2, 'mecatron_to_sponsor', 'event',          'AUV demo at Dyson-NTU Studio open house',                                       NULL, '2026-11-20', 'promised',    6,  '2026-09-18 16:30:00'),
  ( 8,  3, 'sponsor_to_mecatron', 'in_kind',        'Weekly pool time for AUV/ROV testing (AY2026/27)',                              NULL, '2026-12-31', 'in_progress', 6,  '2026-08-01 10:00:00'),
  ( 9,  3, 'mecatron_to_sponsor', 'other',          'Semester pool safety plan and incident log',                                    NULL, '2026-08-15', 'fulfilled',   8,  '2026-07-15 10:00:00'),
  (10,  4, 'sponsor_to_mecatron', 'cash',           'Sponsorship for SAUVC 2027 campaign',                                         5000.00, '2026-12-31', 'promised',    5,  '2026-07-15 15:00:00'),
  (11,  4, 'mecatron_to_sponsor', 'logo_placement', 'GPS Lands logo on AUV hull, team T-shirts and SAUVC 2027 poster',               NULL, '2026-11-30', 'in_progress', 5,  '2026-07-15 15:00:00'),
  (12,  6, 'sponsor_to_mecatron', 'in_kind',        'Discounted SLS/MJF printing of thruster mounts and housings (value up to S$3,000)', 3000.00, '2026-03-31', 'fulfilled', 7, '2026-01-12 10:00:00'),
  (13,  6, 'mecatron_to_sponsor', 'other',          'Social-media feature post on LayerForge-printed parts',                         NULL, '2026-09-30', 'in_progress', 6,  '2026-01-12 10:00:00'),
  (14,  7, 'sponsor_to_mecatron', 'in_kind',        'Two free PCB batches (power distribution and sensor boards)',                1200.00, '2026-02-28', 'fulfilled',   9,  '2026-01-20 10:00:00'),
  (15,  7, 'mecatron_to_sponsor', 'logo_placement', 'CircuitHarbour logo on PCB silkscreen and team banner',                         NULL, '2026-03-31', 'fulfilled',   9,  '2026-01-20 10:00:00'),
  (16,  8, 'sponsor_to_mecatron', 'cash',           'Gold sponsorship 2024 incl. freight of ROV to MATE 2024',                   10000.00, '2024-05-01', 'fulfilled',   1,  '2024-03-12 15:00:00'),
  (17,  8, 'sponsor_to_mecatron', 'cash',           'Gold sponsorship 2026',                                                     10000.00, '2026-06-30', 'fulfilled',   1,  '2026-03-05 16:00:00'),
  (18,  8, 'mecatron_to_sponsor', 'report',         'Sponsor impact report for the 2026 season',                                    NULL, '2026-10-15', 'in_progress', 1,  '2026-03-05 16:00:00'),
  (19,  8, 'mecatron_to_sponsor', 'event',          'Co-branded marine-science outreach workshop for primary-school students',      NULL, '2026-11-14', 'promised',    6,  '2026-03-05 16:00:00'),
  (20, 10, 'sponsor_to_mecatron', 'in_kind',        'Simulation and cloud software licences (2024-2025)',                        2500.00, '2024-07-01', 'fulfilled',   4,  '2024-06-20 14:00:00'),
  (21, 10, 'mecatron_to_sponsor', 'logo_placement', 'Kelpwave logo on team website',                                                NULL, '2024-08-01', 'fulfilled',   4,  '2024-06-20 14:00:00'),
  (22, 10, 'sponsor_to_mecatron', 'in_kind',        'Licence renewal for 2025-2026',                                             2500.00, '2025-07-01', 'cancelled',   4,  '2025-05-01 10:00:00');

-- ---------------------------------------------------------------------
-- interactions (2024-2026)
-- ---------------------------------------------------------------------
INSERT INTO interactions (id, sponsor_id, contact_id, member_id, case_id, channel, direction,
                          occurred_at, subject, summary, key_decisions) VALUES
  ( 1,  1,  1,  1, NULL, 'meeting', 'outbound', '2024-01-15 10:00:00', 'FY2024 grant kickoff',
        'Presented build plan for the first AUV and SAUVC 2024 entry.', 'S$15,000 grant approved; FY2024 report due 31 Jan 2025.'),
  ( 2,  6, 13,  7, NULL, 'email',   'outbound', '2024-01-20 14:00:00', 'Request for 3D-printing support',
        'Asked for a student rate on SLS parts for thruster mounts.', 'Student discount agreed for 2024.'),
  ( 3,  3,  6,  6, NULL, 'email',   'outbound', '2024-02-05 09:30:00', 'Pool booking for SAUVC 2024 practice',
        'Requested weekend lanes Feb-Apr 2024.', 'Saturday morning slots granted; safety plan required.'),
  ( 4,  7, 15,  9, NULL, 'call',    'outbound', '2024-02-10 15:00:00', 'PCB sponsorship introduction',
        'Intro call about board fabrication support.', 'One free batch for 2024 in exchange for logo on silkscreen.'),
  ( 5,  8, 17,  1, NULL, 'meeting', 'outbound', '2024-03-12 11:00:00', 'Sponsorship pitch',
        'Pitched gold tier and asked for help shipping the ROV to the USA.', 'Gold tier S$10,000 plus freight to MATE 2024.'),
  ( 6,  1,  3,  1, NULL, 'email',   'outbound', '2024-04-20 18:00:00', 'SAUVC 2024 results - 3rd place',
        'Shared our 3rd-place finish at the Singapore AUV Challenge 2024 with the faculty advisor.', NULL),
  ( 7,  2,  4,  1, NULL, 'email',   'outbound', '2024-04-22 10:00:00', 'SAUVC 2024: 3rd place built in the Dyson-NTU Studio',
        'Thanked the foundation; AUV was built in the Dyson-NTU Studio.', NULL),
  ( 8,  1,  2, 11, NULL, 'email',   'outbound', '2024-05-06 09:00:00', 'Travel subsidy claim for MATE 2024',
        'Submitted claim for MATE ROV World Championship travel.', 'S$8,000 subsidy approved.'),
  ( 9,  8, 18, 11, NULL, 'email',   'inbound',  '2024-05-10 13:20:00', 'Freight booking confirmation - ROV to USA',
        'Operations confirmed air freight to Tennessee.', 'ROV crate to be ready by 25 May 2024.'),
  (10,  8, 17,  1, NULL, 'email',   'outbound', '2024-07-02 10:00:00', 'MATE ROV World Championship 2024 recap',
        'Shared photos and results from the Explorer Class in Kingsport, Tennessee (June 2024).', NULL),
  (11, 10, 22,  4, NULL, 'meeting', 'outbound', '2024-06-20 14:00:00', 'Simulation licence partnership',
        'Discussed licences for vehicle simulation.', 'Licences for 2024-2025 in exchange for logo on website.'),
  (12,  2,  5,  6, NULL, 'event',   'outbound', '2024-09-14 09:00:00', 'Marine-science outreach workshop (2024)',
        'Primary-school students built simple ROVs at the Dyson-NTU Studio.', 'Run the workshop annually.'),
  (13,  1,  1,  1, NULL, 'email',   'outbound', '2025-01-28 17:00:00', 'FY2024 report submission',
        'Submitted the FY2024 technical & financial report.', NULL),
  (14,  4,  8,  5, NULL, 'meeting', 'outbound', '2025-02-10 15:00:00', 'Introductory meeting with GPS Lands',
        'First meeting; introduced the team and competition calendar.', 'Revisit before the 2027 season.'),
  (15, 10, 22,  4, NULL, 'email',   'inbound',  '2025-06-30 09:00:00', 'Licence renewal not continued',
        'Kelpwave is pausing its university programme.', 'Relationship lapsed; revisit in 2027.'),
  (16,  6, 13,  7, NULL, 'email',   'outbound', '2026-01-12 10:00:00', 'Printing request for 2026 vehicle',
        'Sent STL files for thruster mounts and housings.', 'Up to S$3,000 of discounted printing; feature post in return.'),
  (17,  7, 15,  9, NULL, 'email',   'outbound', '2026-01-20 11:00:00', 'PCB batch order 2026',
        'Ordered power distribution and sensor boards.', 'Two free batches; logo on silkscreen.'),
  (18,  1,  1,  1, NULL, 'meeting', 'outbound', '2026-01-20 10:00:00', 'FY2026 funding discussion',
        'Discussed FY2026 grant in two tranches.', 'Tranche 2 (S$18,000) after mid-year report.'),
  (19,  8, 17,  1, NULL, 'call',    'outbound', '2026-03-05 16:00:00', 'Renewal of gold sponsorship',
        'Discussed 2026 renewal.', 'Renewed at S$10,000; impact report due 15 Oct; co-branded workshop in Nov.'),
  (20,  9, 20, 11, NULL, 'email',   'outbound', '2026-05-04 10:00:00', 'Battery sponsorship enquiry',
        'Asked about in-kind Li-ion battery packs.', NULL),
  (21,  9, 20, 11, NULL, 'email',   'inbound',  '2026-06-10 15:30:00', 'VoltCell declines sponsorship this cycle',
        'Budget already committed for 2026.', 'Declined; revisit in 2027.'),
  (22,  4,  8,  5, NULL, 'email',   'inbound',  '2026-07-15 15:00:00', 'GPS Lands confirms SAUVC 2027 sponsorship',
        'Confirmed S$5,000 for the SAUVC 2027 campaign.', 'Logo placement on AUV, shirts and poster.'),
  (23,  3,  6,  8, NULL, 'email',   'outbound', '2026-08-01 10:00:00', 'Semester pool safety plan',
        'Submitted safety plan and incident log for AY2026/27 Sem 1.', 'Weekly slots confirmed for the semester.'),
  (24,  5, 11,  5, NULL, 'event',   'outbound', '2026-08-20 13:00:00', 'Met Abyssal Sensing at maritime tech expo',
        'Introduced Mecatron at their booth.', 'Robin to share academic programme details.'),
  (25,  5, 11,  5, NULL, 'email',   'inbound',  '2026-09-02 09:45:00', 'Abyssal Sensing academic programme',
        'Shared information on sensor loans and discounts for universities.', NULL),
  (26,  2,  5,  6, NULL, 'event',   'outbound', '2026-09-12 09:00:00', 'Marine-science outreach workshop (2026)',
        'Over 40 primary-school students built simple ROVs.', NULL),
  (27,  2,  4,  1,    2, 'email',   'outbound', '2026-09-18 16:30:00', 'Thank You from Mecatron NTU',
        'Thank-you email for 2026 support (case ER-002), sent manually by Timothy.', 'Invited to Dyson-NTU Studio open house in Nov.'),
  (28,  1,  3,  4, NULL, 'other',   'internal_note', '2026-10-05 12:00:00', 'Note: tranche 2 prerequisites',
        'Faculty advisor reminded us tranche 2 needs the mid-year report first.', NULL),
  (29,  4,  9,  5, NULL, 'email',   'inbound',  '2026-10-10 11:00:00', 'Logo files on request',
        'Corporate comms will provide logo files once a formal request is received.', 'Raise a logo request case.'),
  (30,  8, 17,  6, NULL, 'email',   'inbound',  '2026-10-20 09:00:00', 'Reminder: sponsor impact report',
        'Dana asked about the impact report due 15 Oct.', 'Promised report by end of October.'),
  (31,  3,  7,  8, NULL, 'call',    'outbound', '2026-10-22 16:00:00', 'November pool slots',
        'Checked lane availability before sending ER-004.', 'Slots look available; formal request needed.');

-- ---------------------------------------------------------------------
-- follow_up_tasks (overdue / upcoming / done / cancelled, as of Oct 2026)
-- ---------------------------------------------------------------------
INSERT INTO follow_up_tasks (id, sponsor_id, interaction_id, commitment_id, assigned_member_id, description,
                             priority, due_date, status, completed_at) VALUES
  ( 1,  8,   30, 18,  1, 'Finish and send the 2026 sponsor impact report to Straits Meridian',       'high',   '2026-10-15', 'in_progress', NULL),
  ( 2,  6, NULL, 13,  6, 'Publish the LayerForge social-media feature post',                          'medium', '2026-09-30', 'open',        NULL),
  ( 3,  4,   29, 11,  5, 'Chase GPS Lands vector logo once ER-001 is sent',                           'high',   '2026-10-25', 'open',        NULL),
  ( 4,  5,   25, NULL, 5, 'Confirm DVL model and quantity with Software for ER-003 v2',               'medium', '2026-10-20', 'in_progress', NULL),
  ( 5,  1,   28,  5,  4, 'Collect sub-team inputs for the FY2026 mid-year report',                    'high',   '2026-10-24', 'open',        NULL),
  ( 6,  1, NULL,  5,  4, 'Submit FY2026 mid-year progress report',                                    'high',   '2026-11-15', 'open',        NULL),
  ( 7,  2,   27,  7,  6, 'Plan AUV demo logistics for the Dyson-NTU Studio open house',               'medium', '2026-11-10', 'open',        NULL),
  ( 8,  3,   31,  8,  8, 'Confirm November pool slots after ER-004 is sent',                          'medium', '2026-11-02', 'open',        NULL),
  ( 9,  8, NULL, 19,  6, 'Prepare co-branded outreach workshop materials',                            'medium', '2026-11-07', 'in_progress', NULL),
  (10,  4, NULL, 11,  7, 'Mock up logo placement on the AUV hull for GPS Lands approval',             'low',    '2026-11-20', 'open',        NULL),
  (11, 10,   15, NULL, 4, 'Reconnect with Kelpwave about 2027 licences',                              'low',    '2027-01-15', 'open',        NULL),
  (12,  1,   13,  3,  1, 'Submit FY2024 report to the College',                                       'high',   '2025-01-31', 'done',        '2025-01-28 17:00:00'),
  (13,  3,   23,  9,  8, 'Submit semester pool safety plan',                                          'high',   '2026-08-15', 'done',        '2026-08-01 10:00:00'),
  (14,  7,   17, 15,  9, 'Add CircuitHarbour logo to PCB silkscreen',                                 'medium', '2026-03-15', 'done',        '2026-02-20 18:00:00'),
  (15,  2,   26, NULL, 1, 'Send thank-you to the James Dyson Foundation (ER-002)',                    'medium', '2026-09-20', 'done',        '2026-09-18 16:30:00'),
  (16,  9,   21, NULL, 11, 'Record VoltCell decline and set a 2027 revisit date',                     'low',    '2026-06-20', 'done',        '2026-06-12 09:00:00'),
  (17,  9,   20, NULL, 11, 'Send follow-up on battery sponsorship (ER-006)',                          'low',    '2026-06-15', 'cancelled',   NULL),
  (18,  8,   10, 16,  1, 'Send MATE 2024 photos and results to Straits Meridian',                     'medium', '2024-07-10', 'done',        '2024-07-02 10:00:00');

-- ---------------------------------------------------------------------
-- documents
-- ---------------------------------------------------------------------
INSERT INTO documents (sponsor_id, title, doc_type, url_or_path, uploaded_by) VALUES
  (NULL, 'Mecatron Sponsorship Deck 2026',               'deck',         'https://drive.example.com/mecatron/er/sponsorship-deck-2026.pdf',      1),
  (NULL, 'Mecatron Sponsorship Proposal Template 2026',  'proposal',     'https://drive.example.com/mecatron/er/proposal-template-2026.docx',    5),
  (1,    'FY2024 Technical & Financial Report',          'report',       'https://drive.example.com/mecatron/er/coe/fy2024-report.pdf',          1),
  (3,    'Pool Safety Plan AY2026/27 Sem 1',             'report',       'https://drive.example.com/mecatron/ops/pool-safety-ay2627s1.pdf',      8),
  (4,    'GPS Lands Sponsorship Confirmation 2026',      'contract',     'https://drive.example.com/mecatron/er/gps-lands/confirmation-2026.pdf',5),
  (5,    'Abyssal Sensing Proposal (v2 draft)',          'proposal',     'https://drive.example.com/mecatron/er/abyssal/proposal-v2.docx',       5),
  (7,    'CircuitHarbour Logo (vector)',                 'logo',         'https://drive.example.com/mecatron/brand/sponsors/circuitharbour.svg', 9),
  (8,    'Straits Meridian Sponsorship Agreement 2026',  'contract',     'https://drive.example.com/mecatron/er/straits-meridian/agreement-2026.pdf', 1),
  (2,    'ER-002 Thank-you Email Thread',                'email_thread', 'https://drive.example.com/mecatron/er/dyson/er-002-thread.eml',        1);

COMMIT;
