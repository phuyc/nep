const { EmbedBuilder } = require('discord.js');

// Help
const help = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('List of commands')
        .setDescription('PP help')
        .setThumbnail('https://img-10.stickers.cloud/packs/977bc206-85d3-4882-bd71-a8ab12956a4e/webp/c8bf8419-c2e4-4810-ab71-862dfb67614e.webp')
        .addFields(
            { name: '<:yuna_stare:1015286941761151067> p!p', value: 'Looks up an employee\'s profile (add **a.** and **r.** at the start for Awakeneds and Rearms). **Example: p!p a.shin jia**' },
            { name: '<:momo:1024286695211933766> p!o', value: 'Looks up an operators\'s profile'},
       //   { name: ':smirk: p!s', value: 'Displays employee\'s skin (default included)' }, Coming soon
            { name: '🏓 p!ping', value: 'Return latency.' },
            { name: '<:xiao_lin:1015288048851882115> p!h or p!help', value: 'Displays this message' },
            { name: '<:shadow_overview:1015284890020892672> p!info', value: 'Displays bot info' }
        )
        .setImage('https://i.imgur.com/V6sdSFJ.png')
        .setTimestamp()
        .setFooter({ text: 'nepnep#1358', iconURL: 'https://store.playstation.com/store/api/chihiro/00_09_000/container/BE/nl/19/EP0031-CUSA03124_00-AV00000000000037/image?w=320&h=320&bg_color=000000&opacity=100&_version=00_09_000' });

const credits = new EmbedBuilder()
            .setColor(0xAE21E8)
            .setTitle('About')
            .setThumbnail('https://preview.redd.it/kt3311mn5bp01.png?auto=webp&s=e420455ca8880f533a66514151a197f0f89adce6')
            .addFields(
                { name: 'Bot Info', value: 'A bot to look up an employee\'s profile from the game Counter:Side\n**Creator:** nepnep\n**Data provided by:** [Prydwen](https://prydwen.co)\n**Inspired by Hifumin Bot**', inline: true},
                { name: 'Contact Info', value: `**Discord username:**\nnepnep#1358\n**Help me pay my tuition fee:**\nhttps://www.paypal.com/paypalme/hebuba?country.x=SE&locale.x=en_US`, inline: true}
            );


// Export functions
module.exports = { help, credits };

