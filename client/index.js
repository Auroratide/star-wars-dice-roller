const rollers = [...document.querySelectorAll("sw-roller")]
const main = document.querySelector("main")
const connectionLostDialog = document.querySelector("#connection-lost-dialog")
const refreshButton = document.querySelector("#refresh-button")
const socket = new WebSocket("ws://localhost:3000/connection")

function deactivateEverything() {
	connectionLostDialog.show()
	main.inert = true
}

socket.addEventListener("open", () => {
	console.log("Opened connection")
})

socket.addEventListener("close", () => {
	console.warn("Closed connection")

	deactivateEverything()
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

	if (data.type === "form reset") {
		rollers.find((it) => it.id === data.forid)?.reset?.()
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

	roller.addEventListener("reset", (e) => {
		socket.send(JSON.stringify({
			type: "form reset",
			forid: e.target.id,
		}))
	})
})

refreshButton.addEventListener("click", () => {
	window.location.reload()
})
