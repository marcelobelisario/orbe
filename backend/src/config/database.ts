import Database from 'better-sqlite3'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const dbDirectory = path.resolve(__dirname, '../../db')
const dbPath = process.env.ORBE_DB_PATH ?? path.join(dbDirectory, 'orbe.db')

export const db = new Database(dbPath)
db.pragma('foreign_keys = ON')

if (db.pragma('user_version', { simple: true }) === 0) {
    const initialize = db.transaction(() => {
        if (db.pragma('user_version', { simple: true }) === 0) {
            db.exec(readFileSync(path.join(dbDirectory, 'schema.sql'), 'utf8'))
        }
    })
    initialize.immediate()
}
