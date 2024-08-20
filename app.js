const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.error("Failed to connect to database");
  });

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/", mainRouter);

new Promise((resolve, reject) => {
  const server = app.listen(PORT, resolve);
  server.on("error", reject);
})
  .then(() => {
    console.log(`Server is running on http://localhost:${PORT}`);
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
  });
