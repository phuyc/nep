const Discord = require("discord.js")
const keepAlive = require("./server")
const [ help, profile ] = require("./embeds")

require("dotenv").config()

const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES"
    ]
})

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`)
})

client.on("messageCreate", msg => {
    if (msg.content == "p!help" || msg.content == "p!h") {
        msg.channel.send({ embeds: [help] })
    }
})

client.login(process.env.TOKEN);
keepAlive()
