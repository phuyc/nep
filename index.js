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

// Run bot
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`)
})

//Check messages
client.on("messageCreate", msg => {
    if (msg.content == "p!help" || msg.content == "p!h") {
        msg.channel.send({ embeds: [help] })
    }

    // Handles p!p and p!profile
    result1 = /^\bp!p\b/i.exec(msg.content)
    result2 = /^\bp!profile\b/i.exec(msg.content)

    // p!p
    if (result1) {
        let name = msg.content.slice(4);
        (async () => {
            embed = await createProfileEmbed(name);
            msg.channel.send({ embeds: [embed] });
          })();
    }

    // p!profile
    else if (result2) {
        let name = msg.content.slice(10);
        (async () => {
            embed = await createProfileEmbed(name);
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
