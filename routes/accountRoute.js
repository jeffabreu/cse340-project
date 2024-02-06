// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Route to build inventory by classification view
router.get("/login", utilities.Util.handleErrors(accountController.buildLogin))


router.get("/register", utilities.Util.handleErrors(accountController.buildRegister))

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.Util.handleErrors(accountController.registerAccount)
  )

  // Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.Util.handleErrors(
  (req, res) => {
    res.status(200).send('login process')
  })
)



module.exports = router;