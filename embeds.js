const { EmbedBuilder } = require('discord.js');

// TODO: Add a suggestion when client type a wrong name
// TODO: Handles employees with only 2 ratings

// Help
const help = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('List of commands')
        .setDescription('PP help')
        .setThumbnail('https://i1.sndcdn.com/artworks-000163789531-joeawb-t500x500.jpg')
        .addFields(
            { name: ':mag: p!p or p!profile', value: 'Looks up an employee\'s profile (add **r** and **a** at the start for Rearm and Awakened). **Example: p!profile rmina**' },
            { name: ':smirk: p!s or p!skin', value: 'Displays employee\'s skin (default included)' },
            { name: ':question: p!h or p!help', value: 'Displays this message' },
        )
        .setImage('https://encdn.ldmnq.com/ldstore/ar/sc3DfZ-1653876352710.webp')
        .setTimestamp()
        .setFooter({ text: 'nepnep#1358', iconURL: 'https://store.playstation.com/store/api/chihiro/00_09_000/container/BE/nl/19/EP0031-CUSA03124_00-AV00000000000037/image?w=320&h=320&bg_color=000000&opacity=100&_version=00_09_000' });


// Export functions
module.exports = help

