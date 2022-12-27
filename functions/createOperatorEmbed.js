const { EmbedBuilder } = require("discord.js");
const randomColor = require("../functions/randomColor");
const fetch = require("node-fetch");
const { RATINGS } = require("./emojis");

// Operators
async function createOperatorEmbed(name) {
    // Fetch and JSON-ify
    let opres = await fetch(`https://www.prydwen.gg/page-data/counter-side/operators/${name.trim().replace(/ /g, "-").toLowerCase()}/page-data.json`);
    if (opres.status != 200) return;
    let opjson = await opres.json();
    opjson = opjson.result.data.currentUnit.nodes[0];

    // Basically the same thing as profile
    let operator = new EmbedBuilder()
    .setTitle(`[${opjson.rarity}] ${opjson.fullName}`)
    .setDescription(`[Check out our detailed ratings and reviews](https://www.prydwen.gg/counter-side/operators/${name.trim().replace(/ /g, "-").toLowerCase()})`)
    .setThumbnail(`https://prydwen.gg${opjson.smallAvatar.localFile.childImageSharp.gatsbyImageData.images.fallback.src}`)
    .setColor(randomColor())
    .addFields(
        // STATS
        {name: "STATS (LVL100)", value: `Ship's HP: +${opjson.operatorHp}%\nShip's ATK: +${opjson.operatorAtk}%`, inline: true},
        {name: "\u200b", value: `Ship's DEF: +${opjson.operatorDef}%\nShip's CDR: +${opjson.operatorHaste}%`, inline: true},

        // RATINGS
        {name: "RATINGS", value: `PVE: ${RATINGS[opjson.pveScore] ?? '?'} PVP: ${RATINGS[opjson.pvpScore] ?? '?'}`},

        // SKill
        {name: opjson.operatorSkill.name, value: `**Skill trigger order: ${opjson.triggerOrder}**\n**At level 1:**\n\`\`\`${opjson.operatorSkill.description}\`\`\`\n**At level 8:**\n\`\`\`${opjson.operatorSkill.description_8}\`\`\``}
    )

    return operator;
}

module.exports = createOperatorEmbed