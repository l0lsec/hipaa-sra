/* ============================================================
   HIPAA SRA Tool — Controls Data
   33 controls across 5 safeguard categories
   Each control: id, category key, description, CFR reference,
   guidance, remediation, applicableTo
   ============================================================ */

const CATEGORIES = [
  {
    key: 'admin',
    label: 'Administrative Safeguards',
    cfr: '45 CFR § 164.308',
    description: 'Management actions, policies, and procedures to govern the selection, development, implementation, and maintenance of security measures that protect ePHI.'
  },
  {
    key: 'physical',
    label: 'Physical Safeguards',
    cfr: '45 CFR § 164.310',
    description: 'Physical measures, policies, and procedures to protect electronic information systems, buildings, and equipment from natural and environmental hazards, as well as unauthorized intrusion.'
  },
  {
    key: 'technical',
    label: 'Technical Safeguards',
    cfr: '45 CFR § 164.312',
    description: 'Technology-based protections and the policies governing their use that safeguard electronic protected health information and control access to it.'
  },
  {
    key: 'organizational',
    label: 'Organizational Requirements',
    cfr: '45 CFR § 164.314',
    description: 'Standards for Business Associate contracts and arrangements, ensuring that entities handling ePHI on your behalf maintain appropriate safeguards.'
  },
  {
    key: 'docs',
    label: 'Policies, Procedures & Documentation',
    cfr: '45 CFR § 164.316',
    description: 'Requirements for maintaining written security policies, procedures, and records that demonstrate compliance over time.'
  }
];

const CONTROLS = [
  // ── Administrative Safeguards (11 controls) ─────────────────────
  {
    id: 'ADM-01',
    cat: 'admin',
    applicableTo: 'all',
    text: 'Has a comprehensive risk analysis been performed within the past twelve months to identify threats and vulnerabilities to all ePHI the organization creates, receives, maintains, or transmits?',
    ref: '§ 164.308(a)(1)(ii)(A) — Risk Analysis',
    guidance: 'Conduct an inventory of every system, application, and data store that touches ePHI. Map data flows across network boundaries. Use a recognized framework (NIST SP 800-30, OCTAVE, or similar) to systematically identify threat sources and vulnerabilities. Document findings in a risk register.',
    remediation: 'Conduct a comprehensive risk analysis identifying all systems containing ePHI, potential threats, vulnerabilities, and current security measures. Document findings and update at least annually.'
  },
  {
    id: 'ADM-02',
    cat: 'admin',
    applicableTo: 'all',
    text: 'Is there a documented risk management plan that assigns owners, sets remediation priorities, and tracks deadlines for reducing identified risks to a reasonable and appropriate level?',
    ref: '§ 164.308(a)(1)(ii)(B) — Risk Management',
    guidance: 'Create a written plan that lists each identified risk, the responsible owner, the chosen mitigation strategy (accept, transfer, mitigate, or avoid), a target completion date, and current status. Review progress at least quarterly.',
    remediation: 'Develop and implement a risk management program that addresses all identified risks. Prioritize based on likelihood and impact. Document all mitigation measures.'
  },
  {
    id: 'ADM-03',
    cat: 'admin',
    applicableTo: 'all',
    text: 'Has a specific individual been designated as the security official responsible for developing and implementing the organization\'s security policies and procedures?',
    ref: '§ 164.308(a)(2) — Assigned Security Responsibility',
    guidance: 'Formally designate a named individual (e.g., CISO, Security Officer, or Privacy Officer) in writing. The designation letter should outline their authority, duties, and reporting structure. Ensure the role is known organization-wide.',
    remediation: 'Formally designate a Security Official in writing. Document their responsibilities including policy development, implementation oversight, training coordination, and incident response leadership.'
  },
  {
    id: 'ADM-04',
    cat: 'admin',
    applicableTo: 'all',
    text: 'Are workforce members authorized, supervised, and promptly deprovisioned upon termination or role change to ensure only appropriate individuals have access to ePHI?',
    ref: '§ 164.308(a)(3) — Workforce Security',
    guidance: 'Implement onboarding checklists that tie system access to job role. Use HR-driven triggers to revoke credentials immediately on termination. Conduct periodic access reviews (at least annually) to confirm current employees still require their level of access.',
    remediation: 'Implement role-based access control (RBAC). Define access levels for each job function. Review and document access permissions. Use HR-driven triggers for immediate revocation on termination.'
  },
  {
    id: 'ADM-05',
    cat: 'admin',
    applicableTo: 'all',
    text: 'Is access to ePHI granted on a role-based, minimum-necessary basis with documented authorization procedures for each information system?',
    ref: '§ 164.308(a)(4) — Information Access Management',
    guidance: 'Define role-based access control (RBAC) profiles for every job function. Require written or ticketed approval before granting access. Document who approved, what was granted, and when. Re-certify permissions annually.',
    remediation: 'Define RBAC profiles for every job function. Require written approval before granting access. Document who approved, what was granted, and when. Re-certify permissions annually.'
  },
  {
    id: 'ADM-06',
    cat: 'admin',
    applicableTo: 'all',
    text: 'Do all workforce members receive security awareness training upon hire and at regular intervals, including education on phishing, password hygiene, and incident reporting?',
    ref: '§ 164.308(a)(5) — Security Awareness and Training',
    guidance: 'Deliver training within the first 30 days of employment and at least annually thereafter. Cover topics such as recognizing phishing attempts, creating strong passwords, reporting suspicious activity, and handling ePHI safely. Track completion and test comprehension with quizzes or simulated phishing exercises.',
    remediation: 'Implement comprehensive security training program including initial training for new hires and annual refresher training. Track completion and maintain records for 6 years.'
  },
  {
    id: 'ADM-07',
    cat: 'admin',
    applicableTo: 'all',
    text: 'Does your organization have documented policies and procedures for identifying, responding to, and reporting security incidents?',
    ref: '§ 164.308(a)(6) — Security Incident Procedures',
    guidance: 'Develop an incident response plan covering identification, containment, eradication, recovery, and lessons learned phases. Define response team roles, escalation procedures, and regulatory notification requirements.',
    remediation: 'Develop incident response plan including identification, containment, eradication, recovery, and lessons learned phases. Define roles, escalation procedures, and reporting requirements.'
  },
  {
    id: 'ADM-08',
    cat: 'admin',
    applicableTo: 'all',
    text: 'Are contingency plans in place — including data backups, disaster recovery procedures, and an emergency mode operations plan — that have been tested within the past year?',
    ref: '§ 164.308(a)(7) — Contingency Plan',
    guidance: 'Maintain documented backup procedures with defined Recovery Point Objectives (RPO) and Recovery Time Objectives (RTO). Store backups offsite or in a geographically separate cloud region. Test restoration at least annually and document results. Have a written emergency mode plan for sustaining critical operations during a crisis.',
    remediation: 'Develop comprehensive contingency plan including data backup, disaster recovery, and emergency mode operations. Define RTOs and RPOs. Test at least annually.'
  },
  {
    id: 'ADM-09',
    cat: 'admin',
    applicableTo: 'all',
    text: 'Are Business Associate Agreements executed with every third party that creates, receives, maintains, or transmits ePHI on behalf of your organization?',
    ref: '§ 164.308(b)(1) — Business Associate Contracts',
    guidance: 'Maintain a registry of all vendors that handle ePHI. Ensure each has a signed BAA that specifies permitted uses, safeguards, breach notification obligations, and termination conditions. Review BAAs at contract renewal and when scope changes.',
    remediation: 'Inventory all business associates. Execute compliant BAAs with each. Include required provisions per 45 CFR 164.314. Review agreements annually.'
  },
  {
    id: 'ADM-10',
    cat: 'admin',
    applicableTo: 'all',
    text: 'Are periodic technical and non-technical evaluations conducted to confirm that security policies and controls remain effective and aligned with operational changes?',
    ref: '§ 164.308(a)(8) — Evaluation',
    guidance: 'Schedule vulnerability scans, penetration tests, or configuration audits at least annually and after significant environmental changes (new systems, mergers, relocations). Complement technical assessments with policy reviews to ensure documentation matches actual practice.',
    remediation: 'Conduct annual security evaluations including policy review, technical testing, and compliance assessments. Document findings and remediation actions taken.'
  },
  {
    id: 'ADM-11',
    cat: 'admin',
    applicableTo: 'all',
    text: 'Does your organization have documented sanction policies for workforce members who violate security policies and procedures?',
    ref: '§ 164.308(a)(1)(ii)(C) — Sanction Policy',
    guidance: 'Organizations must have and apply appropriate sanctions against workforce members who fail to comply with security policies. The policy should define escalating consequences and be applied consistently.',
    remediation: 'Develop a written sanction policy defining consequences for security violations. Include in employee handbook and ensure consistent enforcement. Document all sanction actions.'
  },

  // ── Physical Safeguards (6 controls) ────────────────────────────
  {
    id: 'PHY-01',
    cat: 'physical',
    applicableTo: 'all',
    text: 'Are physical access controls — such as badge readers, key management, visitor logs, and locked server areas — in place to limit facility access to authorized personnel?',
    ref: '§ 164.310(a)(1) — Facility Access Controls',
    guidance: 'Secure server rooms, network closets, and areas storing devices with ePHI using electronic locks or keyed entry. Maintain a visitor sign-in log. Escort visitors in sensitive areas. Review access card assignments quarterly and revoke immediately upon role changes or termination.',
    remediation: 'Implement physical access controls including badge access, visitor management, camera surveillance, and access logs. Review access lists regularly.'
  },
  {
    id: 'PHY-02',
    cat: 'physical',
    applicableTo: 'all',
    text: 'Are policies defined for the proper use of workstations that access ePHI, covering location, surroundings, and acceptable activities?',
    ref: '§ 164.310(b) — Workstation Use',
    guidance: 'Establish a written workstation use policy that specifies where ePHI may be accessed (e.g., not in public areas), screen positioning to prevent shoulder surfing, and prohibitions on personal use that could introduce risk. Include remote work and telehealth settings in the policy.',
    remediation: 'Develop workstation use policies covering physical security, screen locks, clean desk, acceptable applications, and remote access requirements.'
  },
  {
    id: 'PHY-03',
    cat: 'physical',
    applicableTo: 'all',
    text: 'Are workstations physically secured through measures such as automatic screen locks, cable locks, private offices, or secure docking stations?',
    ref: '§ 164.310(c) — Workstation Security',
    guidance: 'Enforce automatic screen lock after 5 minutes of inactivity via Group Policy or MDM. Use cable locks for laptops in shared spaces. Locate workstations so screens face away from public sight lines. For home offices, require a private workspace with a locking door.',
    remediation: 'Implement workstation security including placement away from public view, cable locks, privacy screens, and secured rooms for servers. Enforce screen locks via policy.'
  },
  {
    id: 'PHY-04',
    cat: 'physical',
    applicableTo: 'all',
    text: 'Are policies and procedures governing the disposal, re-use, transfer, and off-site movement of electronic media containing ePHI documented and followed?',
    ref: '§ 164.310(d)(1) — Device and Media Controls',
    guidance: 'Maintain a hardware inventory that tracks devices containing ePHI. Before disposal or re-use, sanitize media using NIST SP 800-88 compliant methods (wipe, degauss, or shred). Log all media movements. Encrypt portable devices so data remains protected if a device is lost during transport.',
    remediation: 'Develop media handling policies covering receipt, storage, transfer, and disposal of all media types. Include encryption requirements and tracking procedures.'
  },
  {
    id: 'PHY-05',
    cat: 'physical',
    applicableTo: 'all',
    text: 'Does your organization have a facility security plan documenting safeguards to protect the facility and equipment from unauthorized physical access, tampering, and theft?',
    ref: '§ 164.310(a)(2)(ii) — Facility Security Plan',
    guidance: 'A comprehensive security plan documents all physical safeguards, access control methods, monitoring systems, and maintenance procedures. It should cover building security, environmental controls (fire suppression, HVAC), and contingency provisions for facility damage.',
    remediation: 'Develop facility security plan documenting all physical safeguards, access control methods, monitoring systems, and maintenance procedures.'
  },
  {
    id: 'PHY-06',
    cat: 'physical',
    applicableTo: 'all',
    text: 'Does your organization have procedures for final disposal of ePHI and the hardware or media on which it is stored?',
    ref: '§ 164.310(d)(2)(i) — Disposal',
    guidance: 'Proper disposal ensures ePHI cannot be recovered from discarded media. Methods include NIST SP 800-88 compliant secure deletion, degaussing, or physical destruction. Maintain certificates of destruction and disposal logs.',
    remediation: 'Implement disposal procedures including secure deletion, degaussing, or physical destruction. Obtain certificates of destruction. Maintain disposal logs.'
  },

  // ── Technical Safeguards (8 controls) ───────────────────────────
  {
    id: 'TEC-01',
    cat: 'technical',
    applicableTo: 'all',
    text: 'Are unique user identifiers assigned to every workforce member, with multi-factor authentication and emergency access procedures implemented for systems containing ePHI?',
    ref: '§ 164.312(a)(1) — Access Control',
    guidance: 'Every user must have a unique ID — never share accounts. Enable multi-factor authentication (MFA) on all systems handling ePHI, including VPN, EHR, and cloud platforms. Document a break-glass procedure for emergency access and audit its use after every invocation.',
    remediation: 'Implement access controls on all systems containing ePHI including authentication, authorization, and accounting mechanisms. Eliminate shared accounts.'
  },
  {
    id: 'TEC-02',
    cat: 'technical',
    applicableTo: 'all',
    text: 'Are audit logs enabled on all systems that store or process ePHI, capturing login attempts, data access, privilege changes, and administrative actions?',
    ref: '§ 164.312(b) — Audit Controls',
    guidance: 'Configure logging on EHR systems, email gateways, VPN concentrators, cloud tenants, and database servers. Forward logs to a centralized SIEM or log management platform. Retain logs for at least six years per HIPAA documentation requirements. Review logs regularly for anomalies.',
    remediation: 'Enable audit logging on all systems with ePHI. Capture login/logout, access, modifications, and administrative actions. Retain for 6 years minimum.'
  },
  {
    id: 'TEC-03',
    cat: 'technical',
    applicableTo: 'all',
    text: 'Are technical integrity controls deployed — such as anti-malware software, file integrity monitoring, or application allow-listing — to guard ePHI against improper alteration or destruction?',
    ref: '§ 164.312(c)(1) — Integrity',
    guidance: 'Deploy endpoint protection (anti-virus / EDR) on all workstations and servers. Enable automatic updates for signatures and engines. Consider file integrity monitoring on critical databases. Use checksums or digital signatures to verify data integrity during transfers.',
    remediation: 'Implement integrity controls including checksums, digital signatures, change detection, and backup verification. Deploy endpoint protection with automatic updates.'
  },
  {
    id: 'TEC-04',
    cat: 'technical',
    applicableTo: 'all',
    text: 'Is all ePHI encrypted when transmitted over electronic networks using current TLS standards or equivalent transport-layer protection?',
    ref: '§ 164.312(e)(1) — Transmission Security',
    guidance: 'Enforce TLS 1.2 or higher on all network communications carrying ePHI, including web traffic, email (STARTTLS), VPN tunnels, and API calls. Disable legacy protocols (SSL 3.0, TLS 1.0/1.1). Monitor certificate expiration and rotate annually or upon compromise.',
    remediation: 'Encrypt all ePHI transmissions using TLS 1.2 or higher. Implement VPN for remote access. Disable insecure protocols (SSL 3.0, TLS 1.0/1.1).'
  },
  {
    id: 'TEC-05',
    cat: 'technical',
    applicableTo: 'all',
    text: 'Is ePHI encrypted at rest on all storage systems — including servers, databases, laptops, and removable media — using validated encryption standards?',
    ref: '§ 164.312(a)(2)(iv) — Encryption at Rest',
    guidance: 'Use AES-256 or equivalent for all data at rest. On Windows use BitLocker; on macOS use FileVault; on Linux use LUKS. For cloud storage, enable server-side encryption with customer-managed keys where possible. Verify encryption status through regular audits.',
    remediation: 'Implement encryption for all ePHI at rest (AES-256) and in transit (TLS 1.2+). Document encryption standards and key management procedures.'
  },
  {
    id: 'TEC-06',
    cat: 'technical',
    applicableTo: 'all',
    text: 'Are mobile devices and endpoints that access ePHI enrolled in a management platform (MDM / UEM) with remote wipe, policy enforcement, and compliance monitoring capabilities?',
    ref: '§ 164.312(d) — Device Management',
    guidance: 'Deploy a Mobile Device Management or Unified Endpoint Management solution (e.g., Microsoft Intune, Jamf, VMware Workspace ONE). Enforce device-level PIN/biometric, encryption, OS version compliance, and app restrictions. Enable remote lock and wipe for lost or stolen devices. Report on non-compliant devices weekly.',
    remediation: 'Deploy MDM/UEM solution. Enforce device-level PIN/biometric, encryption, OS version compliance, and app restrictions. Enable remote lock and wipe.'
  },
  {
    id: 'TEC-07',
    cat: 'technical',
    applicableTo: 'all',
    text: 'Does your organization implement procedures to verify that persons or entities seeking access to ePHI are who they claim to be?',
    ref: '§ 164.312(d) — Person or Entity Authentication',
    guidance: 'Authentication verifies identity before granting access to ePHI. Implement strong authentication including complex passwords, biometric verification, and multi-factor authentication (MFA) for remote access and privileged accounts.',
    remediation: 'Implement strong authentication including complex passwords and multi-factor authentication (MFA) for remote access and privileged accounts.'
  },
  {
    id: 'TEC-08',
    cat: 'technical',
    applicableTo: 'all',
    text: 'Does your organization implement automatic logoff after a defined period of inactivity on systems containing ePHI?',
    ref: '§ 164.312(a)(2)(iii) — Automatic Logoff',
    guidance: 'Automatic logoff prevents unauthorized access to unattended workstations. Configure session timeouts on all systems accessing ePHI. Recommend 15 minutes or less for clinical areas, 30 minutes for administrative systems.',
    remediation: 'Configure automatic logoff/screen lock on all systems accessing ePHI. Recommend 15 minutes or less for clinical areas. Document timeout policies.'
  },

  // ── Organizational Requirements (3 controls) ───────────────────
  {
    id: 'ORG-01',
    cat: 'organizational',
    applicableTo: 'all',
    text: 'Do your Business Associate Agreements include all required provisions under the HIPAA Rules, including permitted uses, safeguards, breach notification, and termination conditions?',
    ref: '§ 164.314(a)(1) — Business Associate Contracts',
    guidance: 'BAAs must include specific provisions ensuring BAs protect ePHI appropriately. Review all BAAs against 45 CFR 164.314(a)(2) requirements including breach notification, subcontractor requirements, and termination conditions.',
    remediation: 'Review all BAAs against 45 CFR 164.314(a)(2) requirements. Update to include required provisions including breach notification, subcontractor requirements, and termination conditions.'
  },
  {
    id: 'ORG-02',
    cat: 'organizational',
    applicableTo: 'all',
    text: 'Do your BAAs require Business Associates to implement appropriate safeguards to protect the confidentiality, integrity, and availability of ePHI?',
    ref: '§ 164.314(a)(2)(i) — BA Safeguard Requirements',
    guidance: 'BAs must implement safeguards to protect the confidentiality, integrity, and availability of ePHI they handle. BAAs should specify encryption, access controls, audit logging, and incident response obligations.',
    remediation: 'Update BAAs to specify safeguard requirements including encryption, access controls, audit logging, and incident response obligations.'
  },
  {
    id: 'ORG-03',
    cat: 'organizational',
    applicableTo: 'all',
    text: 'Do your BAAs require Business Associates to report security incidents, including breaches of unsecured ePHI, within defined timeframes?',
    ref: '§ 164.314(a)(2)(i)(C) — BA Incident Reporting',
    guidance: 'BAs must report security incidents to enable covered entities to respond appropriately. Include specific incident reporting requirements in BAAs with defined timeframes (recommend 24-72 hours), designated contact information, and required details.',
    remediation: 'Include specific incident reporting requirements in BAAs including timeframes (recommend 24-72 hours), contact information, and required information to be reported.'
  },

  // ── Policies, Procedures & Documentation (5 controls) ──────────
  {
    id: 'DOC-01',
    cat: 'docs',
    applicableTo: 'all',
    text: 'Are written security policies and procedures maintained, reviewed at least annually, and updated whenever operational or environmental changes affect ePHI security?',
    ref: '§ 164.316(a) — Policies and Procedures',
    guidance: 'Maintain a policy library covering all HIPAA administrative, physical, and technical safeguard requirements. Assign an owner to each policy. Review and version-update at least annually or after significant changes (new systems, acquisitions, regulatory updates). Distribute updates and obtain staff acknowledgment.',
    remediation: 'Develop comprehensive security policies covering all Security Rule requirements. Review and update annually. Ensure policies are accessible to workforce.'
  },
  {
    id: 'DOC-02',
    cat: 'docs',
    applicableTo: 'all',
    text: 'Is there a documented incident response plan that defines roles, escalation paths, breach determination procedures, and notification timelines aligned with the HIPAA Breach Notification Rule?',
    ref: '§ 164.316(a) / § 164.308(a)(6) — Incident Response',
    guidance: 'Create an incident response plan with clear definitions of what constitutes a security incident versus a breach. Define response team roles, internal escalation paths, forensic evidence preservation steps, and regulatory notification timelines (60 days for HHS, state AG, affected individuals). Conduct a tabletop exercise at least annually.',
    remediation: 'Create incident response plan with clear definitions, response team roles, escalation paths, evidence preservation steps, and notification timelines. Test annually with tabletop exercises.'
  },
  {
    id: 'DOC-03',
    cat: 'docs',
    applicableTo: 'all',
    text: 'Are all security-related records — including risk assessments, policies, training logs, BAAs, and incident reports — retained for a minimum of six years from the date of creation or last effective date?',
    ref: '§ 164.316(b)(1) — Documentation Retention',
    guidance: 'Establish a records retention schedule that meets the six-year minimum. Store documents in a secure, backed-up repository with access controls. Include version history so superseded policies remain retrievable. Periodically verify that retention is enforced and that records have not been prematurely purged.',
    remediation: 'Implement document retention policy requiring minimum 6-year retention. Archive old versions of policies. Maintain audit trails for changes.'
  },
  {
    id: 'DOC-04',
    cat: 'docs',
    applicableTo: 'all',
    text: 'Are your security policies and procedures available to all workforce members responsible for implementing them?',
    ref: '§ 164.316(b)(2)(ii) — Documentation Availability',
    guidance: 'Policies must be accessible to those who need to follow them. Publish on an intranet, shared drive, or policy management platform. Communicate the location to all workforce members and include policy acknowledgment in new hire onboarding.',
    remediation: 'Publish policies on intranet or shared drive. Communicate location to all workforce. Include policy acknowledgment in onboarding process.'
  },
  {
    id: 'DOC-05',
    cat: 'docs',
    applicableTo: 'all',
    text: 'Does your organization review and update security documentation periodically and in response to environmental or operational changes?',
    ref: '§ 164.316(b)(2)(iii) — Documentation Updates',
    guidance: 'Policies must be updated to reflect environmental and operational changes. Establish an annual review schedule. Update policies when regulations, technology, or operations change. Document all revisions with version control.',
    remediation: 'Establish annual policy review schedule. Update policies when regulations, technology, or operations change. Document all revisions with version history.'
  }
];
