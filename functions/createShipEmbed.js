const { EmbedBuilder } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { RATINGS } = require("./emojis");
const randomColor = require("./randomColor");

// TODO: fix this
async function createShipEmbed(name) {
    // Search ship
    let shipres = await fetch(`https://www.prydwen.gg/page-data/counter-side/ships/${name.trim().replace(/ /g, "-").toLowerCase()}/page-data.json`);

    // Handle error
    if (shipres.status != 200) return;
    
    // JSONify
    let shipjson = await shipres.json();
    shipjson = shipjson.result.data.currentUnit.nodes[0];

    
    let ship = new EmbedBuilder()
    .setColor(randomColor())
        .setTitle(`[${shipjson.rarity}] ${shipjson.fullName}`)
        .setThumbnail(`https://prydwen.gg${shipjson.smallAvatar.localFile.childImageSharp.gatsbyImageData.images.fallback.src}`)
        .setDescription(`[Check out our detailed ratings and reviews](https://www.prydwen.gg/counter-side/ships/${name.trim().replace(/ /g, "-").toLowerCase()})`)
        .setTimestamp()
        .setFooter({ text: 'nepnep#1358', iconURL: 'https://store.playstation.com/store/api/chihiro/00_09_000/container/BE/nl/19/EP0031-CUSA03124_00-AV00000000000037/image?w=320&h=320&bg_color=000000&opacity=100&_version=00_09_000' })
        .addFields({ name: 'RATINGS', value: `PVE: ${RATINGS[shipjson.pveScore]} PVP: ${RATINGS[shipjson.pvpScore]}`});
        
        let shipSKills = shipjson.skills;
        let shipSkillEmbed;

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

module.exports = createShipEmbed