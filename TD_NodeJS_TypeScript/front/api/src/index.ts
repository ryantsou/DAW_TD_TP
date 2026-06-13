//Importe la fonction Fastify depuis le paquet fastify
import Fastify from "fastify";
import Sqlite3 from "better-sqlite3";
import cors from "@fastify/cors";


//Crée une instance de Fastify
const fastify = Fastify();
//Ajout module CORS
fastify.register(cors);
const db = Sqlite3("/home/RAJHONSON/Documents/TEDA/ESIREM/TD_NodeJS_TypeScript/front/api/database/db.sqlite");



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
  type ReceiveDataType = { data1: string; data2: string; data3: string };
  const { data1, data2, data3 } = request.body as ReceiveDataType;

  try {
    const stmt = db.prepare("INSERT INTO user(name, mail, password) VALUES(?,?,?)");
    const result = stmt.run(data1, data2, data3);
    reply.code(201).send({ id: result.lastInsertRowid, changes: result.changes });
  } catch (err) {
    reply.code(500).send({ error: "Database error", detail: String(err) });
  }
});


//Démarre le serveur Web qui écoutera sur le port 8080
fastify.listen({port : 8080});

