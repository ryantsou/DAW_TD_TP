"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const cors_1 = __importDefault(require("@fastify/cors"));
const fastify_1 = __importDefault(require("fastify"));
class Server {
    fastify;
    portNumber;
    constructor(portNumber) {
        this.portNumber = portNumber;
        this.fastify = (0, fastify_1.default)();
        this.fastify.register(cors_1.default, { methods: ["GET", "HEAD", "POST", "DELETE", "PUT"] });
    }
    registerRoutes(routes) {
        for (const route of routes) {
            switch (route.method) {
                case "GET":
                    this.fastify.get(route.url, route.handle);
                    break;
                case "POST":
                    this.fastify.post(route.url, route.handle);
                    break;
                case "DELETE":
                    this.fastify.delete(route.url, route.handle);
                    break;
                case "PUT":
                    this.fastify.put(route.url, route.handle);
                    break;
                case "PATCH":
                    this.fastify.patch(route.url, route.handle);
                    break;
                default: throw `Server::registerRoutes - Unknown method ${route.method}`;
            }
        }
    }
    start() {
        this.fastify.listen({ port: this.portNumber });
    }
}
exports.Server = Server;
