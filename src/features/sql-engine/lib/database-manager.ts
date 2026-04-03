import type { Database as SqlJsDatabase, SqlJsStatic } from "sql.js"

import type { QueryResult } from "@/src/features/sql-engine/types"
import { SEED_SQL } from "@/src/features/sql-engine/lib/seed-data"

let sqlJsModule: SqlJsStatic | null = null

const loadSqlJs = async (): Promise<SqlJsStatic> => {
  if (sqlJsModule) {
    return sqlJsModule
  }

  const initSqlJs = (await import("sql.js")).default

  sqlJsModule = await initSqlJs({
    locateFile: (file: string) => `/${file}`,
  })

  return sqlJsModule
}

export const createDatabase = async (): Promise<SqlJsDatabase> => {
  const SQL = await loadSqlJs()
  const db = new SQL.Database()
  db.run(SEED_SQL)
  return db
}

export const executeSQL = (db: SqlJsDatabase, sql: string): QueryResult => {
  const results = db.exec(sql)
  const affectedRows = db.getRowsModified()

  if (results.length === 0) {
    return {
      columns: [],
      values: [],
      rowCount: 0,
      affectedRows,
    }
  }

  const lastResult = results[results.length - 1]

  return {
    columns: lastResult.columns,
    values: lastResult.values as (string | number | null)[][],
    rowCount: lastResult.values.length,
    affectedRows,
  }
}

export const destroyDatabase = (db: SqlJsDatabase | null): void => {
  if (db) {
    db.close()
  }
}
