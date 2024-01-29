/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require('./utilities/');
/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)
//Index route
app.get("/", baseController.buildHome)
// Inventory routes
app.use("/inv", inventoryRoute)
// Index route with error handling
app.get("/", utilities.handleErrors(baseController.buildHome));

// File Not Found Route
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Something went wrong; maybe we lost that page. Please, try another.' });
});

/* ***********************
* Global Express Error Handler
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  
  // Customize error message based on status
  let message;
  if (err.status == 404) {
    message = err.message;
  } else {
    message = 'Unexpected error for this route';
  }

  // Render the error page
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  });
});
/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

