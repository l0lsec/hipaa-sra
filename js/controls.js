/* ============================================================
   HIPAA SRA Tool — Controls Data
   22 controls across 4 safeguard categories
   Each control: id, category key, description, CFR reference, guidance
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
    key: 'docs',
    label: 'Policies, Procedures & Documentation',
    cfr: '45 CFR § 164.316',
    description: 'Requirements for maintaining written security policies, procedures, and records that demonstrate compliance over time.'
  }
];

const CONTROLS = [
  // ── Administrative Safeguards (9 controls) ──────────────────────
  {
    id: 'ADM-01',
    cat: 'admin',
    text: 'Has a comprehensive risk analysis been performed within the past twelve months to identify threats and vulnerabilities to all ePHI the organization creates, receives, maintains, or transmits?',
    ref: '§ 164.308(a)(1)(ii)(A) — Risk Analysis',
    guidance: 'Conduct an inventory of every system, application, and data store that touches ePHI. Map data flows across network boundaries. Use a recognized framework (NIST SP 800-30, OCTAVE, or similar) to systematically identify threat sources and vulnerabilities. Document findings in a risk register.'
  },
  {
    id: 'ADM-02',
    cat: 'admin',
    text: 'Is there a documented risk management plan that assigns owners, sets remediation priorities, and tracks deadlines for reducing identified risks to a reasonable and appropriate level?',
    ref: '§ 164.308(a)(1)(ii)(B) — Risk Management',
    guidance: 'Create a written plan that lists each identified risk, the responsible owner, the chosen mitigation strategy (accept, transfer, mitigate, or avoid), a target completion date, and current status. Review progress at least quarterly.'
  },
  {
    id: 'ADM-03',
    cat: 'admin',
    text: 'Has a specific individual been designated as the security official responsible for developing and implementing the organization\'s security policies and procedures?',
    ref: '§ 164.308(a)(2) — Assigned Security Responsibility',
    guidance: 'Formally designate a named individual (e.g., CISO, Security Officer, or Privacy Officer) in writing. The designation letter should outline their authority, duties, and reporting structure. Ensure the role is known organization-wide.'
  },
  {
    id: 'ADM-04',
    cat: 'admin',
    text: 'Are workforce members authorized, supervised, and promptly deprovisioned upon termination or role change to ensure only appropriate individuals have access to ePHI?',
    ref: '§ 164.308(a)(3) — Workforce Security',
    guidance: 'Implement onboarding checklists that tie system access to job role. Use HR-driven triggers to revoke credentials immediately on termination. Conduct periodic access reviews (at least annually) to confirm current employees still require their level of access.'
  },
  {
    id: 'ADM-05',
    cat: 'admin',
    text: 'Is access to ePHI granted on a role-based, minimum-necessary basis with documented authorization procedures for each information system?',
    ref: '§ 164.308(a)(4) — Information Access Management',
    guidance: 'Define role-based access control (RBAC) profiles for every job function. Require written or ticketed approval before granting access. Document who approved, what was granted, and when. Re-certify permissions annually.'
  },
  {
    id: 'ADM-06',
    cat: 'admin',
    text: 'Do all workforce members receive security awareness training upon hire and at regular intervals, including education on phishing, password hygiene, and incident reporting?',
    ref: '§ 164.308(a)(5) — Security Awareness and Training',
    guidance: 'Deliver training within the first 30 days of employment and at least annually thereafter. Cover topics such as recognizing phishing attempts, creating strong passwords, reporting suspicious activity, and handling ePHI safely. Track completion and test comprehension with quizzes or simulated phishing exercises.'
  },
  {
    id: 'ADM-07',
    cat: 'admin',
    text: 'Are contingency plans in place — including data backups, disaster recovery procedures, and an emergency mode operations plan — that have been tested within the past year?',
    ref: '§ 164.308(a)(7) — Contingency Plan',
    guidance: 'Maintain documented backup procedures with defined Recovery Point Objectives (RPO) and Recovery Time Objectives (RTO). Store backups offsite or in a geographically separate cloud region. Test restoration at least annually and document results. Have a written emergency mode plan for sustaining critical operations during a crisis.'
  },
  {
    id: 'ADM-08',
    cat: 'admin',
    text: 'Are periodic technical and non-technical evaluations conducted to confirm that security policies and controls remain effective and aligned with operational changes?',
    ref: '§ 164.308(a)(8) — Evaluation',
    guidance: 'Schedule vulnerability scans, penetration tests, or configuration audits at least annually and after significant environmental changes (new systems, mergers, relocations). Complement technical assessments with policy reviews to ensure documentation matches actual practice.'
  },
  {
    id: 'ADM-09',
    cat: 'admin',
    text: 'Are Business Associate Agreements executed with every third party that creates, receives, maintains, or transmits ePHI on behalf of your organization?',
    ref: '§ 164.308(b)(1) — Business Associate Contracts',
    guidance: 'Maintain a registry of all vendors that handle ePHI. Ensure each has a signed BAA that specifies permitted uses, safeguards, breach notification obligations, and termination conditions. Review BAAs at contract renewal and when scope changes.'
  },

  // ── Physical Safeguards (4 controls) ────────────────────────────
  {
    id: 'PHY-01',
    cat: 'physical',
    text: 'Are physical access controls — such as badge readers, key management, visitor logs, and locked server areas — in place to limit facility access to authorized personnel?',
    ref: '§ 164.310(a)(1) — Facility Access Controls',
    guidance: 'Secure server rooms, network closets, and areas storing devices with ePHI using electronic locks or keyed entry. Maintain a visitor sign-in log. Escort visitors in sensitive areas. Review access card assignments quarterly and revoke immediately upon role changes or termination.'
  },
  {
    id: 'PHY-02',
    cat: 'physical',
    text: 'Are policies defined for the proper use of workstations that access ePHI, covering location, surroundings, and acceptable activities?',
    ref: '§ 164.310(b) — Workstation Use',
    guidance: 'Establish a written workstation use policy that specifies where ePHI may be accessed (e.g., not in public areas), screen positioning to prevent shoulder surfing, and prohibitions on personal use that could introduce risk. Include remote work and telehealth settings in the policy.'
  },
  {
    id: 'PHY-03',
    cat: 'physical',
    text: 'Are workstations physically secured through measures such as automatic screen locks, cable locks, private offices, or secure docking stations?',
    ref: '§ 164.310(c) — Workstation Security',
    guidance: 'Enforce automatic screen lock after 5 minutes of inactivity via Group Policy or MDM. Use cable locks for laptops in shared spaces. Locate workstations so screens face away from public sight lines. For home offices, require a private workspace with a locking door.'
  },
  {
    id: 'PHY-04',
    cat: 'physical',
    text: 'Are policies and procedures governing the disposal, re-use, transfer, and off-site movement of electronic media containing ePHI documented and followed?',
    ref: '§ 164.310(d)(1) — Device and Media Controls',
    guidance: 'Maintain a hardware inventory that tracks devices containing ePHI. Before disposal or re-use, sanitize media using NIST SP 800-88 compliant methods (wipe, degauss, or shred). Log all media movements. Encrypt portable devices so data remains protected if a device is lost during transport.'
  },

  // ── Technical Safeguards (6 controls) ───────────────────────────
  {
    id: 'TEC-01',
    cat: 'technical',
    text: 'Are unique user identifiers assigned to every workforce member, with multi-factor authentication and emergency access procedures implemented for systems containing ePHI?',
    ref: '§ 164.312(a)(1) — Access Control',
    guidance: 'Every user must have a unique ID — never share accounts. Enable multi-factor authentication (MFA) on all systems handling ePHI, including VPN, EHR, and cloud platforms. Document a break-glass procedure for emergency access and audit its use after every invocation.'
  },
  {
    id: 'TEC-02',
    cat: 'technical',
    text: 'Are audit logs enabled on all systems that store or process ePHI, capturing login attempts, data access, privilege changes, and administrative actions?',
    ref: '§ 164.312(b) — Audit Controls',
    guidance: 'Configure logging on EHR systems, email gateways, VPN concentrators, cloud tenants, and database servers. Forward logs to a centralized SIEM or log management platform. Retain logs for at least six years per HIPAA documentation requirements. Review logs regularly for anomalies.'
  },
  {
    id: 'TEC-03',
    cat: 'technical',
    text: 'Are technical integrity controls deployed — such as anti-malware software, file integrity monitoring, or application allow-listing — to guard ePHI against improper alteration or destruction?',
    ref: '§ 164.312(c)(1) — Integrity',
    guidance: 'Deploy endpoint protection (anti-virus / EDR) on all workstations and servers. Enable automatic updates for signatures and engines. Consider file integrity monitoring on critical databases. Use checksums or digital signatures to verify data integrity during transfers.'
  },
  {
    id: 'TEC-04',
    cat: 'technical',
    text: 'Is all ePHI encrypted when transmitted over electronic networks using current TLS standards or equivalent transport-layer protection?',
    ref: '§ 164.312(e)(1) — Transmission Security',
    guidance: 'Enforce TLS 1.2 or higher on all network communications carrying ePHI, including web traffic, email (STARTTLS), VPN tunnels, and API calls. Disable legacy protocols (SSL 3.0, TLS 1.0/1.1). Monitor certificate expiration and rotate annually or upon compromise.'
  },
  {
    id: 'TEC-05',
    cat: 'technical',
    text: 'Is ePHI encrypted at rest on all storage systems — including servers, databases, laptops, and removable media — using validated encryption standards?',
    ref: '§ 164.312(a)(2)(iv) — Encryption at Rest',
    guidance: 'Use AES-256 or equivalent for all data at rest. On Windows use BitLocker; on macOS use FileVault; on Linux use LUKS. For cloud storage, enable server-side encryption with customer-managed keys where possible. Verify encryption status through regular audits.'
  },
  {
    id: 'TEC-06',
    cat: 'technical',
    text: 'Are mobile devices and endpoints that access ePHI enrolled in a management platform (MDM / UEM) with remote wipe, policy enforcement, and compliance monitoring capabilities?',
    ref: '§ 164.312(d) — Device Management',
    guidance: 'Deploy a Mobile Device Management or Unified Endpoint Management solution (e.g., Microsoft Intune, Jamf, VMware Workspace ONE). Enforce device-level PIN/biometric, encryption, OS version compliance, and app restrictions. Enable remote lock and wipe for lost or stolen devices. Report on non-compliant devices weekly.'
  },

  // ── Policies, Procedures & Documentation (3 controls) ──────────
  {
    id: 'DOC-01',
    cat: 'docs',
    text: 'Are written security policies and procedures maintained, reviewed at least annually, and updated whenever operational or environmental changes affect ePHI security?',
    ref: '§ 164.316(a) — Policies and Procedures',
    guidance: 'Maintain a policy library covering all HIPAA administrative, physical, and technical safeguard requirements. Assign an owner to each policy. Review and version-update at least annually or after significant changes (new systems, acquisitions, regulatory updates). Distribute updates and obtain staff acknowledgment.'
  },
  {
    id: 'DOC-02',
    cat: 'docs',
    text: 'Is there a documented incident response plan that defines roles, escalation paths, breach determination procedures, and notification timelines aligned with the HIPAA Breach Notification Rule?',
    ref: '§ 164.316(a) / § 164.308(a)(6) — Incident Response',
    guidance: 'Create an incident response plan with clear definitions of what constitutes a security incident versus a breach. Define response team roles, internal escalation paths, forensic evidence preservation steps, and regulatory notification timelines (60 days for HHS, state AG, affected individuals). Conduct a tabletop exercise at least annually.'
  },
  {
    id: 'DOC-03',
    cat: 'docs',
    text: 'Are all security-related records — including risk assessments, policies, training logs, BAAs, and incident reports — retained for a minimum of six years from the date of creation or last effective date?',
    ref: '§ 164.316(b)(1) — Documentation',
    guidance: 'Establish a records retention schedule that meets the six-year minimum. Store documents in a secure, backed-up repository with access controls. Include version history so superseded policies remain retrievable. Periodically verify that retention is enforced and that records have not been prematurely purged.'
  }
];
