import fastifyCors from "@fastify/cors";
import fastify, { FastifyInstance, FastifyReply, FastifyRequest, RouteHandlerMethod } from "fastify";

export type RouteHandle = (request: FastifyRequest, reply: FastifyReply) => void;
export type Route = {
    method: string,
    url: string,
    handle: RouteHandle
}
export class Server
{
    private fastify: FastifyInstance;
    private portNumber: number;

    public constructor(portNumber: number)
    {
        this.portNumber = portNumber;

        this.fastify = fastify();
        this.fastify.register(fastifyCors, { methods: ["GET", "HEAD", "POST", "DELETE", "PUT"]});
    }

    public registerRoutes(routes: Route[])
    {
        for(const route of routes)
        {
            switch(route.method)
            {
                case "GET": this.fastify.get(route.url, route.handle); break;
                case "POST": this.fastify.post(route.url, route.handle); break;
                case "DELETE": this.fastify.delete(route.url, route.handle); break;
                case "PUT": this.fastify.put(route.url, route.handle); break;
                case "PATCH": this.fastify.patch(route.url, route.handle); break;
                default: throw `Server::registerRoutes - Unknown method ${route.method}`;
            }
        }
    }

    public start()
    {
        this.fastify.listen({ port: this.portNumber });
    }
}