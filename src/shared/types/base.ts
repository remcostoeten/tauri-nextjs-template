/**
 * @description Base type definitions for the application
 */

import { TBaseTable } from "@/api/db/schema/base-entity";
import { SQLiteTableWithColumns } from "drizzle-orm/sqlite-core";

/**
 * Base entity interface that all domain entities should extend
 */
export type TBaseEntity = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
};

/**
 * Helper type to create a domain entity type from a Drizzle table
 */
export type TEntityFromTable<T extends SQLiteTableWithColumns<any>> = TBaseTable<T>;

/**
 * Base response type for all API responses
 */
export type TBaseResponse<T = void> = {
    success: boolean;
    data?: T;
    error?: string;
};

/**
 * Base mutation response type for all API mutations
 */
export type TBaseMutationResponse<T = void> = TBaseResponse<T> & {
    message?: string;
    redirect?: string;
}; 