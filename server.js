const express = require("express");
const socketio = require("socket.io");
const app = express();
const http = require("http");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config({ path: "./config/config.env" });
const DBConnection = require("./DB/database");

////Connected to the Database
DBConnection();

const PORT = process.env.PORT;
app.use(express.json());
app.use(cors());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use(express.urlencoded({ extended: false }));

const server = http.createServer(app);
const io = socketio(server);
app.set("io", io);

app.use("/", require("./routes/chat"));
app.use("/", require("./routes/user"));
app.use("/", require("./routes/message"));
app.use("/", require("./routes/recieveMessage"));

let interval;

io.on("connection", (socket) => {
  console.log("New client connected");
});

app.use("*", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "API doesnot exist, you are currently accessing",
  });
});

server.listen(PORT, () => {
  console.log("server is up at" + PORT);
});
