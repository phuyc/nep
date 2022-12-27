const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Returns API Latency'),
    execute(interaction) {
        interaction.reply(`🏓API Latency is ${Math.round(interaction.client.ws.ping)}ms`);
    }
}