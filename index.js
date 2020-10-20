const mongoose = require("mongoose");
const config = require("config");
const morgan = require("morgan");
const helmet = require("helmet");
const logger = require("./middleware/logger");
const express = require("express");
const app = express();
const startupDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const home = require("./routes/home");

mongoose
  .connect("mongodb://localhost/vidly", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log("Could not connect to MongoDB", err));

app.set("view engine", "pug");

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static("public"));
app.use(helmet());
app.use(morgan("tiny"));
app.use(logger);
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/", home);

if (app.get("env") === "development") {
  startupDebugger("Morgan enabled...");
}

dbDebugger("Connected to the database...");

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
