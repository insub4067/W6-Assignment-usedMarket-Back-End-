const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const router = express.Router();

mongoose.connect("mongodb://localhost:27017/admin", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
    user: 'test',
    pass: 'test',
});

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));



app.use(
  cors({
    origin: "*",
  })
);

app.get("/", async (req, res) => {
  res.send("This is sparata!");
});


app.use(express.urlencoded({ extended: false }), router);
app.use(express.json());
app.use("/images", express.static("images"));


const userRouters = require("./router/users")
app.use("/user", [userRouters])

const productRouters = require("./router/products");
app.use("/api", [productRouters]);



app.listen(3000, () => {
  console.log("서버가 요청을 받을 준비가 됐어요");
});
