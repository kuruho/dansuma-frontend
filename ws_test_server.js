var app = require("http").createServer(handler);
var io = require("socket.io")(app, { transports: ["websocket"] });
var fs = require("fs");

app.listen(7001);

var sockets = {};
var userCounts = 0;

function handler(req, res) {
  var filePath = req.url;

  //   if (req.url === '/') filePath = '/app/index.html';

  fs.readFile(__dirname + filePath, function(err, data) {
    if (err) {
      res.writeHead(500);
      return res.end("Error loading" + filePath + ": " + err);
    }

    res.writeHead(200);
    res.end(data);
  });
}

let appState = {
  song: {
    title: "Yellow Submarine",
    author: "Beatles",
    color: "#eee",
    id: 123
  },
  winner_user_id: 42315,
  ts: 123455432
};

let appSonglist = [
  {
    title: "Bandiera gialla",
    author: "Gianni Pettenati",
    color: "yellow",
    id: 1
  },
  {
    title: "Il cielo in una stanza",
    author: "Gino Paoli",
    color: "green",
    id: 2
  },
  {
    title: "Romagna mia",
    author: "Raoul Casadei",
    color: "violet",
    id: 3
  },
  {
    title: "Ma che bontà",
    author: "Mina",
    color: "blue",
    id: 4
  },
  {
    title: "Montagne verdi",
    author: "Marcella Bella",
    color: "orange",
    id: 5
  }
];

io.on("connection", function(socket) {
  socket.on("app:ready", function() {
    socket.emit("app:state", { data: appState });
    socket.emit("app:songlist", { data: appSonglist });
  });

  socket.on("user:login", function(data) {
    var userId = ++userCounts;
    socket.user = {
      userId: userId,
      username: "User " + userId,
      nickname: "user" + userId
    };
    console.log("response_user:login: ", socket.user);
    socket.emit("blabla", { type: "user:login", data: socket.user });
    Object.keys(sockets).map(function(userId) {
      sockets[userId].emit("user:added", socket.user);
    });

    sockets[userId] = socket;
  });

  socket.on("users:get", function(data) {
    var data = Object.keys(sockets)
      .map(function(userId) {
        var user = sockets[userId].user;
        return {
          userId: user.userId,
          username: user.username,
          nickname: user.nickname,
          unreadMessageCount: 0,
          messages: []
        };
      })
      .filter(function(user) {
        if (user.userId === socket.user.userId) return false;

        if (data && data.target && data.targetId !== user.userId) return false;

        return true;
      });
    console.log("response_users:get: ", data);
    socket.emit("response", { type: "users:get", data: data });
  });

  socket.on("message:send", function(message) {
    message.time = new Date().getTime();
    console.log("response_message:send: ", message);
    sockets[message.to] && sockets[message.to].emit("message:new", message);
    socket.emit("response", { type: "message:send", data: message });
  });

  socket.on("user:logout", function() {
    var user = socket.user;
    socket.emit("response", { type: "user:logout" });

    if (!user) return;
    delete sockets[user.userId];
    socket.disconnect(true);

    Object.keys(sockets).map(function(userId) {
      sockets[userId].emit("user:logged:out", user);
    });
  });

  socket.on("disconnect", function() {
    var user = socket.user;
    if (!user) return;

    delete sockets[user.userId];
    socket.disconnect(true);

    Object.keys(sockets).map(function(userId) {
      sockets[userId].emit("user:removed", user);
    });
  });
});

console.log("server started at 7001");
