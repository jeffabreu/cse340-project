const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")

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

  try {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(account_password, 10) // Generate hash with bcrypt
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

module.exports = { buildLogin, buildRegister, registerAccount }
