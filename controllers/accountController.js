const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()
/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    // Retrieve navigation HTML
    let nav = await utilities.Util.getNav()
    // Render login view with title, navigation, and no errors
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  // Retrieve navigation HTML
  let nav = await utilities.Util.getNav()
  // Render registration view with title, navigation, and no errors
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.Util.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  let hashedPassword;

  try {
    // Hash the password before storing
    hashedPassword = await bcrypt.hash(account_password, 10) // Generate hash with bcrypt
  } catch (error) {
    // If hashing fails, render registration view with error message
    req.flash("notice", 'Sorry, there was an error processing your password, please try again.')
    return res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null
    })
  }

  // Register the account using model function
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  // Handle registration result
  if (regResult) {
    // If registration is successful, render login view with success message
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Now you just have to login.`
    )
    return res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null
    })
  } else {
    // If registration fails, render registration view with error message
    req.flash("notice", "Sorry, somenthing went wrong on your registration.")
    return res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null
    })
  }
}
/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.Util.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

 /* ****************************************
*  Deliver Management view
* *************************************** */
async function buildManagement(req, res, next) {
  let nav = await utilities.Util.getNav()
  res.render("account/", {
    title: "Account Management",
    nav,
    errors: null,
  })
}
module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildManagement }
