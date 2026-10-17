import { pgTable, text, timestamp, uuid, boolean, numeric, jsonb, integer } from 'drizzle-orm/pg-core';

// 1. Identity & Authorization
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  title: text('title').notNull(),
  department: text('department').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  role: text('role').notNull(),
  password: text('password').notNull(),
  responsibilities: text('responsibilities'),
  avatar: text('avatar'),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

export const roles = pgTable('roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  description: text('description')
});

export const permissions = pgTable('permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  module: text('module').notNull()
});

// 2. CRM & Clients
export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  orgName: text('org_name').notNull(),
  contactPerson: text('contact_person').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  location: text('location').notNull(),
  industry: text('industry').notNull(),
  clientType: text('client_type').notNull(),
  assignedManagerId: uuid('assigned_manager_id').references(() => users.id),
  requirements: text('requirements'),
  status: text('status').default('Prospect').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

// 3. Document Management
export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  reference: text('reference').notNull().unique(),
  category: text('category').notNull(),
  description: text('description'),
  fileUrl: text('file_url'),
  clientName: text('client_name'),
  projectName: text('project_name'),
  owner: text('owner').notNull(),
  department: text('department').notNull(),
  confidentiality: text('confidentiality').default('Internal').notNull(),
  status: text('status').default('Approved').notNull(),
  version: text('version').default('1.0').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

// 4. Negotiations & Commercial
export const negotiations = pgTable('negotiations', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  client: text('client').notNull(),
  opportunity: text('opportunity').notNull(),
  owner: text('owner').notNull(),
  participants: jsonb('participants').default([]).notNull(),
  meetingDate: text('meeting_date'),
  clientRequirements: text('client_requirements'),
  initialProposal: text('initial_proposal'),
  counteroffers: text('counteroffers'),
  notes: text('notes'),
  risks: text('risks'),
  nextAction: text('next_action'),
  followUpDate: text('follow_up_date'),
  status: text('status').default('In Discussion').notNull()
});

// 5. Projects & Milestones
export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  client: text('client').notNull(),
  scope: text('scope').notNull(),
  owner: text('owner').notNull(),
  team: jsonb('team').default([]).notNull(),
  startDate: text('start_date').notNull(),
  targetDate: text('target_date').notNull(),
  status: text('status').default('In Progress').notNull(),
  budget: text('budget'),
  milestones: jsonb('milestones').default([]).notNull(),
  deliverables: text('deliverables')
});

// 6. Tasks & Operations
export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  assignedTo: text('assigned_to').notNull(),
  createdBy: text('created_by').notNull(),
  clientOrProject: text('client_or_project'),
  priority: text('priority').default('Medium').notNull(),
  dueDate: text('due_date').notNull(),
  status: text('status').default('Not Started').notNull(),
  progress: integer('progress').default(0).notNull()
});

// 7. Contracts
export const contracts = pgTable('contracts', {
  id: uuid('id').primaryKey().defaultRandom(),
  reference: text('reference').notNull().unique(),
  title: text('title').notNull(),
  client: text('client').notNull(),
  project: text('project'),
  parties: jsonb('parties').default([]).notNull(),
  owner: text('owner').notNull(),
  startDate: text('start_date').notNull(),
  expirationDate: text('expiration_date').notNull(),
  value: text('value').notNull(),
  status: text('status').default('Active').notNull(),
  approvalStatus: text('approval_status').default('Approved').notNull(),
  signedDocumentUrl: text('signed_document_url')
});

// 8. Board Members & Governance
export const boardMembers = pgTable('board_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  position: text('position').notNull(),
  appointmentDate: text('appointment_date').notNull(),
  termEndDate: text('term_end_date'),
  contact: text('contact').notNull(),
  bio: text('bio'),
  status: text('status').default('Active').notNull()
});

// 9. Meetings & Minutes
export const meetings = pgTable('meetings', {
  id: uuid('id').primaryKey().defaultRandom(),
  subject: text('subject').notNull(),
  clientOrProject: text('client_or_project'),
  channel: text('channel').notNull(),
  participants: jsonb('participants').default([]).notNull(),
  dateTime: text('date_time').notNull(),
  summary: text('summary'),
  decisions: text('decisions'),
  actionItems: text('action_items'),
  nextFollowUp: text('next_follow_up')
});

// 10. Reminders
export const reminders = pgTable('reminders', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  dueDate: text('due_date').notNull(),
  priority: text('priority').default('Medium').notNull(),
  recordLink: text('record_link'),
  status: text('status').default('Active').notNull()
});

// 11. Audit Logs
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  actor: text('actor').notNull(),
  action: text('action').notNull(),
  timestamp: text('timestamp').notNull(),
  ip: text('ip').notNull()
});

// 12. Portfolio Case Studies
export const portfolio = pgTable('portfolio', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  projectTitle: text('project_title'),
  client: text('client').notNull(),
  industry: text('industry').notNull(),
  category: text('category').notNull(),
  summary: text('summary'),
  problem: text('problem').notNull(),
  solution: text('solution').notNull(),
  keyImprovements: jsonb('key_improvements').default([]),
  businessImpact: text('business_impact'),
  status: text('status').default('Published').notNull(),
  completionDate: text('completion_date').notNull(),
  result: text('result')
});

// 13. Company Settings
export const companySettings = pgTable('company_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyName: text('company_name').notNull(),
  tagline: text('tagline').notNull(),
  location: text('location').notNull(),
  emails: jsonb('emails').default([]).notNull(),
  phones: jsonb('phones').default([]).notNull(),
  logoUrl: text('logo_url'),
  primaryColor: text('primary_color').notNull(),
  accentColor: text('accent_color').notNull()
});

// 14. Contact Submissions
export const contactSubmissions = pgTable('contact_submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject'),
  organizationName: text('organization_name'),
  message: text('message').notNull(),
  status: text('status').default('New').notNull(),
  requestReference: text('request_reference').unique(),
  submissionKey: text('submission_key').unique(),
  organizationType: text('organization_type'),
  solutionType: text('solution_type'),
  recommendation: text('recommendation'),
  assignedStaffId: uuid('assigned_staff_id').references(() => users.id),
  internalNotes: text('internal_notes'),
  clientId: uuid('client_id').references(() => clients.id),
  projectId: uuid('project_id').references(() => projects.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  reportType: text('report_type').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  content: text('content').default('').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

export const staffSessions = pgTable('staff_sessions', {
  tokenHash: text('token_hash').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull()
});
