"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksController = void 0;
const tasks_database_1 = require("../database/tasks-database");
class TasksController {
    static findAll(request, reply) {
        const db = new tasks_database_1.TasksDatabase();
        reply.send(db.select("SELECT * FROM tasks;"));
    }
    static create(request, reply) {
        const { content } = request.body;
        const db = new tasks_database_1.TasksDatabase();
        if (db.execute("INSERT INTO tasks (content, done) VALUES (?, ?)", [content, 0]))
            reply.code(201).send({ id: db.getLastInsertId() });
        else
            reply.code(500).send();
    }
    static update(request, reply) {
        const { taskId } = request.params;
        const { content, done } = request.body;
        const db = new tasks_database_1.TasksDatabase();
        if (db.execute("UPDATE tasks SET content = ?, done = ? WHERE id = ?", [content, done ?? 0, taskId]))
            reply.code(204).send();
        else
            reply.code(500).send();
    }
    static delete(request, reply) {
        const { taskId } = request.params;
        const db = new tasks_database_1.TasksDatabase();
        if (db.execute("DELETE FROM tasks WHERE id = ?", [taskId]))
            reply.code(204).send();
        else
            reply.code(500).send();
    }
}
exports.TasksController = TasksController;
