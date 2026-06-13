import { Database } from "./database";
import Sqlite3 from "better-sqlite3";

export class SQLiteDatabase implements Database
{
    private db: Sqlite3.Database;
    private lastInsertId: number | bigint | null;

    public constructor(dbPath: string)
    {
        this.db = Sqlite3(dbPath);
        this.lastInsertId = null;
    }

    public select(query: string, params: any[] = []): any[]
    {
        const statement = this.db.prepare(query);
        const results = statement.all(...params);
        return results ?? [];
    }

    public execute(query: string, params: any[] = []): boolean
    {
        try
        {
            const statement = this.db.prepare(query);
            const results = statement.run(...params);

            this.lastInsertId = results.lastInsertRowid !== 0 ? results.lastInsertRowid : null;

            return results.changes !== 0;
        }
        catch (error)
        {
            console.log(error);
            return false;
        }
    }

    public getLastInsertId() : number | bigint | null
    { 
        return this.lastInsertId; 
    }
}