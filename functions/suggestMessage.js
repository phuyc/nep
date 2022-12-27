const rearmAwkSlug = require('./rearmAwkSlug');
const Database = require('better-sqlite3');
const stringSimilarity = require('string-similarity');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const db = new Database('./employees.db');

// Suggest
function suggest(name, type) {

    // Capitalize name
    if (typeof(name) != 'string') return;
    
    name = name.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());

    name = rearmAwkSlug(name);

    // Array of employees' name
    const names = [];

    // Populate array
    if (type == 'skin') type = 'employee';

    let aliases = db.prepare(`SELECT name FROM ${type}s;`).all();
    for (let alias of aliases) {
        names.push(alias['name']);
    };

    // Rate similarity
    let matches = stringSimilarity.findBestMatch(name, names).ratings;

    // Sort by rating
    matches.sort(function(a,b) {
        return b.rating - a.rating;
    });

    // Pick the best 3
    matches.length = 3;
    
    // Return
    return matches;
}



function suggestMessage(name, type) {
    // Get suggestions
    let matches = suggest(name, type);

    // Create components for suggestion message
    let suggestion = `Did you mean this ${type}:\n1. ${matches[0].target}\n2. ${matches[1].target}\n3. ${matches[2].target}`;
    let suggestRow = new ActionRowBuilder()
    .addComponents(
        // 1
        new ButtonBuilder()
            .setCustomId('1')
            .setLabel(`1`)
            .setStyle(ButtonStyle.Primary),
        // 2
        new ButtonBuilder()
            .setCustomId('2')
            .setLabel(`2`)
            .setStyle(ButtonStyle.Primary),
        // 3
        new ButtonBuilder()
            .setCustomId('3')
            .setLabel(`3`)
            .setStyle(ButtonStyle.Primary),
    );

    // Return
    return [suggestion, suggestRow];
}

module.exports = suggestMessage