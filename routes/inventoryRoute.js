// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")



// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to build details for the detail view in the interface
router.get("/detail/:inventoryId", invController.buildByInventoryId);


// Router for error page
router.get("/throwerror", invController.buildError);
module.exports = router;