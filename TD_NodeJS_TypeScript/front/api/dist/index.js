"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Importe la fonction Fastify depuis le paquet fastify
const fastify_1 = __importDefault(require("fastify"));
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const cors_1 = __importDefault(require("@fastify/cors"));
//Crée une instance de Fastify
const fastify = (0, fastify_1.default)();
//Ajout module CORS
fastify.register(cors_1.default);
const db = (0, better_sqlite3_1.default)("/home/RAJHONSON/Documents/TEDA/ESIREM/TD_NodeJS_TypeScript/front/api/database/db.sqlite");
//Crée une route HTTP GET vers l’URL /
//fastify.get("/", (request, reply) => {
//Envoie une string en réponse au client
//reply.send("Hello World !");
fastify.get("/users", (request, reply) => {
    const query = db.prepare("SELECT * FROM user;");
    const results = query.all();
    reply.send(results);
});
fastify.post("/users", async (request, reply) => {
    const { data1, data2, data3 } = request.body;
    try {
        const stmt = db.prepare("INSERT INTO user(name, mail, password) VALUES(?,?,?)");
        const result = stmt.run(data1, data2, data3);
        reply.code(201).send({ id: result.lastInsertRowid, changes: result.changes });
    }
    catch (err) {
        reply.code(500).send({ error: "Database error", detail: String(err) });
    }
});
//Démarre le serveur Web qui écoutera sur le port 8080
fastify.listen({ port: 8080 });
