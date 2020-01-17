const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 8080;

const clients = [];
const winners = [];

io.on("connection", (client) => {
	const username = getClientName(client)
	clients.push(client)

	console.log(`[INFO] ${username} connected`);
	console.log(`[INFO] Total Clients: ${clients.length}`);

	io.emit("connected_users_changed", clients.map(getClientName));
	io.emit("bingo", winners);

	client.on("disconnect", () => {
        clients.splice(clients.indexOf(client), 1);

		console.log(`[INFO] ${username} disconnected`);
		console.log(`[INFO] Total Clients: ${clients.length}`);

		io.emit("connected_users_changed", clients.map((c) => getClientName(c)));
    });

	client.on("bingo", ({username, words}) => {
		console.log(`[WIN] ${username} got a bingo! Words: ${words.join(", ")}`);

		if (!winners.includes(username)) {
			winners.push(username);
		}

		io.emit("bingo", winners);
	});
});

http.listen(port, () => {
	console.log("[INFO] listening on *:" + port);
});

const getClientName = (client) => client.handshake.query.name;
