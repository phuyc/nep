const { Events, PermissionsBitField } = require("discord.js");

module.exports = {
    name: Events.MessageCreate,
    async execute(msg) {
        if (!msg.guild.members.me.permissionsIn(msg.channel).has([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.UseExternalEmojis])) {
            await msg.reply("nep does not have permission to send messages here.");
            return;
        }
        if (msg.content.trim().toLowerCase().startsWith('p!')) {
            msg.reply('Nep has switch to slash command. Please use /help to get the list of commands.')
        }
    }
}