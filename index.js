const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dbURI =
  "mongodb+srv://padekuyooro:Alaba0685@my-tutorial.gmfl1vm.mongodb.net/?retryWrites=true&w=majority&appName=My-Tutorial";
const bodyParser = require("body-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");
const profileRoutes = require("./routes/profile");
mongoose.connect(dbURI);
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(taskRoutes);
app.use("/auth", authRoutes);
app.use(profileRoutes);
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.listen(8080);
