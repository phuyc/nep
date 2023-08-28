const { Events, PermissionsBitField, EmbedBuilder } = require("discord.js");
const createOperatorEmbed = require("../functions/createOperatorEmbed");
const createProfileEmbed = require("../functions/createProfileEmbed");
const createShipEmbed = require("../functions/createShipEmbed");
const createSkinEmbed = require("../functions/createSkinEmbed");
const getSlug = require("../functions/getSlug");
const { timeout } = require("../functions/timeout");
const Mutex = require('async-mutex').Mutex;

// Mutex
const mutex = new Mutex();

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Check for permissions
        if (!interaction.isButton()) return;
	if (!interaction.guild.members.me.permissionsIn(interaction.channel)) return;
        if (!interaction.guild.members.me.permissionsIn(interaction.channel).has([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.UseExternalEmojis])) {
            await interaction.reply("nep does not have permission to send messages here.");
            return;
        }
        if (['1', '2', '3'].includes(interaction.customId)) {
            await mutex.runExclusive(async () => {
                // Search for newline
                messages = interaction.message.content.match(/^(.*)$/gm);
                type = messages[0].slice(17, -1).trim();
    
                // Clear timeout and delete message's id
                clearTimeout(timeout[interaction.message.id]);
    
                // Delete suggestions
                if (timeout[interaction.message.id] && interaction.message.deletable) {
                    interaction.message.delete();
                    delete timeout[interaction.message.id];
                }
                
                // Get the part that matters
                message = messages[interaction.customId].slice(3);
    
                // Get slug and type
                slug = getSlug(message, type);
    
                // Send profile embed
                if (type === "employee") {
                    profile = await createProfileEmbed(slug['slug']);
                    interaction.channel.send({ embeds: [profile] });
    
                // Operator
                } else if (type === "operator") {
                    profile = await createOperatorEmbed(slug['slug']);
                    interaction.channel.send({ embeds: [profile] });
    
                // Ship
                } else if (type === "ship") {
                    profile = await createShipEmbed(slug['slug']);
                    interaction.channel.send({ embeds: [profile] })
                    
                //Skin
                } else if (type === "skin") {
                    profile = await createSkinEmbed(slug['slug']);
    
                    // Found employee has no skin
                    if (profile === 2) {
                        interaction.channel.send({ embeds: [noSkin] });
                        return;
                    }
    
                    // Found employee has 1 skin
                    if (!profile.actionRow) {
                        interaction.channel.send({ embeds: [profile.embeds[0]] });
                        return;
                    }
    
                    interaction.channel.send({
                        embeds: [profile.embeds[0]],
                        components: [profile.actionRow] 
                    })            
                    // Save the skins and actionRow for further uses for 15 minutes
                    .then( sent => {timeout[sent.id] = profile;
                                    setTimeout(() => {delete timeout[sent.id]}, 900000);
                    });
                }
                return;
            });
        }
    
        if (['skin0', 'skin1', 'skin2', 'skin3', 'skin4', 'skin5'].includes(interaction.customId)) {
            await mutex.runExclusive(async () => {
                // Get index
                index = interaction.customId.slice(4);
    
                // Get the stored embeds and actionRow
                message = timeout[interaction.message.id];
    
                // Send an ephemeral if the components have expired
                if (!message) {
                    interaction.reply({ content: "this button has expired. Please look up the skin again with p!skin", ephemeral: true });
                    return;
                }
    
                // Edit the message to the desired skin
                interaction.message.edit({ 
                    embeds: [message.embeds[index]],
                    components: [message.actionRow]
                });
    
                interaction.deferUpdate();
                return;
            })
        }
    }
}


const noSkin = new EmbedBuilder()
        .setColor(0xED343E)
        .addFields({ name: 'OOPS', value: "This employee doesn't have any skin (for now)" });
