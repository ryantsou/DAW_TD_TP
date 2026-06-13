"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tasks_controller_1 = require("./controllers/tasks-controller");
const tasks_database_1 = require("./database/tasks-database");
const server_1 = require("./server/server");
const db = new tasks_database_1.TasksDatabase();
db.init();
const server = new server_1.Server(8080);
server.registerRoutes([
    { method: "GET", url: "/tasks", handle: tasks_controller_1.TasksController.findAll },
    { method: "POST", url: "/tasks", handle: tasks_controller_1.TasksController.create },
    { method: "PUT", url: "/tasks/:taskId", handle: tasks_controller_1.TasksController.update },
    { method: "DELETE", url: "/tasks/:taskId", handle: tasks_controller_1.TasksController.delete },
]);
server.start();
