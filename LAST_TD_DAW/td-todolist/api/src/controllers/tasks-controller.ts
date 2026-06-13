import { FastifyReply, FastifyRequest } from "fastify";
import { TasksDatabase } from "../database/tasks-database";

type TaskCreationData = {
    content: string
}

type TaskUpdateData = {
    content: string,
    done: number
}

export class TasksController
{
    public static findAll(request: FastifyRequest, reply: FastifyReply)
    {
        const db = new TasksDatabase();
        reply.send(db.select("SELECT * FROM tasks;"));
    }

    public static create(request: FastifyRequest, reply: FastifyReply)
    {
        const { content } = request.body as TaskCreationData;

        const db = new TasksDatabase();

        if (db.execute("INSERT INTO tasks (content, done) VALUES (?, ?)", [content, 0]))
            reply.code(201).send({ id: db.getLastInsertId() });
        else
            reply.code(500).send();
    }

    public static update(request: FastifyRequest, reply: FastifyReply)
    {
        const { taskId } = request.params as { taskId: number };
        const { content, done } = request.body as TaskUpdateData;

        const db = new TasksDatabase();

        if (db.execute("UPDATE tasks SET content = ?, done = ? WHERE id = ?", [content, done ?? 0, taskId]))
            reply.code(204).send();
        else
            reply.code(500).send();
    }

    public static delete(request: FastifyRequest, reply: FastifyReply)
    {
        const { taskId } = request.params as { taskId: number };

        const db = new TasksDatabase();

        if (db.execute("DELETE FROM tasks WHERE id = ?", [taskId]))
            reply.code(204).send();
        else
            reply.code(500).send();
    }
}