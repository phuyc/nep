const Database = require("better-sqlite3");
const stringSimilarity = require('string-similarity');

const db = Database("./employees.db");

function bestMatch(name, type) {

    // Capitalize name
    if (typeof(name) != 'string') return;
    name = name.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());

    // Array of employees' name
    const names = [];

    let aliases = db.prepare(`SELECT name FROM ${type}s;`).all();
    for (let alias of aliases) {
        names.push(alias['name']);
    };

    for (let n of names) {
        if (n.includes(name)) return n;
    }

    // Rate similarity
    let bestMatch = stringSimilarity.findBestMatch(name, names).bestMatch;

    if (bestMatch.rating < 0.3) return false;

    let slug = db.prepare(`SELECT slug FROM ${type}s WHERE name=?;`).get(bestMatch.target);
    
    // Return
    return slug['slug'];
}

module.exports = { bestMatch }