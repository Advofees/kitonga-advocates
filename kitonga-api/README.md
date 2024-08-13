# Advokit: Advocacy and Case Management Suite

## Entity Relationship Diagram

![ERD Diagram](./erd.svg)

# Generate a progressive form to input: 
- Phase 1 Client Details :name. :email, :contact_number, :address, :case_details, :is_prime

- Phase 2 Case Details: :title, :description, :case_number, :status and a place where documents related to the case can be attached

- Phase 3 Payment Details: :deposit, :total

# DATABASE_URL=postgres://special_potato:password@db:5433/advocate

*****

# release: rails db:migrate db:seed

## Payment Types
- Full
- Deposit
- Installment

## Roles

- **Admin**: Administrator with full system access
- **Advocate**: Legal representative for clients
- **Client**: Individual seeking legal assistance
- **Senior Advocate**: Experienced legal practitioner with higher authority
- **Junior Advocate**: Entry-level legal practitioner
- **Associate Advocate**: Legal professional associated with a senior advocate
- **Managing Partner**: Managing partner of a law firm
- **Partner**: Equity partner in a law firm
- **Paralegal**: Legal assistant supporting advocates
- **Legal Secretary**: Secretary providing administrative support to legal professionals
- **Law Clerk**: Legal research assistant
- **Court Clerk**: Administrator in a court of law
- **Mediator**: Neutral third party assisting in dispute resolution
- **Arbitrator**: Individual resolving disputes outside of the court system
- **Law Student**: Student pursuing a legal education
- **Legal Consultant**: Expert providing legal advice and consultation
- **Legal Analyst**: Professional analyzing legal issues and trends
- **Compliance Officer**: Ensures legal compliance within organizations
- **Legal Researcher**: Conducts in-depth research on legal matters
- **Investigator**: Gathers evidence for legal cases
- **Human Rights Advocate**: Promotes and defends human rights
- **Environmental Advocate**: Focuses on environmental law and issues
- **Corporate Counsel**: Provides legal advice to corporations
- **Family Law Advocate**: Specializes in family and domestic law cases
- **Criminal Defense Advocate**: Defends individuals accused of criminal offenses
- **Prosecutor**: Represents the state in criminal cases
- **Immigration Advocate**: Deals with immigration and nationality law
- **Estate Planning Advocate**: Helps clients plan their estates and wills
- **Intellectual Property Advocate**: Focuses on intellectual property law
- **Tax Advocate**: Specializes in tax law and regulations


## User Groups

- **Admin Team**: Administrators with system management privileges
- **Legal Team**: Advocates, paralegals, and legal professionals
- **Clients**: Individuals seeking legal assistance
- **Support Staff**: Non-legal staff providing administrative support
- **Partners**: Equity partners in the law firm
- **Associates**: Junior and associate advocates
- **Clerks**: Law clerks and research assistants
- **Mediation Team**: Mediators and dispute resolution experts
- **Compliance Team**: Ensures legal compliance within the organization
- **Investigation Team**: Investigators gathering evidence for cases
- **Human Rights Advocates**: Champions of human rights and social justice
- **Specialists**: Advocates with expertise in specific legal areas
- **Case Management Team**: Professionals handling case details and updates
- **Tax Advisors**: Experts in tax law and regulations
- **Client Support**: Assists clients with case-related inquiries
- **Research Team**: Conducts legal research and analysis
- **Billing Team**: Handles financial aspects and payments
- **Court Personnel**: Personnel working within the court system
- **Academic Advisors**: Provides guidance to law students
- **Marketing Team**: Responsible for promoting legal services
- **Pro Bono Team**: Handles cases on a pro bono basis
- **Technology Team**: Manages the technology infrastructure
- **Ethics Committee**: Ensures ethical conduct within the organization
- **Public Relations**: Manages public image and communication
- **Lobbying Team**: Engages in legal advocacy and lobbying