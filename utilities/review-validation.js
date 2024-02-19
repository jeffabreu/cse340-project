const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validateReview = {}

validateReview.newReviewRules = () => {
    return [
        // Review is required and must be an integer
        body("review_text")
            .trim()
            .isLength({min: 1})
            .withMessage("Please provide a valid review."), // on error this message is sent.
    ]
}

/*  **********************************
 *  Review Data Validation
 * ********************************* */
validateReview.checkReviewData = async (req, res, next) => {
    const {review_text, inv_id, account_id} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inv/detail/inv_id", {
            errors,
            nav,
            review_text,
            inv_id,
            account_id
        })
        return
    }
    next()
}

module.exports = validateReview