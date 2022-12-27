const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const createSkinEmbed = require("../functions/createSkinEmbed");
const suggestMessage = require("../functions/suggestMessage");
const { timeout } = require("../functions/timeout");

module.exports = {
    data: new SlashCommandBuilder()
            .setName('skin')
            .setDescription('Returns every skins of an employee (default excluded)')
            .addStringOption(option =>
                option.setName('name')
                    .setDescription('name of the employee')
                        .setRequired(true)),
    async execute(interaction) {
        const name = interaction.options.getString('name').toLowerCase().trim();

        // Create and send profile embed if found
        skin = await createSkinEmbed(name);
                    
        // Send suggest if can't find employee
        if (skin === 1) {
            suggests = suggestMessage(name, "skin");
            interaction.reply({
                content: suggests[0],
                components: [suggests[1]]})

            // Store the message's id in an object to access it later in interactionCreate and delete it after
            let reply = await interaction.fetchReply();
    
            // Delete suggestion after 8 seconds
            timeout[reply.id] = setTimeout(() => {
                interaction.deleteReply();
                delete timeout[reply.id] 
            }, 8000);
            return;
        }
        
        // Found employee has no skin
        if (skin === 2) {
            interaction.reply({ embeds: [noSkin] });
            return;
        }

        // Found employee has 1 skin
        if (!skin.actionRow) {
            interaction.reply({ embeds: [skin.embeds[0]] });
            return;
        }
        
        // Found employee has multiple skins
        interaction.reply({
            embeds: [skin.embeds[0]],
            components: [skin.actionRow]
        })

         // Save the skins and actionRow for further uses for 15 minutes
        let reply = await interaction.fetchReply();
        timeout[reply.id] = skin;
        setTimeout(() => delete timeout[reply.id], 900000)
    }
}


const noSkin = new EmbedBuilder()
        .setColor(0xED343E)
        .addFields({ name: 'OOPS', value: "This employee doesn't have any skin (for now)" });