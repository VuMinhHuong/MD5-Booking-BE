const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const port = 3001;

app.set("view engine", "ejs");
app.set("views", `${__dirname}/views`);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors());
app.use(express.static("public"));
app.use(cookieParser("xaxxa"));

let userRoutes = require("./routes/user.routes");

app.get("/", (req, res) => {
  res.send("hello");
});
app.use("/user", userRoutes);

app.listen(port, () => {
  console.log(`server is running on port http://127.0.0.1:${port}`);
});
