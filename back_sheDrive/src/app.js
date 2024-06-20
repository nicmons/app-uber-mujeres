const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routerApi = require("#R/_index");
const useragent = require("express-useragent");

const helmet = require("helmet");
const config = require("#SRC/config/index");
const {
  validAutorization,
  setReqGlobalsData,
  validToken,
} = require("#MW/_index");

const app = express();
const server = config.https
  ? require("https").createServer(app)
  : require("http").createServer(app);

app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH"],
  })
);
app.use(cookieParser());
app.use(helmet());
app.use(useragent.express());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  res.send("ok-s");
});
// ip proxy
app.set("trust proxy", true);
app.use("/", validAutorization, setReqGlobalsData, validToken);
routerApi(app);
module.exports = server;
