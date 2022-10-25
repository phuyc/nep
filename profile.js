const Discord = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const fetch = require("node-fetch");
const stringSimilarity = require("string-similarity");

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
    "D": "<:D_:1024285330217640038>",
    "C": "<:C_:1024285328246313041>",
    "B": "<:B_:1024285326270808094>",
    "A": "<:A_:1024285324345622529>",
    "S": "<:S_:1024285317643108383>",
    "SS": "<:SS:1024285320268746762>",
    "SSS": "<:SSS:1024285322433015858>"
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
    'r.titan':  'triana-titan',
}

const colors = [0xED343E, 0x009EEC, 0xC267EC];

// Declare variables
let res, json, skillEmbed, ten = '', opres, opjson, skinjson, names = [], skinImages = [], shipjson, shipres, shipSkillEmbed, skins, skinEmbeds = [];




// Is rearm
function rearmAndAwakenedSlug(name) {
    // Awakened or Rearmed
    ar = name.slice(0, 2).toLowerCase().trim();

    // Check for awakened
    if (ar === 'a.') {
        name = 'Awakened ' + name.slice(2);
    }

    // Check for rearms
    else if (ar === 'r.') {
        name = REARMS[name] ?? name;
    };

    return name;
}




async function createProfileEmbed(name) {

    switch (name.trim().toLowerCase()) {
        case "best girl":
            name = "Naielle Bluesteel";
            break;
            case "a.amy":
                name = "Amy Firstwing";
                break;
            }
        
    // Check for rearm and awakened
    name = rearmAndAwakenedSlug(name);

    // Fetch profile from prydwen.gg
    res = await fetch(`https://www.prydwen.gg/page-data/counter-side/characters/${name.trim().replace(/ /g, "-").toLowerCase()}/page-data.json`);

    // Handle error
    if (res.status != 200) return;

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
    .setDescription(`[Check out our detail ratings and reviews](https://www.prydwen.gg/counter-side/characters/${name.trim().replace(/ /g, "-").toLowerCase()})`)
    .setThumbnail(`https://prydwen.gg${json.smallAvatar.localFile.childImageSharp.gatsbyImageData.images.fallback.src}`)
    .setColor(getRandomColor(colors))
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
        if (i) {
            skillEmbed += `\`At level 5: ${five[i].description.description}\``;

        // Add level 10
            if (json.isRearmed) {
                if (ten.length > i) {
                    skillEmbed += `\n\`At level 10: ${ten[i].description.description}\``;
            }}};
        
        if (i == base.length - 1) {
            skillEmbed += '\n';
        }

        // Create embed field 3.i (Skills)
        if (i == 0) {
            // Only the first field has name
            profile.addFields({ name: 'SKILLS', value: skillEmbed });
        }
        else {
            profile.addFields({ name: '\u200b', value: skillEmbed })
        };
        skillEmbed = '';
    }

    // Create embed field 4 (Gear rec)
    if (json.gearRecommendation) profile.addFields({ name: "GEAR RECOMMENDATION", value: `PVE: \`${json.gearRecommendation.pve.set}\`\nPVP: \`${json.gearRecommendation.pvp.set}\``})

    // Timestamp
    .setTimestamp()

    // Footer
    .setFooter({ text: 'nepnep#1358', iconURL: 'https://store.playstation.com/store/api/chihiro/00_09_000/container/BE/nl/19/EP0031-CUSA03124_00-AV00000000000037/image?w=320&h=320&bg_color=000000&opacity=100&_version=00_09_000' });
    
    // Return
    return profile;
}




// Operators
async function createOperatorEmbed(name) {
    // Fetch and JSON-ify
    opres = await fetch(`https://www.prydwen.gg/page-data/counter-side/operators/${name.trim().replace(/ /g, "-").toLowerCase()}/page-data.json`);
    if (opres.status != 200) return;
    opjson = await opres.json();
    opjson = opjson.result.data.currentUnit.nodes[0];

    // Basically the same thing as profile
    let operator = new EmbedBuilder()
    .setTitle(`[${opjson.rarity}] ${opjson.fullName}`)
    .setDescription(`[Check out our detail ratings and reviews](https://www.prydwen.gg/counter-side/operators/${name.trim().replace(/ /g, "-").toLowerCase()})`)
    .setThumbnail(`https://prydwen.gg${opjson.smallAvatar.localFile.childImageSharp.gatsbyImageData.images.fallback.src}`)
    .setColor(getRandomColor(colors))
    .addFields(
        // STATS
        {name: "STATS (LVL100)", value: `Ship's HP: +${opjson.operatorHp}%\nShip's ATK: +${opjson.operatorAtk}%`, inline: true},
        {name: "\u200b", value: `Ship's DEF: +${opjson.operatorDef}%\nShip's CDR: +${opjson.operatorHaste}%`, inline: true},

        // RATINGS
        {name: "RATINGS", value: `PVE: ${RATINGS[opjson.pveScore] ?? opjson.pveScore} PVP: ${RATINGS[opjson.pvpScore] ?? opjson.pvpScore}`},

        // SKill
        {name: opjson.operatorSkill.name, value: `**Skill trigger order: ${opjson.triggerOrder}**\n**At level 1:**\n\`\`\`${opjson.operatorSkill.description}\`\`\`\n**At level 8:**\n\`\`\`${opjson.operatorSkill.description_8}\`\`\``}
    )

    return operator;
}




// Suggest
function suggest(name, db, type) {

    // Capitalize name
    if (typeof(name) != 'string') return;
    
    name = name.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());

    name = rearmAndAwakenedSlug(name);

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




