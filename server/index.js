import path from "node:path"
import Fastify from "fastify"
import Static from "@fastify/static"
import Websocket from "@fastify/websocket"
import Multipart from "@fastify/multipart"
import { roll } from "./roll.js"
import { rollResultMessage } from "./messages.js"

const PORT = 3000

const fastify = Fastify({ logger: true })

fastify.register(Static, {
	root: path.join(import.meta.dirname, "..", "client"),
})
fastify.register(Websocket)
fastify.register(Multipart, {
	attachFieldsToBody: true,
})

const clients = new Set()
function sendToAll(obj, sender = undefined) {
	for (const client of clients) {
		if (client !== sender && client.readyState === 1) {
			client.send(JSON.stringify(obj))
		}
	}
}

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

function broadcastRoll(forid, dice) {
	const result = roll(dice)

	fastify.log.debug(result)
	sendToAll(rollResultMessage(forid, result))
}

fastify.post("/roll", async (req, res) => {
	const getStr = (name) => req.body[name].value
	const getInt = (name) => parseInt(getStr(name))

	const forid = getStr("forid")
	const dice = {
		ability: getInt("ability"),
		proficiency: getInt("proficiency"),
		boost: getInt("boost"),
		difficulty: getInt("difficulty"),
		challenge: getInt("challenge"),
		setback: getInt("setback"),
		force: getInt("force"),
	}

	setTimeout(() => broadcastRoll(forid, dice), 0)

	res.code(202)
	return ""
})

fastify.listen({ port: PORT }, (err, address) => {
	if (err) throw err

	fastify.log.info(`Server is running on ${address}`)
})
