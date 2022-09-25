const Discord = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const fetch = require("node-fetch");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const stringSimilarity = require("string-similarity")

// Object to use instead of if...else/switch
const ROLES = {
    "Striker": "<:role_striker:1009747263528116334> Striker",
    "Sniper": "<:role_sniper:1009747261682614382> Sniper",
    "Ranger": "<:role_ranger:1009747273019830322> Ranger",
    "Defender": "<:role_defender:1009746831372202014> Defender",
    "Supporter":"<:role_support:1009747241751302344> Supporter",
    "Siege": "<:role_siege:1009747259405115423> Siege",
    "Tower": "<:role_tower:1009747265667223592> Tower"
}

const TYPES = {
    "Counter": "<:type_counter:1009747267466567761> Counter",
    "Soldier": "<:type_soldier:1009747270998179890> Soldier",
    "Mech": "<:type_mech:1009747269286899802> Mech",
    "MechCounter": "<:type_counter:1009747267466567761> Counter <:type_mech:1009747269286899802> Mech",
    "SoldierMech": "<:type_mech:1009747269286899802> Mech <:type_soldier:1009747270998179890> Soldier",
    "CounterCorrupted Object": "<:type_counter:1009747267466567761> Counter <:type_co:1015504113871634472> CO",
    "MechCorrupted Object": "<:type_mech:1009747269286899802> Mech <:type_co:1015504113871634472> CO"
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

const REARMS = {
    'r.mina': 'expert-mercenary-yoo-mina',
    'r.yoo mina': 'expert-mercenary-yoo-mina',
    'r.xiao': 'xiao',
    'r.irie': 'best-mascot-irie',
    'r.elizabeth': 'blue-blood-elizabeth',
    'r.esterosa': 'near-astraea-esterosa',
    'r.eujin': 'agent-eujin',
    'r.orca': 'abyssal-ravage-orca',
    'r.miya': 'best-streamer-miya',
    'r.kang': 'investigator-kang',
    'r.sylvia': 'dark-seven-sylvia',
    'r.sorim': 'special-forces-han-sorim',
    'r.han sorim': 'special-forces-han-sorim',
    'r.titan':  'triana-titan'
}

// Declare variables
let res, json, skillEmbed, ten = '';


// Is rearm
function rearmSlug(name) {
    return REARMS[name] ?? name;
}

async function createProfileEmbed(name) {

    if (name.trim().toLowerCase() === 'best girl') {
        name = "Naielle Bluesteel";
    }

    // Fetch profile from prydwen.co
    res = await fetch(`https://www.prydwen.co/page-data/employees/${name.trim().replace(/ /g, "-").toLowerCase()}/page-data.json`);

    // Handle error
    if (res.status != 200) {
        return;
    }

    // JSON
    json = await res.json();
    json = json.result.data.currentUnit.nodes[0];

    // For units that has 2 types
    if (json.type.length == 2) {
        json.type[0] = json.type[0] + json.type[1];
    }

    // Skills and lvl5/10
    base = json.skills.filter(s => s.level == 1)
    five = json.skills.filter(s => s.level == 5)

    if (json.isRearmed) {
        ten = json.skills.filter(s => s.level == 10)
    }

    // Create embed
    let profile = new EmbedBuilder()
    .setTitle(`[${json.rarity}] ${json.fullName}`)
    .setDescription(`#${json.unitId}`)
    .setThumbnail(`https://prydwen.co${json.smallAvatar.localFile.childImageSharp.gatsbyImageData.images.fallback.src}`)
    .setColor(0x0099FF)
    .addFields(

        // Field 1.1 (Details left)
        { name: 'DETAILS', value: `**Faction**: ${json.title}\n**Role**:  ${ROLES[json.role] ?? json.role}\n**Move.type**: ${json.movementType}`, inline: true },        
        
        // Field 1.2 (Details right)                            
        { name: '\u200b', value: `**Deployment cost**: ${json.cost}\n**Type**: ${TYPES[json.type[0]] ?? json.type[0]}\n**Att.type**: ${json.attackType}`, inline: true })
        
        // Field 2 (PVE Rating)     
        if (!json.isRatingPending) {                
            profile.addFields({ name: 'RATINGS', value: `**PVE**: ${RATINGS[json.ratingOverallPVETier] ?? json.ratingOverallPVETier}` + ' ' + `**PVP (SEA)**: ${RATINGS[json.ratingOverallPVPTier] ?? json.ratingOverallPVPTier}` + '  ' + `**PVP (Global)**: ${RATINGS[json.ratingGlobalPvpTier] ?? json.ratingGlobalPvpTier}`})
        } else {
            profile.addFields({ name: 'RATINGS', value: `**PVE**: ?` + ' ' + `**PVP (SEA)**: ?` + '  ' + `**PVP (Global)**: ?`})
        }


    // Create skill field for every skillBox
    for (let i = 0; i < base.length; i++) {
        
        // Add skill's type and name
        skillEmbed += `**${base[i].type}: ${base[i].fullName}**`;
        
        // Check for valid hit
        if (base[i].attackCount) {
            skillEmbed += ` \`${base[i].attackCount} valid hits\``;
        };
        
        // Check for cooldown
        if (base[i].cooldownSecs) {
            skillEmbed += ` \`${base[i].cooldownSecs} seconds\``;
        };

        // Add skill description
        skillEmbed += `\n\`\`\`${base[i].description.description}\`\`\``;

        // Add level 5
        skillEmbed += `\`\`\`At level 5: ${five[i].description.description}\`\`\``;

        // Add level 10
        if (json.isRearmed) {
            if (ten.length > i) {
                skillEmbed += `\`\`\`At level 10: ${ten[i].description.description}\`\`\``;
        }}

        // Create embed field 3.i (Skills)
        if (i==0) {
            // Only the first field has name
            profile.addFields({ name: 'SKILLS', value: skillEmbed });
        }
        else {
            profile.addFields({ name: '\u200b', value: skillEmbed })
        };
        skillEmbed = '';
    }

    // Create embed field 4 (Gear rec)
    if (json.gearRecommendation) {
        profile.addFields(
            { name: "GEAR RECOMMENDATION", value: `PVE: \`${json.gearRecommendation.pve.set}\`\nPVP: \`${json.gearRecommendation.pvp.set}\`
            \n**[Find out more](https://prydwen.co/${name.trim().replace(/ /g, "-").toLowerCase()})**`});
    }

    // Timestamp
    profile.setTimestamp()

    // Footer
    .setFooter({ text: 'nepnep#1358', iconURL: 'https://store.playstation.com/store/api/chihiro/00_09_000/container/BE/nl/19/EP0031-CUSA03124_00-AV00000000000037/image?w=320&h=320&bg_color=000000&opacity=100&_version=00_09_000' });
    
    // Return
    return profile;
}


// Suggest
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

    // Create components for suggestion message
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
module.exports = { createProfileEmbed, suggestMessage, getSlug, rearmSlug };