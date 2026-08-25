import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const profiles = sqliteTable('profiles', {
  id: text('id').primaryKey(),
  publicId: text('public_id').notNull().unique(),
  coachId: text('coach_id').notNull(),
  displayName: text('display_name').notNull(),
  age: integer('age'),
  hobbies: text('hobbies').notNull(),
  dreamJob: text('dream_job').notNull(),
  learningInterest: text('learning_interest').notNull(),
  funFact: text('fun_fact').notNull(),
  icon: text('icon').notNull(),
  theme: text('theme').notNull(),
  projectMessage: text('project_message').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull(),
  consentChecked: integer('consent_checked', { mode: 'boolean' }).notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (table) => [index('idx_profiles_coach_updated').on(table.coachId, table.updatedAt)]);

export const profileEvents = sqliteTable('profile_events', {
  id: text('id').primaryKey(),
  profileId: text('profile_id').notNull(),
  eventType: text('event_type').notNull(),
  actorId: text('actor_id').notNull(),
  createdAt: text('created_at').notNull(),
}, (table) => [index('idx_profile_events_profile').on(table.profileId, table.createdAt)]);

