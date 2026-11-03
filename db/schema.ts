import {sqliteTable,text,integer} from 'drizzle-orm/sqlite-core';
export const documents=sqliteTable('documents',{id:text('id').primaryKey(),body:text('body').notNull(),updated:text('updated').notNull()});
export const versions=sqliteTable('versions',{id:text('id').primaryKey(),body:text('body').notNull(),created:text('created').notNull(),actor:text('actor').notNull(),note:text('note').notNull()});
export const users=sqliteTable('users',{email:text('email').primaryKey(),hash:text('hash').notNull(),salt:text('salt').notNull(),role:text('role').notNull(),created:text('created').notNull()});
export const sessions=sqliteTable('sessions',{token:text('token').primaryKey(),email:text('email').notNull(),expires:integer('expires').notNull()});
export const media=sqliteTable('media',{id:text('id').primaryKey(),name:text('name').notNull(),type:text('type').notNull(),size:integer('size').notNull(),created:text('created').notNull()});
export const inquiries=sqliteTable('inquiries',{id:text('id').primaryKey(),body:text('body').notNull(),created:text('created').notNull(),status:text('status').notNull()});
export const throttle=sqliteTable('throttle',{id:text('id').primaryKey(),count:integer('count').notNull(),until:integer('until').notNull()});
