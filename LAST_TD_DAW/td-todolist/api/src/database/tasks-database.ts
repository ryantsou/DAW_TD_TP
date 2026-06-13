import { SQLiteDatabase } from "./sqlite-database";

export class TasksDatabase extends SQLiteDatabase
{
    public constructor()
    {
        super("./database/tasks-db.sqlite");
    }

    public init()
    {
        this.execute(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                content TEXT,
                done BOOLEAN
            )`)
    }
}