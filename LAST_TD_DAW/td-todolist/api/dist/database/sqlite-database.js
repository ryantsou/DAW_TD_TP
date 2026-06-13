"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLiteDatabase = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
class SQLiteDatabase {
    db;
    lastInsertId;
    constructor(dbPath) {
        this.db = (0, better_sqlite3_1.default)(dbPath);
        this.lastInsertId = null;
    }
    select(query, params = []) {
        const statement = this.db.prepare(query);
        const results = statement.all(...params);
        return results ?? [];
    }
    execute(query, params = []) {
        try {
            const statement = this.db.prepare(query);
            const results = statement.run(...params);
            this.lastInsertId = results.lastInsertRowid !== 0 ? results.lastInsertRowid : null;
            return results.changes !== 0;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    getLastInsertId() {
        return this.lastInsertId;
    }
}
exports.SQLiteDatabase = SQLiteDatabase;
