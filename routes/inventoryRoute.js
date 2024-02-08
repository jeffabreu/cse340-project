// Needed Resources 
const express = require("express"); // Importing Express framework
const router = new express.Router(); // Creating a new instance of Express router
const utilities = require("../utilities"); // Importing utility functions
const invController = require("../controllers/invController"); // Importing inventory controller
const validation = require("../utilities/inventory-validation"); // Importing validation functions

// Route to render the management tools view
router.get("/", utilities.handleErrors(invController.invCont.buildManagementTools));

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.invCont.buildByClassificationId));
router.get("/detail/:vehicleId", utilities.handleErrors(invController.invCont.buildByVehicleId));

// Route to render the form for adding a new classification
router.get("/add-classification", utilities.handleErrors(invController.invCont.buildClassificationForm));

// Process the new Classification data
router.post(
    "/add-classification",
    validation.classRules(), // Apply validation rules for the classification
    validation.checkClass, // Check if the classification data is valid
    utilities.handleErrors(invController.registerClassification) // Handle errors and register the classification
);

// Route to render the form for adding new inventory
router.get("/add-inventory", utilities.handleErrors(invController.invCont.buildInventoryForm));

// Process the new Inventory data
router.post(
    "/add-inventory",
    validation.vehicleRules(), // Apply validation rules for the vehicle
    validation.checkVehicle, // Check if the vehicle data is valid
    utilities.handleErrors(invController.addInventory) // Handle errors and add the inventory
);

module.exports = router; // Exporting the router with defined routes