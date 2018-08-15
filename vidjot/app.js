const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const flash = require("connect-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

// Load Routes
const ideas = require("./routes/ideas");
const users = require("./routes/users");

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

// connect to mongoose
mongoose
  .connect("mongodb://localhost/vidjot-dev")
  .then(() => console.log("Mongodb Connected"))
  .catch(err => console.log(err));

// Load Idea Model
require("./models/Idea");
const Idea = mongoose.model("ideas");

// Handle bars Middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method override middleware
app.use(methodOverride("_method"));

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Express session midleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Index Route
app.get("/", (req, res) => {
  const title = "Welcome1";
  res.render("index", {
    title: title
  });
});

// About Route
app.get("/about", (req, res) => {
  res.render("about");
});

// Use routes
app.use("/ideas", ideas);
app.use("/users", users);

const port = 5000;

app.listen(port, () => {
  console.log(`Server stated on port ${port}`);
});
