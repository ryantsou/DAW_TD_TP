"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksDatabase = void 0;
const sqlite_database_1 = require("./sqlite-database");
class TasksDatabase extends sqlite_database_1.SQLiteDatabase {
    constructor() {
        super("./database/tasks-db.sqlite");
    }
    init() {
        this.execute(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                content TEXT,
                done BOOLEAN
            )`);
    }
}
exports.TasksDatabase = TasksDatabase;
