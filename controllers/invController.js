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
/* ***************************
 *  Build Detail view by inventory id
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
    // Extract inventory ID from request parameters
    const inventory_id = req.params.inventoryId;

    // Fetch details using the inventory ID
    const data = await invModel.getDetailsByInventoryId(inventory_id);

    // Build grid based on the fetched data
    const grid = await utilities.buildDetailGrid(data);

    // Get navigation information
    let nav = await utilities.getNav();

    // Extract specific details for rendering the title
    const year = data[0].inv_year;
    const model = data[0].inv_model;
    const make = data[0].inv_make;

    // Render the inventory details page
    res.render("./inventory/inventory-details", {
      title: `${year} ${make} ${model}`, 
      nav,
      grid,
    });
};

/* ***************************
 *  Error
 * ************************** */
invCont.buildError = function (req, res, next) {
  // Modify the error message or add additional logic
  throw { message: "Oops! Something went wrong. It's not you; it's me." };
};


module.exports = invCont