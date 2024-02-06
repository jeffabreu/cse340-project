const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.Util.getNav()
  req.flash("notice", "This is a flash message.")
  res.render("index", {title: "Home", nav, errors: null})
}

baseController.error = async function(req, res){
  throw new IntentionalError("This page is intentionally broken. See /controllers/baseController.js line 10.")
}

class IntentionalError extends Error {
  constructor(message) {
    super(message)
    this.name = "Intentional Error"
  }
}

module.exports = baseController