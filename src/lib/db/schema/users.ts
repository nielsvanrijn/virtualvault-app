import { mysqlTable, bigint, timestamp, uniqueIndex, varchar, boolean } from 'drizzle-orm/mysql-core'
import { relations, type InferModel } from 'drizzle-orm'

export const users = mysqlTable(
    'auth_user', {
        // id: serial('id').primaryKey().notNull(),
        id: varchar('id', { length: 15 }).primaryKey().notNull(),
        email: varchar('email', { length: 191 }).notNull(),
        emailVerified: timestamp('emailVerified'),
        verificationCode: varchar('verificationCode', { length: 255 }),
    },
    (user) => ({
        emailIndex: uniqueIndex('users__email__idx').on(user.email),
        verificationCodeIndex: uniqueIndex('users__verificationCode__idx').on(user.verificationCode),
    }),
)
export const usersRelations = relations(users, ({ many }) => ({
    sessions: many(sessions),
    keys: many(keys),
    authenticators: many(authenticators),
}))
export type User = InferModel<typeof users>;
export type NewUser = InferModel<typeof users, 'insert'>;

export const sessions = mysqlTable(
    'auth_session', {
        id: varchar('id', {length: 128}).primaryKey(),
        userId: varchar('user_id', {length: 15}).notNull(),
        activeExpires: bigint('active_expires', {mode: 'number'}).notNull(),
        idleExpires: bigint('idle_expires', {mode: 'number'}).notNull(),
    },
)
export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
}))
export type Session = InferModel<typeof sessions>;
export type NewSession = InferModel<typeof sessions, 'insert'>;

export const keys = mysqlTable(
    'auth_key', {
        id: varchar('id', {length: 255}).primaryKey(),
        userId: varchar('user_id', {length: 15}).notNull(),
        primaryKey: boolean('primary_key').notNull(),
        hashedPassword: varchar('hashed_password', {length: 255}),
        expires: bigint('expires', {mode: 'number'}),
    }
)
export const keysRelations = relations(keys, ({ one }) => ({
    user: one(users, {
        fields: [keys.userId],
        references: [users.id],
    }),
}))
export type Key = InferModel<typeof keys>;
export type NewKey = InferModel<typeof keys, 'insert'>;

export const authenticators = mysqlTable(
    'auth_authenticator', {
        credentialID: varchar('credential_id', {length: 255}).primaryKey(),
        credentialPublicKey: varchar('credential_public_key', {length: 255}),
        counter: bigint('counter', {mode: 'number'}),
        credentialDeviceType: varchar('credential_device_type', {length: 255}),
        credentialBackedUp: boolean('credential_backed_up'),
        transports: varchar('transports', {length: 255}),
        userId: varchar('user_id', {length: 15}).notNull(),
    }
)
export const authenticatorsRelations = relations(authenticators, ({ one }) => ({
    user: one(users, {
        fields: [authenticators.userId],
        references: [users.id],
    }),
}))
export type Authenticator = InferModel<typeof authenticators>;
export type NewAuthenticator = InferModel<typeof authenticators, 'insert'>;
