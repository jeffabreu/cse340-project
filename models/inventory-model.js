const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  // Retrieve all classification data from the database
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* *****************************
*   Register new Classification
* *************************** */
async function registerClassification(classification_name) {
  try {
    // SQL query to insert a new classification into the database
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name]) // Execute the SQL query with the provided classification name
  } catch (error) {
    return error.message // Return error message if an error occurs
  }
}

// Function to add inventory to the database
async function addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
  try {
    // SQL query to insert inventory into the database
    const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
  } catch (error) {
    return error.message
  }
}
/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
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
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}
//Function to delete inventory to the database
async function deleteInventoryItem(inv_id) {
  try {
    const sql = "DELETE FROM inventory WHERE inv_id = $1"
    const data = await pool.query(sql, [inv_id])
    return data
  } catch (error) {
    console.error("Delete Inventory Error")
  }
}
/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    // SQL query to get inventory items and corresponding classification names by classification_id
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows // Return the retrieved data
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

// Function to get vehicle details by vehicle ID
async function getVehicleById(vehicle_id) {
  try {
    // SQL query to get vehicle details by vehicle ID
    const data = await pool.query(
      `SELECT * FROM public.inventory
       WHERE inv_id = $1`,
       [vehicle_id]
    )
    return data.rows // Return the retrieved data
  } catch (error) {
    console.error(`getVehicleById error ${error}`)
  }
}

// Function to check if a classification already exists by its name
async function checkExistingCat(classification_name) {
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const classification = await pool.query(sql, [classification_name])
    return  classification.rowCount // Return the count of existing classifications with the provided name
  } catch (error) {
    return error.message // Return error message if an error occurs
  }
}

// Function to check if a classification already exists by its ID
async function checkExistingCatById(classification_id) {
  try {
    const sql = "SELECT * FROM classification WHERE classification_id = $1"
    const classification = await pool.query(sql, [classification_id])
    return  classification.rowCount // Return the count of existing classifications with the provided ID
  } catch (error) {
    return error.message // Return error message if an error occurs
  }
}
//for management to update a vehicle in the inventory
async function updateInventory(
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
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
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
      inv_id,
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

//for management to delete a vehicle in the inventory
async function deleteVehicle(inv_id) {
  try {
    const sql = "DELETE FROM inventory WHERE inv_id = $1"
    const data = await pool.query(sql, [inv_id])
    return data
  } catch (error) {
    console.error("Delete Inventory Error")
  }
}


async function getInventory() {
  try {
      const data = await pool.query(
          "SELECT * FROM public.inventory ORDER BY inv_id"
      )
      return data.rows
  } catch (error) {
      console.error("getinventoryerror: " + error)

  }
  
}




// Export all functions for use in other modules
module.exports = {
    getClassifications,
    getInventoryByClassificationId,
    getVehicleById,
    registerClassification,
    addInventory,
    checkExistingCat,
    checkExistingCatById,
    deleteInventoryItem,
    updateInventory,
    deleteVehicle,
    getInventory
}
