const Discord = require("discord.js")
const keepAlive = require("./server")
const help = require("./embeds")
const { createProfileEmbed, suggest } = require("./profile")

require("dotenv").config()

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent
    ]
})

// Run bot
client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`)
})

//Check messages
client.on("messageCreate", msg => {
    if (msg.content === "p!help" || msg.content === "p!h") {
        msg.channel.send({ embeds: [help] })
    }

    // Handles p!p and p!profile
    let result1 = /^\bp!p\b/i.exec(msg.content)
    let result2 = /^\bp!profile\b/i.exec(msg.content)

    // p!p
    if (result1) {
        let name = msg.content.slice(4);
        (async () => {
            let embed = await createProfileEmbed(name);
            if (embed) {
                msg.channel.send({ embeds: [embed] });
            }
            else {
                let sug = suggest(name);
                msg.channel.send({
                    content: sug[0],
                    components: [sug[1]],
                })}
          })();
    }

    // p!profile
    else if (result2) {
        let name = msg.content.slice(10);
        (async () => {
            embed = await createProfileEmbed(name);
            if (embed) {
                msg.channel.send({ embeds: [embed] });
            }
            else {
                let suggest = suggest(name);
                msg.channel.send({
                    content: suggest[0],
                    components: [suggest[1]],
                })}
          })();
    }

})

client.login(process.env.TOKEN);

keepAlive()
