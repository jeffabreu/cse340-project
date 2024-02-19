const utilities = require("../utilities")
const reviewModel = require("../models/review-model")
const reviewCont = {}

/* *************************************
 * Function: Add a Review
 * Description: Adds a new review to the database
 * *************************************/
reviewCont.addRev = async function(req, res) {
    // Get navigation data
    let nav = await utilities.getNav()
    
    // Extract review data from request body
    const {review_text, inv_id,  account_id} = req.body
    
    // Call the model function to add a new review
    const addRevResult = await reviewModel.addRev(review_text, inv_id, account_id)

    // Redirect based on the result of adding a review
    if (addRevResult) {
        req.flash(
            "notice",
            "Thank you for your review. It has been successfully submitted."
        )
        res.status(201).redirect("/account")
    } else {
        req.flash("notice", "Adding review failed. Please try again.")
        res.redirect("/detail/inv_id")
    }
}

/* *************************************
 * Function: Build Edit Page by Review ID
 * Description: Renders the edit review page with review data
 * *************************************/
reviewCont.buildEditByReviewId = async function(req, res, next) {
    // Extract review ID from request parameters
    const review_id = parseInt(req.params.review_id)
    
    // Fetch review data by review ID
    const reviewData = await reviewModel.getDataByReviewId(review_id)
    
    // Get navigation data
    const nav = await utilities.getNav()
    
    // Render edit review page with retrieved data
    res.render("./review/edit-review", {
        title: "Edit review",
        nav,
        errors: null,
        review_id,
        review_text: reviewData[0].review_text,
    })
} 

/* *************************************
 * Function: Edit Review
 * Description: Edits an existing review in the database
 * *************************************/
reviewCont.editReview = async function(req, res, next) {
    // Get navigation data
    const nav = await utilities.getNav()
    
    // Extract review data from request body
    const {review_id, review_text, inv_id} = req.body
    
    // Fetch review data by review ID
    const reviewData = await reviewModel.getDataByReviewId(review_id)
    let editResult

    // Check if the review belongs to the logged-in user and then edit it
    if (reviewData[0].account_id === res.locals.accountData.account_id) {
        editResult = await reviewModel.editReview(review_id, review_text)
    }
    
    // Redirect based on the result of editing the review
    if (editResult) {
        req.flash("notice", "Your review has been successfully edited.")
        res.status(200).redirect("/account")
    } else {
        req.flash("notice", "Review edit failed. Please try again.")
        res.status(500).redirect(`/review/edit/${review_id}`)
    }
}

/* *************************************
 * Function: Build Delete Page by Review ID
 * Description: Renders the delete review confirmation page with review data
 * *************************************/
reviewCont.buildDeleteByReviewId = async function(req, res, next) {
    // Extract review ID from request parameters
    const review_id = parseInt(req.params.review_id)
    
    // Fetch review data by review ID
    const reviewData = await reviewModel.getDataByReviewId(review_id)
    
    // Get navigation data
    const nav = await utilities.getNav()
    
    // Render delete review confirmation page with retrieved data
    res.render("./review/delete-review", {
        title: "Delete review",
        nav,
        errors: null,
        review_id,
        review_text: reviewData[0].review_text,
        review_date: reviewData[0].review_date,
    })
}

/* *************************************
 * Function: Delete Review
 * Description: Deletes an existing review from the database
 * *************************************/
reviewCont.deleteReview = async function(req, res, next) {
    // Get navigation data
    const nav = await utilities.getNav()
    
    // Extract review data from request body
    const {review_id, review_text, inv_id} = req.body
    
    // Fetch review data by review ID
    const reviewData = await reviewModel.getDataByReviewId(review_id)
    let deleteResult

    // Check if the review belongs to the logged-in user and then delete it
    if (reviewData[0].account_id === res.locals.accountData.account_id) {
        deleteResult = await reviewModel.deleteReview(review_id)
    }
    
    // Redirect based on the result of deleting the review
    if (deleteResult) {
        req.flash("notice", "Your review has been successfully deleted.")
        res.status(200).redirect("/account")
    } else {
        req.flash("notice", "Review delete failed. Please try again.")
        res.status(500).redirect(`/review/delete/${review_id}`)
    }
}

module.exports = reviewCont
