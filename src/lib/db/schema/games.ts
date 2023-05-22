import { mysqlTable, timestamp, uniqueIndex, varchar, serial } from 'drizzle-orm/mysql-core'
import { type InferModel } from 'drizzle-orm'

export const games = mysqlTable(
    'games', {
        id: serial('id').primaryKey().notNull(),
        title: varchar('title', { length: 191 }).notNull(),
        description: varchar('description', { length: 191 }).notNull(),
        createdAt: timestamp('createdAt').defaultNow().onUpdateNow().notNull(),
        updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
    },
    (game) => ({
        emailIndex: uniqueIndex('games__id__idx').on(game.id),
    }),
)