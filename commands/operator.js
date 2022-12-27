const { SlashCommandBuilder } = require("discord.js");
const { bestMatch } = require("../functions/bestMatch");
const createOperatorEmbed = require("../functions/createOperatorEmbed");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('operator')
        .setDescription('Returns the information of an operator')
        .addStringOption(option =>
            option.setName('name')
                  .setDescription('Name of the operator')
                  .setRequired(true)),
    async execute(interaction) {
        const name = interaction.options.getString('name').toLowerCase().trim();

        // Create and send profile embed if found
        let embed = await createOperatorEmbed(name);

        if (embed) {
            interaction.reply({ embeds: [embed] });
            return;
        }

        // send suggestions if not found and delete it after 10 seconds 
        else {
            // Return the best match
            let match = bestMatch(name, 'operator');
            if (match) {
                embed = await createOperatorEmbed(match);
                await interaction.reply({ embeds: [embed]});
                return;
            } else {
                await interaction.reply({ content: "Couldn't find the character!", ephemeral: true });
                return;
            }
        }
    }
}