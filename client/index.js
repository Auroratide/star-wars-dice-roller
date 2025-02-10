const socket = new WebSocket("ws://localhost:3000/connection")

document.querySelector("#input").addEventListener("input", (e) => {
   console.log("Sending: ", e.target.value)

   socket.send(e.target.value)
})

socket.addEventListener("open", () => {
   console.log("Opened connection")
})

socket.addEventListener("message", (e) => {
   console.log("Received: ", e.data)

   document.querySelector("#output").textContent = e.data
})
