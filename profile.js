const Discord = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const fetch = require("node-fetch");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const stringSimilarity = require("string-similarity")

// Object to use instead of if...else/switch
const ROLES = {
    "striker": "<:role_striker:1009747263528116334> Striker",
    "sniper": "<:role_sniper:1009747261682614382> Sniper",
    "ranger": "<:role_ranger:1009747273019830322> Ranger",
    "defender": "<:role_defender:1009746831372202014> Defender",
    "supporter":"<:role_support:1009747241751302344> Supporter",
    "siege": "<:role_siege:1009747259405115423> Siege",
    "tower": "<:role_tower:1009747265667223592> Tower"
}

const TYPES = {
    "counter": "<:type_counter:1009747267466567761> Counter",
    "soldier": "<:type_soldier:1009747270998179890> Soldier",
    "mech": "<:type_mech:1009747269286899802> Mech"
}

const RATINGS = {
    "D": "<:D_:1009868758908674108>",
    "C": "<:C_:1009868756752797717>",
    "B": "<:B_:1009868754831822920>",
    "A": "<:A_:1009868760603164796>",
    "S": "<:S_:1009868791548760205>",
    "SS": "<:SS:1009868793016750192>",
    "SSS": "<:SSS:1009868795243929600>"
        
}

// Declare variables
let res, text, data, sdv, avatar, picture, img, ratings, skillBox, gear;

// Create profile embed
async function createProfileEmbed(name) {

    // Fetch profile from prydwen.co
    res = await fetch(`https://prydwen.co/employees/${name.trim().replace(" ", "-").toLowerCase()}`);

    // Handle error
    if (res.status != 200) {
        return;
    }

    text = await res.text();
    data = new JSDOM(text);

    // Extract details from profile
    data.window.document.querySelectorAll('script').forEach(s => s.remove());
    sdv = data.window.document.querySelectorAll(".single-detail-value");

    // Add emojis to role and type
    sdv[5].textContent = ROLES[sdv[5].textContent.toLowerCase().trim()] ?? sdv[5].textContent;
    sdv[6].textContent = TYPES[sdv[6].textContent.toLowerCase().trim()] ?? sdv[6].textContent;

    // Extract avatar from profile
    avatar = data.window.document.querySelector(".avatar");
    picture = avatar.querySelector("picture");
    img = picture.querySelector("img").getAttribute('data-src');

    // Extract ratings from profile
    ratings = data.window.document.querySelectorAll(".unit-header .rating");

    // Convert ratings to emoji
    for (let rating of ratings) {
        rating.textContent = RATINGS[rating.textContent];
    };

    // Extract skills from profile
    skillBox = data.window.document.querySelectorAll(".skill-box");
    const skillNames = [];
    const skillTypes = [];
    const skillAttackCount = [];
    const skillCooldown = [];
    const skillDescription = [];
    let skillEmbed = "";
    for (skill of skillBox) {
        skillNames.push(skill.querySelector(".skill-name"));
        skillTypes.push(skill.querySelector(".skill-type"));
        skillAttackCount.push(skill.querySelector(".attack-count"))
        skillCooldown.push(skill.querySelector(".cooldown"))
        skillDescription.push(skill.querySelector(".skill-description"))
    }

    //Extract gear rec
    gear = data.window.document.querySelectorAll(".set span");


    // Create embed
    let profile = new EmbedBuilder()
    .setTitle(`[${sdv[4].textContent}] ${sdv[1].textContent}`)
    .setDescription(sdv[0].textContent)
    .setThumbnail(`https://prydwen.co${img}`)
    .setColor(0x0099FF)
    .addFields(

        // Field 1.1 (Details left)
        { name: 'DETAILS', value: `**Faction**: ${sdv[3].textContent}\n**Role**:  ${sdv[5].textContent}\n**Move.type**: ${sdv[8].textContent}`, inline: true },        
        
        // Field 1.2 (Details right)                            
        { name: '\u200b', value: `**Deployment cost**: ${sdv[7].textContent}\n**Type**: ${sdv[6].textContent}\n**Att.type**: ${sdv[9].textContent}`, inline: true })
        
    // Field 2 (PVE Rating)

    // If employee has Global PVP rating                           
    if (ratings.length == 3) {
        profile.addFields({ name: 'RATINGS', value: `**PVE**: ${ratings[0].textContent}` + '  ' + `**PVP (SEA)**: ${ratings[1].textContent}` + '  ' + `**PVP (Global)**: ${ratings[2].textContent}`})
    }
    // Else
    else if (ratings.length == 2) {
        profile.addFields({ name: 'RATINGS', value: `**PVE**: ${ratings[0].textContent}` + '  ' + `**PVP (SEA)**: ${ratings[1].textContent}` + '  ' +  `**PVP (Global)**: ?`})
    }
    else if (ratings.length == 0) {
        profile.addFields({ name: 'RATINGS', value: `**PVE**: ?` + '  ' + `**PVP (SEA)**: ?` + '  ' +  `**PVP (GLB)**: ?`})
    };

    // Create skill field for every skillBox
    for (let i = 0; i < skillBox.length;i++) {
        
        // Add skill's type and name
        skillEmbed += `**${skillTypes[i].textContent}: ${skillNames[i].textContent}** `;
        
        // Check for valid hit
        if (skillAttackCount[i]) {
            skillEmbed += ` \`${skillAttackCount[i].textContent}\``;
        };
        
        // Check for cooldown
        if (skillCooldown[i]) {
            skillEmbed += ` \`${skillCooldown[i].textContent.trim()}\``;
        };

        // Add skill description
        skillEmbed += `\n\`\`\`${skillDescription[i].textContent}\`\`\``;
        
        //create embed field 3.i (Skills)
        if (i==0) {
            // Only the first field has name
            profile.addFields({ name: 'SKILLS', value: skillEmbed });
        }
        else {
            profile.addFields({ name: '\u200b', value: skillEmbed })
        };
        skillEmbed = '';
}

    // Field 4 (gear recommendation)
    profile.addFields(
        { name: "GEAR RECOMMENDATION", value: `PVE: \`${gear[0].textContent}\`\nPVP: \`${gear[1].textContent}\``}
    )

    // Timestamp
    .setTimestamp()

    // Footer
    .setFooter({ text: 'nepnep#1358', iconURL: 'https://store.playstation.com/store/api/chihiro/00_09_000/container/BE/nl/19/EP0031-CUSA03124_00-AV00000000000037/image?w=320&h=320&bg_color=000000&opacity=100&_version=00_09_000' });
    
    // Return
    return profile;
}


function suggest(name, db) {

    // Capitalize name
    if (typeof(name) != 'string') return;
    
        name = name.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());

    // Array of employees' name
    const names = [];

    // Populate array
    let aliases = db.prepare("SELECT name FROM employees;").all();
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


function suggestMessage(name, db) {
    // Get suggestions
    let matches = suggest(name, db);

    //Create components for suggestion message
    let suggestion = `Did you mean:\n1. ${matches[0].target}\n2. ${matches[1].target}\n3. ${matches[2].target}`;
    let row = new ActionRowBuilder()
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
    return [suggestion, row];
}


// Get slug
function getSlug(name, db) {
    let slug = db.prepare("SELECT slug FROM employees WHERE name=?;").get(name);
    
    // Return slug if found and the default if not found
    return slug['slug'] ?? name.trim().replace(" ", "-").toLowerCase();
}

// Export
module.exports = { createProfileEmbed, suggestMessage, getSlug };