const { SlashCommandBuilder } = require("discord.js");
const suggestMessage = require("../functions/suggestMessage");
const { timeout } = require("../functions/timeout");
const createProfileEmbed = require("../functions/createProfileEmbed");



module.exports = {
    data: new SlashCommandBuilder()
            .setName('employee')
            .setDescription('Displays the information of an employee')
            .addStringOption(option =>
                option.setName('name')
                    .setDescription('name of the character')
                        .setRequired(true)),
    async execute(interaction) {
        const name = interaction.options.getString('name').toLowerCase().trim();

        // Create and send profile embed if found
        let embed = await createProfileEmbed(name);
        if (embed) {
            interaction.reply({ embeds: [embed] });
        }

        // send suggestions if not found and delete it after 10 seconds 
        else {
            suggests = suggestMessage(name, "employee");
            interaction.reply({
                content: suggests[0],
                components: [suggests[1]],
            })
            // Store the message's id in an object to access it later in interactionCreate and delete it after
            let reply = await interaction.fetchReply();
    
            // Delete suggestion after 8 seconds
            timeout[reply.id] = setTimeout(() => {
                interaction.deleteReply();
                delete timeout[reply.id] 
            }, 8000);
        }
    }
}