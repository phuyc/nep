const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { default: fetch } = require("node-fetch");
const randomColor = require("./randomColor");
const rearmAwkSlug = require("./rearmAwkSlug");

async function createSkinEmbed(name) {
    // Check for Awakened or Rearm
    name = rearmAwkSlug(name);

    // Search employee's skin
    let res = await fetch(`https://www.prydwen.gg/page-data/counter-side/characters/${name.trim().replace(/ /g, "-").toLowerCase()}/page-data.json`);

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
    let sk = [];

    for (let i = 0; i < skins.length; i++) {
        // TODO: 
        // Search for the path to the largest webp, which contains 029bb
        //skinImages.push(/\b.*029bb.*\s/i.exec(skins[i].fullImage.localFile.childImageSharp.gatsbyImageData.images.sources[0].srcSet));
        sk.push({
            name: skins[i].name,
            skinImage: skins[i].fullImage.localFile.childImageSharp.gatsbyImageData.images.fallback.src,
        })
    }

    // Create message components
    let skinActionRow;
    let skinEmbeds = [];
    
    if (skins.length != 1) {
        skinActionRow = new ActionRowBuilder();
    }

    for (let i = 0; i < sk.length; i++) {

        let skinEmbed = new EmbedBuilder()
        .setColor(randomColor())
        .setTitle(sk[i].name)
        .setImage(`https://prydwen.gg${sk[i].skinImage}`)
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

module.exports = createSkinEmbed