function suggestMessage(name, db, type) {
    // Get suggestions
    let matches = suggest(name, db, type);

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


// Get slug
function getSlug(name, db, type) {
    // Skin
    if (type === 'skin') type = 'employee';

    // Find slug in DB
    let slug = db.prepare(`SELECT slug FROM ${type}s WHERE name=?;`).get(name);
    
    // Return slug if found and the default if not found
    return slug ?? name.trim().replace(" ", "-").toLowerCase();
}




async function createSkinEmbed(name) {
    // Check for Awakened or Rearm
    name = rearmAndAwakenedSlug(name);

    // Search employee's skin
    res = await fetch(`https://www.prydwen.gg/page-data/counter-side/characters/${name.trim().replace(/ /g, "-").toLowerCase()}/page-data.json`);

    // Handle error
    if (res.status != 200) return 1;
    
    // JSONify
    skinjson = await res.json();
    skinjson = skinjson.result.data.currentUnit.nodes[0];

    // Check for rearm
    if (skinjson.isRearmed) {
        skins = skinjson.originalUnitRef.skins;
    } else {
        skins = skinjson.skins;
    }

    // return 2 if no skin
    if (!skins) return 2;

    // Reset
    names = [];
    skinImages = [];

    for (let i = 0; i < skins.length; i++) {
        names.push(skins[i].name);
        // TODO: 
        // Search for the path to the largest webp, which contains 029bb
        //skinImages.push(/\b.*029bb.*\s/i.exec(skins[i].fullImage.localFile.childImageSharp.gatsbyImageData.images.sources[0].srcSet));
        names.push(skins[i].name);
        skinImages.push(skins[i].fullImage.localFile.childImageSharp.gatsbyImageData.images.fallback.src);
    }

    // Create message components
    let skinActionRow;
    skinEmbeds = [];
    
    if (skins.length != 1) {
        skinActionRow = new ActionRowBuilder();
    }

    for (let i = 0; i < skins.length; i++) {

        let skinEmbed = new EmbedBuilder()
        .setColor(getRandomColor(colors))
        .setTitle(names[i])
        .setImage(`https://prydwen.gg${skinImages[i]}`)
        .setTimestamp()
        .setFooter({ text: 'nepnep#1358', iconURL: 'https://store.playstation.com/store/api/chihiro/00_09_000/container/BE/nl/19/EP0031-CUSA03124_00-AV00000000000037/image?w=320&h=320&bg_color=000000&opacity=100&_version=00_09_000' });

        skinEmbeds.push(skinEmbed);

        if (skins.length != 1) {
            skinActionRow.addComponents(
                new ButtonBuilder()
                .setCustomId(`skin${i}`)
                .setLabel(`Skin ${i + 1}`)
                .setStyle(ButtonStyle.Primary)
        )};
    }

    return { embeds: skinEmbeds,
             actionRow: skinActionRow
        };
}


// Ship
async function createShipEmbed(name) {
    // Search ship
    shipres = await fetch(`https://www.prydwen.gg/page-data/counter-side/ships/${name.trim().replace(/ /g, "-").toLowerCase()}/page-data.json`);

    // Handle error
    if (shipres.status != 200) return;
    
    // JSONify
    shipjson = await shipres.json();
    shipjson = shipjson.result.data.currentUnit.nodes[0];

    
    let ship = new EmbedBuilder()
    .setColor(getRandomColor(colors))
        .setTitle(`[${shipjson.rarity}] ${shipjson.fullName}`)
        .setThumbnail(`https://prydwen.gg${shipjson.smallAvatar.localFile.childImageSharp.gatsbyImageData.images.fallback.src}`)
        .setDescription(`[Check out our detail ratings and reviews](https://www.prydwen.gg/counter-side/ships/${name.trim().replace(/ /g, "-").toLowerCase()})`)
        .setTimestamp()
        .setFooter({ text: 'nepnep#1358', iconURL: 'https://store.playstation.com/store/api/chihiro/00_09_000/container/BE/nl/19/EP0031-CUSA03124_00-AV00000000000037/image?w=320&h=320&bg_color=000000&opacity=100&_version=00_09_000' })
        .addFields({ name: 'RATINGS', value: `PVE: ${RATINGS[shipjson.pveScore]} PVP: ${RATINGS[shipjson.pvpScore]}`});
        
        shipSKills = shipjson.skills;
        // Create skill field for every skillBox
            for (let i = 0; i < shipSKills.length; i++) {
            
                // Add skill's type and name
                shipSkillEmbed += `**${shipSKills[i].type}: ${shipSKills[i].fullName}**`;
                
                // Check for cooldown
                if (shipSKills[i].cooldownSecs) {
                    shipSkillEmbed += ` \`${shipSKills[i].cooldownSecs} seconds\``;
                };
        
                
                // Check for range
                if (shipSKills[i].isFullMap) {
                    shipSkillEmbed += ` \`Full map range\``;
                } else if (shipSKills[i].range) {
                    shipSkillEmbed += ` \`${shipSKills[i].range} range\``;
                }
        
                // Add skill description
                shipSkillEmbed += `\n\`\`\`${shipSKills[i].description.description}\nMax upgrade bonus: ${shipSKills[i].buildDescription.buildDescription}\`\`\``;
                    
                // Add Skills
                if (i == 0) {
                    // Only the first field has name
                    ship.addFields({ name: 'SKILLS', value: shipSkillEmbed });
                } else {
                    ship.addFields({ name: '\u200b', value: shipSkillEmbed });
                }
                shipSkillEmbed = '';
            }

        return ship;
}




function getRandomColor(colours) {
    return colours[Math.floor(Math.random() * colours.length)];
}

// Export
module.exports = { createProfileEmbed, suggestMessage, getSlug, createOperatorEmbed, createSkinEmbed, createShipEmbed, getRandomColor, rearmAndAwakenedSlug };