const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

validate.classRules = () => [
    body("classification_name").trim().matches(/[A-Za-z0-9]/).withMessage("Invalid name. No special characters allowed.").custom(async (classification_name) => {
        const classExists = await invModel.checkExistingCat(classification_name)
        if (classExists) throw new Error("Classification already exists.")
    })
]

validate.checkClass = async (req, res, next) => {
    const classification_name = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", { title: "Add New Classification", errors, nav, classification_name })
        return
    }
    next()
}

validate.checkVehicle = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let categories = await utilities.getCats()
        res.render("inventory/add-inventory", { title: "Add New Classification", errors, nav, categories, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id })
        return
    }
    next()
}

validate.vehicleRules = () => [
    body("inv_make").trim().matches(/[A-Za-z0-9]/).withMessage("Invalid format. Numbers and letters only."),
    // Define validation rules for other vehicle attributes similarly...
    // (inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
    body("classification_id").custom(async (classification_id) => {
        const classExists = await invModel.checkExistingCatById(classification_id)
        if (!classExists) throw new Error("Something went wrong. Invalid Classification.")
    })
]

module.exports = validate
