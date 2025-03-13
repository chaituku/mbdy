// src/lib/db.ts
import { D1Database } from '@cloudflare/workers-types';

// Define the database interface
export interface DB {
  prepare: (query: string) => {
    bind: (...values: any[]) => {
      all: () => Promise<any[]>;
      first: () => Promise<any | null>;
      run: () => Promise<any>;
    };
  };
  exec: (query: string) => Promise<any>;
}

// Get the database instance
export function getDB(): DB {
  // In production, this would be the actual D1 database
  // For development, we'll use a mock implementation until we connect to the real DB
  const mockDB: DB = {
    prepare: (query: string) => {
      console.log(`Preparing query: ${query}`);
      return {
        bind: (...values: any[]) => {
          console.log(`Binding values: ${values.join(', ')}`);
          return {
            all: async () => {
              console.log('Executing query (all)');
              return [];
            },
            first: async () => {
              console.log('Executing query (first)');
              return null;
            },
            run: async () => {
              console.log('Executing query (run)');
              return {};
            },
          };
        },
      };
    },
    exec: async (query: string) => {
      console.log(`Executing query: ${query}`);
      return {};
    },
  };

  return mockDB;
}

// Export the database instance
export const db = getDB();
