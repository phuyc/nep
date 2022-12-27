const Database = require("better-sqlite3");

const db = new Database('./employees.db')

// Get slug
function getSlug(name, type) {
    // Skin
    if (type === 'skin') type = 'employee';

    // Find slug in DB
    let slug = db.prepare(`SELECT slug FROM ${type}s WHERE name=?;`).get(name);
    
    // Return slug if found and the default if not found
    return slug ?? name.trim().replace(" ", "-").toLowerCase();
}

module.exports = getSlug;