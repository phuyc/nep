const { SlashCommandBuilder } = require("discord.js");
const suggestMessage = require("../functions/suggestMessage");
const { timeout } = require("../functions/timeout");
const createShipEmbed = require("../functions/createShipEmbed");
const { bestMatch } = require("../functions/bestMatch");

module.exports = {
    // data
    data: new SlashCommandBuilder()
    .setName('ship')
    .setDescription('Returns the information of a ship')
    .addStringOption(option => 
        option.setName('name')
            .setDescription('name of the ship')
            .setRequired(true)),
    // execute
    async execute(interaction) {
        const name = interaction.options.getString('name').toLowerCase().trim();

        // Create and send profile ship if found
        let ship = await createShipEmbed(name);

        if (ship) {
            await interaction.reply({ embeds: [ship] });
            return;
        }
        
        // Send suggest if can't find employee
        else {
            // Return the best match
            let match = bestMatch(name, 'ship');
            if (match) {
                ship = await createShipEmbed(match);
                await interaction.reply({ embeds: [ship] });
                return;
            } else {
                await interaction.reply({ content: "Couldn't find the character!", ephemeral: true });
                return;
            }
        }
    }
}