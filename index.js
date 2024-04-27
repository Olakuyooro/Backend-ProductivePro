require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const swaggerUI = require("swagger-ui-express");
const swaggerJSDoc = require("./routes/books")
const cors = require("cors")

const dbURI = process.env.DB;
const bodyParser = require("body-parser");
app.use(cors())
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");
const profileRoutes = require("./routes/profile");
const stickyWallRoutes = require("./routes/stickywall");
mongoose.connect(dbURI);
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://productive-pro-beta.vercel.app');
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
app.use(stickyWallRoutes);
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.listen(8080);
