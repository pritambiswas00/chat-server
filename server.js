const express = require("express");
const path = require("path");
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
// console.log(io);

io.engine,
  (generatedId = (req) => {
    return 1;
  });

app.use("/", require("./routes/chat"));
app.use("/", require("./routes/user"));
app.use("/", require("./routes/message"));
app.use("/", require("./routes/recieveMessage"));

//Checks for any forward to error handler
///Setting Static Folder
// const publicFiles = path.join(__dirname, "./publicFiles");
// app.use(express.static(publicFiles));
io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/publicFiles/Agent/agent.html");
});

// app.use("*", (req, res) => {
//   return res.status(404).json({
//     success: false,
//     message: "API doesnot exist, you are currently accessing",
//   });
// });

server.listen(PORT, () => {
  console.log("server is up at" + PORT);
});
