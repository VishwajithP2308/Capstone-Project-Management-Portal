require("dotenv").config();
const port = process.env.PORT || 3000;
const uri = process.env.MONOGO_DB_STRING_URI;
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const userRoutes = require("./server_side/routes/userRoutes");
const projectRoutes = require("./server_side/routes/projectRoutes");
const courseRoutes = require("./server_side/routes/courseRoutes");
const experienceRoutes = require("./server_side/routes/experienceRoutes.js");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
// serving static files
app.use(express.static(path.join(__dirname, "client_side", "build")));
// api routes
app.use("/api", userRoutes);
app.use("/api", projectRoutes);
app.use("/api", courseRoutes);
app.use("/api", experienceRoutes);
// static files
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client_side", "build", "index.html"));
});
// connection to mongodb
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection established."))
  .catch((error) => console.error("MongoDB connection failed:", error.message));
//server listening on port
app.listen(port, () => {
  console.log("Server is listening" + port);
});