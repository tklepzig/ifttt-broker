const express = require("express");
const http = require("http");
const path = require("path");
const socketIo = require('socket.io');
const bodyParser = require('body-parser');

const port = process.env.PORT || 8080;
const app = express();
const httpServer = http.Server(app);
const socketIoServer = socketIo(httpServer, {
    pingTimeout: 2000,
    pingInterval: 2000
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//test with curl: curl -H "Content-Type: application/json" -d "{\"msg\": 21}" http://localhost:[port]
app.post("/", (req, res) => {
    socketIoServer.sockets.emit("message", req.body.msg);

    return res.sendStatus(200);
});

socketIoServer.on('connection', function (socket) {
    let clientIp = socket.request.connection.remoteAddress;
    console.log('Client connected:\t' + clientIp);
});

httpServer.listen(port, () => {
    console.log(`listening on *:${port}`);
});
