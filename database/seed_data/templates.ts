/**
 * Email templates, one per scenario
 */

export const emailTemplates = [
  {
    id: 1,
    name: 'Sponsorship Request - Standard',
    scenario: 'sponsorship_request',
    subject_template: 'Sponsorship Opportunity with Mecatron NTU - {{sponsor_name}}',
    body_template:
      "Dear {{contact_name}},\n\nI am {{member_name}}, {{member_role}} of Mecatron, NTU Singapore's student marine-robotics team building autonomous and remotely operated underwater vehicles. Since our founding in 2023 we placed 3rd at the Singapore AUV Challenge (SAUVC) 2024 and competed in the MATE ROV World Championship 2024 (Explorer Class) in Kingsport, Tennessee.\n\n{{custom_ask}}\n\nIn return, {{sponsor_name}} would receive {{benefits}}.\n\nWould you be open to a short call in the coming weeks?\n\nBest regards,\n{{member_name}}\n{{member_role}}, Mecatron NTU",
    is_active: true,
  },
  {
    id: 2,
    name: 'Thank You - Post-Event',
    scenario: 'thank_you',
    subject_template: 'Thank You from Mecatron NTU',
    body_template:
      'Dear {{contact_name}},\n\nOn behalf of Mecatron NTU, thank you for {{support_description}}. {{impact_statement}}\n\nWe look forward to continuing our partnership with {{sponsor_name}}.\n\nWarm regards,\n{{member_name}}\n{{member_role}}, Mecatron NTU',
    is_active: true,
  },
  {
    id: 3,
    name: 'Follow-up - Gentle Reminder',
    scenario: 'follow_up',
    subject_template: 'Following up: {{original_subject}}',
    body_template:
      'Dear {{contact_name}},\n\nI hope you are well. I am following up on my email of {{original_date}} regarding {{topic}}.\n\n{{custom_ask}}\n\nPlease let me know if any further information would help.\n\nBest regards,\n{{member_name}}\n{{member_role}}, Mecatron NTU',
    is_active: true,
  },
  {
    id: 4,
    name: 'Logo Request for Sponsor Placement',
    scenario: 'logo_request',
    subject_template: 'Request for Sponsor Logo - Mecatron NTU',
    body_template:
      "Dear {{contact_name}},\n\nThank you for {{sponsor_name}}'s support of Mecatron NTU. As part of our sponsor recognition, we will place your logo on {{placement_locations}}.\n\nCould you share a high-resolution vector logo (AI, SVG or EPS) and any brand guidelines by {{deadline}}? We will send a mock-up for your approval before printing.\n\nBest regards,\n{{member_name}}\n{{member_role}}, Mecatron NTU",
    is_active: true,
  },
  {
    id: 5,
    name: 'Event / Venue Coordination',
    scenario: 'event_coordination',
    subject_template: '{{event_name}} - Coordination Request',
    body_template:
      'Dear {{contact_name}},\n\nMecatron NTU would like to arrange {{event_name}} on {{event_dates}}.\n\nDetails:\n- Purpose: {{purpose}}\n- Participants: {{headcount}}\n- Requirements: {{requirements}}\n\nPlease let us know if these dates work or if alternatives are available.\n\nBest regards,\n{{member_name}}\n{{member_role}}, Mecatron NTU',
    is_active: true,
  },
  {
    id: 6,
    name: 'Funding Update',
    scenario: 'funding_update',
    subject_template: 'Mecatron NTU - Funding Update {{period}}',
    body_template:
      "Dear {{contact_name}},\n\nHere is a brief update on how {{sponsor_name}}'s funding has been used during {{period}}:\n\n{{spend_summary}}\n\nUpcoming milestones: {{milestones}}\n\n{{custom_ask}}\n\nThank you for your continued support.\n\nBest regards,\n{{member_name}}\n{{member_role}}, Mecatron NTU",
    is_active: true,
  },
  {
    id: 7,
    name: 'Report Submission',
    scenario: 'report_submission',
    subject_template: '{{report_name}} - Mecatron NTU',
    body_template:
      'Dear {{contact_name}},\n\nPlease find attached our {{report_name}} covering {{period}}. Highlights include:\n\n{{highlights}}\n\nWe are happy to walk you through the report at your convenience.\n\nBest regards,\n{{member_name}}\n{{member_role}}, Mecatron NTU',
    is_active: true,
  },
]
