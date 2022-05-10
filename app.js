const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
//const pg = require("pg");
//const hstore = require("pg-hstore");
const Handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

const Sequelize = require("sequelize");

//const db = new Sequelize('postgres://postgres:12345@localhost.com:5432/codegig') // Example for postgres

const db = require("./config/db");

// test db
db.authenticate()
  .then(() => {
    console.log("db created");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

//body-parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//static folder
app.use(express.static(path.join(__dirname, "public")));

//template engine
const handlebars = exphbs.create({
  extname: ".hbs",
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views/layouts"),
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});
app.engine(".hbs", handlebars.engine);
app.set("view engine", ".hbs");

app.get("/", (req, res) => {
  res.render("index", { layout: "landing" });
});

// gig routes
app.use("/gigs", require("./routes/gigs"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server started on port ${PORT}`));
