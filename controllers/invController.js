const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const reviewModel = require("../models/review-model")
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
  const inv_id = req.params.inventoryId
  const reviewData = await reviewModel.getRevByInvId(vehicle_id)
  const reviews = await utilities.buildReviewsByInventoryId(reviewData)
  let nav = await utilities.getNav()
    const vehicle = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`
    res.render("./inventory/inventory-details", {
      title: `${vehicle}`,
      vehicle_id,
      nav,
      grid,
      reviews
    })

}

invCont.buildManagementTools = async function (req,res,next) {
  let nav = await utilities.getNav()
  const classifications = await invModel.getClassifications();
  res.render("./inventory/management", {
    title: "Inventory Management Tools",
    nav,
    errors: null,
    classifications: classifications.rows
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
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
// build Edit - this is a tool for managers to edit the inventory items.
async function buildEdit(req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleById(inv_id)
  let classDropDown = await utilities.buildClassDropdown(
    itemData[0].classification_id
  )
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  try {
    res.render("./inventory/edit-inventory", {
      title: "Edit:  " + itemName,
      nav,
      classDropDown: classDropDown,
      errors: null,
      inv_id: itemData[0].inv_id,
      inv_make: itemData[0].inv_make,
      inv_model: itemData[0].inv_model,
      inv_year: itemData[0].inv_year,
      inv_description: itemData[0].inv_description,
      inv_image: itemData[0].inv_image,
      inv_thumbnail: itemData[0].inv_thumbnail,
      inv_price: itemData[0].inv_price,
      inv_miles: itemData[0].inv_miles,
      inv_color: itemData[0].inv_color,
      classification_id: itemData[0].classification_id,
    })
  } catch (error) {
    error.status = 500
    console.error(error.status)
    next(error)
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classDropDown = await utilities.buildClassDropdown(
      req.body.classification_id
    )
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classDropDown: classDropDown,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    })
  }
}

// build the delete view after the manager clicks "delete" on one of the vehicles on the management screen:
 async function buildDelete(req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleById(inv_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  try {
    res.render("./inventory/delete-confirm", {
      title: "Delete:  " + itemName,
      nav,
      errors: null,
      inv_id: itemData[0].inv_id,
      inv_make: itemData[0].inv_make,
      inv_model: itemData[0].inv_model,
      inv_year: itemData[0].inv_year,
      inv_price: itemData[0].inv_price,
    })
  } catch (error) {
    error.status = 500
    console.error(error.status)
    next(error)
  }
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
 async function deleteInventory(req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id)
  const deleteTheVehicle = await invModel.deleteInventoryItem(
    inv_id,
  )

  if (deleteTheVehicle) {
    req.flash("notice", "The vehicle was successfully deleted.")
    res.redirect("/inv/")
  } else {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.redirect("/inv/delete/inv_id")
  }
}
module.exports = {invCont, invModel, registerClassification, addInventory,buildDelete, updateInventory, buildEdit, deleteInventory};