const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const randomColor = require("../functions/randomColor");

const help = new EmbedBuilder()
        .setTitle('List of commands')
        .setDescription('/help')
        .setThumbnail('https://img-10.stickers.cloud/packs/977bc206-85d3-4882-bd71-a8ab12956a4e/webp/c8bf8419-c2e4-4810-ab71-862dfb67614e.webp')
        .addFields(
            { name: '<:yuna_stare:1015286941761151067> /employee', value: 'Looks up an employee\'s profile (add **a.** and **r.** at the start for Awakeneds and Rearms). **Example: /employee a.shin jia**' },
            { name: '<:momo:1024286695211933766> /operator', value: 'Same thing but operator'},
            { name: '<:hildeproud:1033226597693665380> /ship', value: 'Same thing but ship'},
            { name: '<:yumpeko:1033225443618332692> /skin', value: 'Displays employee\'s skin (default excluded)' },
            { name: '🏓 /ping', value: 'Return latency.' },
            { name: '<:xiao_lin:1015288048851882115> /help', value: 'Displays this message' },
            { name: '<:shadow_overview:1015284890020892672> /info', value: 'Displays bot info' }
        )
        .setImage('https://i.imgur.com/V6sdSFJ.png')
        .setTimestamp()
        .setFooter({ text: 'nepnep#1358', iconURL: 'https://store.playstation.com/store/api/chihiro/00_09_000/container/BE/nl/19/EP0031-CUSA03124_00-AV00000000000037/image?w=320&h=320&bg_color=000000&opacity=100&_version=00_09_000' });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays list of commands'),
    async execute(interaction) {
        await interaction.reply({ embeds: [help.setColor(randomColor())] })
    }
}