const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const reviewModel = require("../models/review-model")
const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
    // Retrieve navigation HTML
    let nav = await utilities.getNav()
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
  let nav = await utilities.getNav()
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
  let nav = await utilities.getNav()
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
    req.flash("notice", "Sorry, something went wrong on your registration.")
    return res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null
    })
  }
}

/* ****************************************
 *  Process login request
 * *************************************** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
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
  let nav = await utilities.getNav()
  const account_id = res.locals.accountData.account_id
  const reviewData = await reviewModel.getRevByAccId(account_id)
  const invData = await invModel.getInventory()
  const reviews = await utilities.buildReviewsForAccount(reviewData, invData)
  res.render("./account/management", {
    title: "Account Management",
    nav,
    reviews, 
    errors: null,
  })
}

/* ****************************************
 *  Build the view to edit the account and password
 * *************************************** */
async function buildAccountEdit(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = parseInt(req.params.account_id)
  const accountData = await accountModel.getAccountByID(account_id)
  try {
    res.render("./account/update", {
      title: "Edit Account",
      nav,
      errors: null,
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
    })
  } catch (error) {
    error.status = 500
    console.error(error.status)
    next(error)
  }
}

/* ****************************************
 *  Update the account based on the user's input
 * *************************************** */
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav()
  try {
    const { account_id, account_firstname, account_lastname, account_email } =
      req.body

    const updatedAcctInfo = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    )

    if (updatedAcctInfo) {
    // Get the updated full account:
    const accountData = await accountModel.getAccountByID(account_id)
    // Reset the session with the new information:
    const token = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: 3600 * 1000,
    })
    res.cookie("jwt", token, { httpOnly: true, maxAge: 3600 * 1000 })
      req.flash(
        "notice",
        `${account_firstname}, your account was successfully updated.`
      )

      res.redirect("/account/")

    } else {
      req.flash(
        "error",
        `Sorry, ${account_firstname}, the update failed. Please try again.`
      )
      res.status(501).render("./account/update", {
        title: "Edit Account",
        nav,
        errors: null,
        account_id,
        account_firstname,
        account_lastname,
        account_email,
      })
    }
  } catch (error) {
    error.status = 500
    console.error(error.status)
    next(error)
  }
}

/* ****************************************
 *  Update the password based on the user's input
 * *************************************** */
async function updatePassword(req, res, next) {
  let nav = await utilities.getNav()
  const { account_id, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // Regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)

    const updatedPassword = await accountModel.updatePassword(
      account_id,
      hashedPassword
    )
    if (updatedPassword) {
      req.flash("notice", `Your password was successfully updated.`)
      res.status(201).render("./account/management", {
        title: "Account Management",
        nav,
        errors: null,
      })
    } else {
      req.flash("error", `Sorry, the update failed. Please try again.`)
      res.status(501).render("./account/update", {
        title: "Edit Account",
        nav,
        errors: null,
        account_id,
      })
    }
  } catch (error) {
    req.flash("error", "Sorry, there was an error. Please try again.")
    res.status(500).render("./account/update", {
      title: "Edit Account",
      nav,
      errors: null,
      account_id,
    })
  }
}

/* ****************************************
 *  Logout user
 * *************************************** */
async function logoutUser(req, res, next) {
  utilities.logout(req, res, next)
  req.flash("notice", "You're now logged out.")
  return res.redirect("/")
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildManagement,
  buildAccountEdit,
  updateAccount,
  updatePassword,
  logoutUser
}
