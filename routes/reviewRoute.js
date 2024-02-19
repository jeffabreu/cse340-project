const express = require("express")
const utilities = require("../utilities")
const router = new express.Router()
const validateReview = require("../utilities/review-validation")
const reviewCont = require("../controllers/reviewController")

// Route to process new review
router.post("/", 
    // Validate review data
    validateReview.newReviewRules(),
    validateReview.checkReviewData,
    // Handle errors and add review
    utilities.handleErrors(reviewCont.addRev)
)

// Route to edit review
router.get("/edit/:review_id", 
    // Check if user is logged in
    utilities.checkLogin,
    // Build edit review page
    utilities.handleErrors(reviewCont.buildEditByReviewId)
)

// Route to process edit review
router.post("/edit", 
    // Validate review data
    validateReview.newReviewRules(),
    validateReview.checkReviewData,
    // Handle errors and edit review
    utilities.handleErrors(reviewCont.editReview)
)

// Route to delete review confirmation
router.get("/delete/:review_id", 
    // Check if user is logged in
    utilities.checkLogin,
    // Build delete review confirmation page
    utilities.handleErrors(reviewCont.buildDeleteByReviewId)
)

// Route to process delete review
router.post("/delete", 
    // Handle errors and delete review
    utilities.handleErrors(reviewCont.deleteReview)
)

module.exports = router
