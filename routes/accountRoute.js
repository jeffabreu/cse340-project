// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Route to build inventory by classification view
router.get("/login", utilities.handleErrors(accountController.buildLogin))


router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Route to build Account Management view
router.get("/", 
utilities.checkLogin,
utilities.handleErrors(accountController.buildManagement))

router.get("/logout", utilities.handleErrors(accountController.logoutUser));

router.get(
  "/edit/:account_id",
  utilities.handleErrors(accountController.buildAccountEdit)
);

router.post(
  "/updateaccount",
  regValidate.updateAcctRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

router.post(
  "/updatepassword",
  regValidate.updatePassRules(),
  regValidate.checkUpdatePass,
  utilities.handleErrors(accountController.updatePassword)
);

module.exports = router;