const rollers = [...document.querySelectorAll("sw-roller")]
const socket = new WebSocket("ws://localhost:3000/connection")

socket.addEventListener("open", () => {
	console.log("Opened connection")
})

socket.addEventListener("close", () => {
	console.warn("Closed connection")
})

socket.addEventListener("message", (e) => {
	const data = JSON.parse(e.data)
	console.log("Received: ", data)

	if (data.type === "roll result") {
		document.querySelector(`#${data.forid}`).showResult(data.dice)
	}

	if (data.type === "field change") {
		rollers.find((it) => it.id === data.forid)?.changeField?.(data.field, data.value)
	}
})

rollers.forEach((roller) => {
	roller.addEventListener("change", (e) => {
		socket.send(JSON.stringify({
			type: "field change",
			forid: e.target.id,
			field: e.detail.field,
			value: e.detail.value,
		}))
	})
})
