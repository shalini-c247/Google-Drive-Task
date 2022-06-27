require('dotenv').config();
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const Handlebars = require("handlebars");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const express = require("express");
const { engine } = require("express-handlebars");
const http = require("http");
const mongoose = require("mongoose");
const { ImageModel } = require("./models");
const path = require("path");
const routes = require("./routes");
const req = require('express/lib/request');
const res = require('express/lib/response');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.urlencoded({extended:false}));

app.engine(
  ".hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main",
    handlebars:allowInsecurePrototypeAccess(Handlebars)
  })
)

const static_path = path.join(__dirname, "./public");
const Imagestatic_path = path.join(__dirname, "public/uploads");
app.use("/v1", routes);
app.use(express.static(static_path));
app.use(express.static(Imagestatic_path));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.get("/register", async (req, res) => {
  res.render("home/register",{
    registerStyle: "registerStyle.css"
  })
});

app.get("/login", async (req, res) => {
  res.render("home/login",{
    loginStyle: "loginStyle.css"
  })
});

app.get("/homepage", async (req, res) => {
  const all_images = ImageModel.find({})
  console.log(all_images)
  all_images.exec(function(err, data){
    return res.render("home/homepage", {
      data:data,
    })
  })
});

mongoose
  .connect("mongodb://localhost:27017/Registration")
  .then(() => console.log("Database connected successfully"))
  .catch(console.log);

const server = http.createServer(app);

server
  .listen(port)
  .on("listening", () => {
    console.log(`Server is running on port ${port}`);
  })
  .on("error", (err) => {
    console.log(err);
  });
