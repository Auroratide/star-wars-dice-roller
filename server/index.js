import path from "node:path"
import Fastify from "fastify"
import FastifyStatic from "@fastify/static"
import FastifyWebsocket from "@fastify/websocket"

const PORT = 3000

const fastify = Fastify({ logger: true })

fastify.register(FastifyStatic, {
   root: path.join(import.meta.dirname, "..", "client"),
})

const clients = new Set()
fastify.register(FastifyWebsocket)
fastify.register(async (fastify) => {
   fastify.get("/connection", { websocket: true }, (socket, req) => {
      clients.add(socket)

      socket.on("message", (message) => {
         for (const client of clients) {
            if (client !== socket && client.readyState === 1) {
               client.send(message.toString())
            }
         }
      })

      socket.on("close", () => {
         clients.delete(socket)
      })
   })
})

fastify.listen({ port: PORT }, (err, address) => {
   if (err) throw err

   fastify.log.info(`Server is running on ${address}`)
})
