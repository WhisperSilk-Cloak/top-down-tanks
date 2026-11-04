import {sqliteTable,text,integer} from 'drizzle-orm/sqlite-core';
export const rooms=sqliteTable('rooms',{code:text('code').primaryKey(),lastActive:integer('last_active').notNull().default(0),p0:text('p0').notNull(),p1:text('p1'),chat:text('chat').notNull().default('[]'),state:text('state').notNull(),version:integer('version').notNull().default(0)});

export const visitors=sqliteTable('visitors',{token:text('token').primaryKey(),name:text('name').notNull()});
export const channels=sqliteTable('channels',{id:text('id').primaryKey(),messages:text('messages').notNull().default('[]')});
