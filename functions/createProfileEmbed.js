const { EmbedBuilder } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { TYPES, ROLES, RATINGS } = require("./emojis");
const randomColor = require("./randomColor");
const rearmAwkSlug = require("./rearmAwkSlug");

// TODO: fix this
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
    name = rearmAwkSlug(name);

    // Fetch profile from prydwen.gg
    let res = await fetch(`https://www.prydwen.gg/page-data/counter-side/characters/${name.trim().replace(/ /g, "-").toLowerCase()}/page-data.json`);

    // Handle error
    if (res.status != 200) return;

    // JSON
    let json = await res.json();
    json = json.result.data.currentUnit.nodes[0];

    // For units that has 2 types
    if (json.type.length > 1) {
        json.type[0] = json.type.join('');
    }

    let skillEmbed = '';
    
    // Create skill field for every skillBox
    for (let skill of json.skillsUpdated) {
        
        // Add skill's type and name
        skillEmbed += skill.name == '**Basic Attack**' ? 'Basic Attack' : `**${skill.type}: ${skill.name}**`;
        
        // Check for valid hit
        if (skill.validHits) {
            skillEmbed += ` \`${skill.validHits} valid hits\``;
        };
        
        let metric = json.isItFuryUser ? 'basic attacks' : 'seconds';


        // Check for cooldown
        if (skill.cooldown) {
            skillEmbed += ` \`${skill.cooldown} ${metric}\``;
        };

        // Add skill description
        skillEmbed += `\n\`\`\`${skill.baseDescription.baseDescription}\`\`\``;

        // Add level 5
        skillEmbed += `\`At level 5: ${skill.level5.level5}\``;

        // Add level 10
        if (json.isRearmed) {
            skillEmbed += `\n\`At level 10: ${skill.level10.level10}\``;      
        }

        skillEmbed += '\n\n';

    };

    // Create embed
    let profile = new EmbedBuilder()
    .setTitle(`[${json.rarity}] ${json.fullName}`)
    .setDescription(`[Check out our detailed ratings and reviews](https://www.prydwen.gg/counter-side/characters/${name.trim().replace(/ /g, "-").toLowerCase()})`)
    .setThumbnail(`https://prydwen.gg${json.smallAvatar.localFile.childImageSharp.gatsbyImageData.images.fallback.src}`)
    .setColor(randomColor())
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

        // Create embed field 3.i (Skills)
        profile.addFields({ name: 'SKILLS', value: skillEmbed });

    // Create embed field 4 (Gear rec)
    if (json.gearRecommendation) profile.addFields({ name: "GEAR RECOMMENDATION", value: `PVE: \`${json.gearRecommendation.pve.set}\`\nPVP: \`${json.gearRecommendation.pvp.set}\``})

    // Timestamp
    .setTimestamp()

    // Footer
    .setFooter({ text: 'nepnep#1358', iconURL: 'https://store.playstation.com/store/api/chihiro/00_09_000/container/BE/nl/19/EP0031-CUSA03124_00-AV00000000000037/image?w=320&h=320&bg_color=000000&opacity=100&_version=00_09_000' });
    
    // Return
    return profile;
}

module.exports = createProfileEmbed