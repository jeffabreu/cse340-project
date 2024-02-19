const express = require("express")
const utilities = require("../utilities")
const router = new express.Router()
const validateReview = require("../utilities/review-validation")
const reviewCont = require("../controllers/reviewController")

// Route to process new review
router.post("/",
    validateReview.newReviewRules(),
    validateReview.checkReviewData,
    utilities.handleErrors(reviewCont.addRev)
)

// Route to edit review
router.get("/edit/:review_id",
    utilities.checkLogin,
    utilities.handleErrors(reviewCont.buildEditByReviewId)
)

// Route to process edit review
router.post("/edit",
    validateReview.newReviewRules(),
    validateReview.checkReviewData,
    utilities.handleErrors(reviewCont.editReview)
)

// Route to delete review confirmation
router.get("/delete/:review_id",
    utilities.checkLogin,
    utilities.handleErrors(reviewCont.buildDeleteByReviewId)
)

// Route to process edit review
router.post("/delete",
    utilities.handleErrors(reviewCont.deleteReview)
)

module.exports = router