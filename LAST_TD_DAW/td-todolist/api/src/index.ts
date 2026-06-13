import { TasksController } from "./controllers/tasks-controller";
import { TasksDatabase } from "./database/tasks-database";
import { Server } from "./server/server";

const db = new TasksDatabase();
db.init();

const server = new Server(8080);

server.registerRoutes([
    { method: "GET", url: "/tasks", handle: TasksController.findAll },
    { method: "POST", url: "/tasks", handle: TasksController.create },
    { method: "PUT", url: "/tasks/:taskId", handle: TasksController.update },
    { method: "DELETE", url: "/tasks/:taskId", handle: TasksController.delete },
]);

server.start();