/**
 * @description Base entity schema with ID and timestamp fields
 * @author Assistant
 */

import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { sqliteTable, SQLiteTableWithColumns } from 'drizzle-orm/sqlite-core';
import { cuidId } from '../helpers/id-helper';
import { timestamps } from '../helpers/timestamp-helper';

export type TBaseEntity = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
};

export const baseColumns = {
    id: cuidId,
    createdAt: timestamps.createdAt,
    updatedAt: timestamps.updatedAt,
} as const;

/**
 * Creates a new SQLite table with base entity fields (id and timestamps)
 * @param name The name of the table
 * @param columns Additional columns for the table
 * @returns A SQLite table with base entity fields and additional columns
 */
export function createTable<TTableName extends string, TColumns extends Record<string, any>>(
    name: TTableName,
    columns: TColumns
) {
    return sqliteTable(name, {
        ...baseColumns,
        ...columns,
    });
}

export type TBaseTable<T extends SQLiteTableWithColumns<any>> = InferSelectModel<T>;
export type TBaseInsert<T extends SQLiteTableWithColumns<any>> = InferInsertModel<T>; 