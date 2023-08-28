const { Events, PermissionsBitField } = require("discord.js");

module.exports = {
    name: Events.MessageCreate,
    async execute(msg) {
	if (!msg.guild.members.me.permissionsIn(msg.channel)) return;
        if (!msg.guild.members.me.permissionsIn(msg.channel).has([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.UseExternalEmojis])) {
            return;
        }
        if (msg.content.trim().toLowerCase().startsWith('p!')) {
            msg.reply('Nep has switched to slash command. Please re-invite nep to the server and use /help for the list of commands.')
        }
    }
}
