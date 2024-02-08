const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByVehicleId = async function (req, res, next) {
  const vehicle_id = req.params.vehicleId
  const data = await invModel.getVehicleById(vehicle_id)
  const grid = await utilities.buildDetailsGrid(data)
  let nav = await utilities.getNav()
    const vehicle = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`
    res.render("./inventory/inventory-details", {
      title: `${vehicle}`,
      nav,
      grid,
    })

}

invCont.buildManagementTools = async function (req,res,next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Inventory Management Tools",
    nav,
    errors: null
  })
}

/* ****************************************
*  Deliver Add Classification view
* *************************************** */
invCont.buildClassificationForm = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Register New Classification",
    nav,
    errors: null
  })
}

invCont.buildInventoryForm = async function (req, res, next) {
  let nav = await utilities.getNav()
  let categories = await utilities.getCats()
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory Item",
    nav,
    errors: null,
    categories
  })
}

async function addInventory(req, res) {
  const {inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id} = req.body

  const fullImagePath = `/images/vehicles/${inv_image}`
  const fullThumbPath = `/Images/vehicles/${inv_thumbnail}`

  const result = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    fullImagePath,
    fullThumbPath,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )


  if (result) {
    let nav = await utilities.getNav()
    let categories = await utilities.getCats()
    req.flash(
      "notice",
      `Inventory updated successfully.`
    )
    res.status(201).render("inventory/management", {
      title: "Add new Inventory",
      nav,
      errors: null,
      categories,
    })
  } else {
    req.flash("notice", "Sorry, the action failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add new Inventory",
      nav,
      errors: null,
      categories 
    })
  }
}

async function registerClassification(req, res) {
  const {classification_name} = req.body
  const regResult = await invModel.registerClassification(
    classification_name
  )

  if (regResult) {
    let nav = await utilities.getNav()
    req.flash(
      "notice",
      `Congradulations! ${classification_name} has been added.`
    )
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null
    })
  } else {
    let nav = utilities.getNav()
    req.flash("notice", "Sorry, the action failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null
    })
  }
}

module.exports = {invCont, invModel, registerClassification, addInventory};