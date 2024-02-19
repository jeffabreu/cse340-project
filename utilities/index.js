const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
const accountModel = require('../models/account-model')
require("dotenv").config()
/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = '<ul class="flex">'
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

Util.getCats = async (req,res,next) => {
  let data = await invModel.getClassifications()
  let list =
  `<select name="classification_id" id="classificationId">
    <option value="none" disabled hidden>Select an Option</option>`

  data.rows.forEach((row) => {
    list += `<option value="${row.classification_id}">${row.classification_name}</option>`
  })
  list += `</select>`
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildManagementTools = async () =>{
  let actions
  actions += `<button type=">`
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildDetailsGrid = async function (data) {
  let grid;

  if (data.length > 0) {
    grid = '<div id="detail-inv-grid">';

    // Loop through each vehicle in the data
    data.forEach(vehicle => {
      // Start a container for each vehicle detail
      grid += '<div class="vehicle-detail">';

      // Add the vehicle image with alt text
      grid += `<img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />`;

      // Start a table for other details
      grid += '<table>';

      // Add row for color
      grid += '<tr>';
      grid += '<td class="detail-label">Color:</td>';
      grid += `<td class="detail-value">${vehicle.inv_color}</td>`;
      grid += '</tr>';

      // Add row for mileage
      grid += '<tr>';
      grid += '<td class="detail-label">Mileage:</td>';
      grid += `<td class="detail-value">${new Intl.NumberFormat("en-US").format(vehicle.inv_miles)}</td>`;
      grid += '</tr>';

      // Add row for description
      grid += '<tr>';
      grid += '<td class="detail-label">Description:</td>';
      grid += `<td class="detail-value">${vehicle.inv_description}</td>`;
      grid += '</tr>';

      // Add row for price
      grid += '<tr>';
      grid += '<td class="detail-label">Price:</td>';
      grid += `<td class="detail-value">$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</td>`;
      grid += '</tr>';

      // Close the table and container for the current vehicle
      grid += '</table>';
      grid += '</div>';
    });

    // Close the grid container
    grid += '</div>';
  } else {
    // Display a notice if no matching vehicles are found
    grid = '<p class="notice">Sorry, no matching vehicle could be found.</p>';
  }

  return grid;
};


Util.buildReviewsByInventoryId = async function(data) {
  let invReviews
  let screenName
  let accData
  if (data.length > 0) {
      invReviews = "<ul>"

      for (let i = data.length-1; i >= 0; i--) {
          accData = await accountModel.getAccountByID(data[i].account_id)
          screenName = accData.account_firstname.charAt(0) + accData.account_lastname           
          invReviews += '<li id="review-display">'            
          invReviews += `<p class="review-info">${screenName} wrote on ${data[i].review_date.toLocaleString()}</p>`  
          invReviews += `<p>${data[i].review_text}</p>`
          invReviews += "</li>"            
     }
     invReviews += "</ul>"       
  }    
  return invReviews
}

Util.buildReviewsByAccountId = async function(reviewData, invData) {
  let reviewList  
  if (reviewData.length > 0) {
      let invItem, invName        
      reviewList = '<div id="management-review-display">'
      reviewList += `<ul>`        
      reviewData.forEach(review => {
          invData.forEach(item => {
              if (item.inv_id == review.inv_id) {invItem = item}
          })
          // new Intl.Locale('en-US').format
          invName = `${invItem.inv_year} ${invItem.inv_model} ${invItem.inv_make}`   
          reviewList += `<li>Reviewed ${invName} ${review.review_date.toLocaleString()} | <a href="/review/edit/${review.review_id}">Edit</a> | <a href="/review/delete/${review.review_id}">Delete</a></li>`    
     })
     reviewList +='</ul>'
     reviewList +='</div>'
     
  }
  return reviewList
}




/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

 Util.checkAccType = (req, res, next) => {
  if (res.locals.accountData.account_type === "Client") {
    next();
  } else {
    req.flash("notice", "Please login as a Client!");
    return res.redirect("/account/login");
  }
}
/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

/* ****************************************
* Error handler
**************************************** */
 Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Logout user
**************************************** */
Util.logout = (req, res, next) => {
  res.clearCookie("jwt");
  res.locals.loggedin = 0;
};


module.exports = Util