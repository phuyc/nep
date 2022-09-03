const Discord = require("discord.js")
const keepAlive = require("./server")
const { help, credits } = require("./embeds")
const { createProfileEmbed, suggestMessage, getSlug, rearmSlug } = require("./profile")
const Database = require("better-sqlite3");
const { ActivityType } = require("discord.js");
var Mutex = require('async-mutex').Mutex;


// Mutex
const mutex = new Mutex();

// Declare variables
let name, embed, suggests, message, profile, wait1, wait2, messages, ar;
const timeout = {};
let prefix = 'p!';

// Open db
const db = new Database("./employees.db");

require("dotenv").config()

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent
    ]
})

// Run bot
client.on("ready", () => {
    client.user.setActivity('p!help for commands', { type: ActivityType.Playing })
    console.log(`Logged in as ${client.user.tag}`)
})

//Check messages
client.on("messageCreate", async msg => {
    if (msg.author.id == '977387486655414412') return;

    switch (msg.content) {

        // Help
        case prefix + "help":
        case prefix + 'h':
            msg.channel.send({ embeds: [help] });
            break;

        // Ping (https://stackoverflow.com/questions/63411268/discord-js-ping-command)
        case prefix + 'ping':
            msg.channel.send('Loading data...').then (async (ping) =>{
                ping.delete()
                msg.channel.send(`🏓Latency is ${ping.createdTimestamp - msg.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
            })
            break;
        
        // Credits
        case prefix + 'i':
        case prefix + 'info':
            msg.channel.send({ embeds: [credits] });
            break;
    }

    // p!p
    if (/^\bp!p\b.+/i.exec(msg.content.trim())) {

        // Lock
        await mutex.runExclusive(async () => {
            // Get name
            name = msg.content.slice(4);

            // ar
            ar = name.slice(0, 2).toLowerCase();

            // Check for awakeneds
            if (ar === 'a.') {
                name = 'Awakened ' + name.slice(2);
            };

            // Check for rearms
            if (ar === 'r.') {
                name = rearmSlug(name);
            }

            // Send wait
            wait1 = await msg.channel.send("Please wait...");

            // Create and send profile embed if found
            embed = await createProfileEmbed(name);
            if (embed) {
                msg.channel.send({ embeds: [embed] });
            }

            // send suggestions if not found and delete it after 8 seconds 
            else {
                suggests = suggestMessage(name, db);
                msg.channel.send({
                    content: suggests[0],
                    components: [suggests[1]],
                })
                // Store the message's id in an object to access it later in interactionCreate and delete it after
                .then( sent => { timeout[sent.id] = setTimeout(() => {sent.delete(); delete timeout[sent.id]}, 10000) })
            }

            // Delete wait
            wait1.delete();
        });
    };
});


client.on('interactionCreate', async interaction => {
	if (interaction.isButton) {
        await mutex.runExclusive(async () => {
            // Search for newline   
            messages = interaction.message.content.slice(3).match(/^(.*)$/gm);

            // clear timeout and delete message's id
            clearTimeout(timeout[interaction.message.id]);
            delete timeout[interaction.message.id];

            // Send wait and delete suggestions
            interaction.message.delete();
            wait2 = await interaction.channel.send("Please wait...");
            
            // Get the part that matters
            message = messages[interaction.customId].slice(3);

            // Send profile embed
            profile = await createProfileEmbed(getSlug(message, db));
            interaction.channel.send({ embeds: [profile] });

            // Delete wait
            wait2.delete();
        });
    };
});


client.login(process.env.TOKEN);

keepAlive();