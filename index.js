const Discord = require("discord.js")
const keepAlive = require("./server")
const { help, credits } = require("./embeds")
const { createProfileEmbed, createOperatorEmbed, suggestMessage, getSlug, rearmSlug } = require("./profile")
const Database = require("better-sqlite3");
const { ActivityType } = require("discord.js");
var Mutex = require('async-mutex').Mutex;

// TODO: change emojis to better image extension

// Mutex
const mutex = new Mutex();

// Declare variables
let name, embed, suggests, message, profile, wait1, wait2, wait3, messages, ar, slug, type;
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
client.once("ready", () => {
    client.user.setActivity('p!help for commands', { type: ActivityType.Playing })
    console.log(`Logged in as ${client.user.tag}`);
    console.log(client.guilds.cache.size);
    console.log(client.guilds.cache.map((guild) => guild.memberCount).reduce((p, c) => p + c));
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
        case prefix + 'stat':
            msg.channel.send(`currently in ${client.guilds.cache.size} servers with ${client.guilds.cache.map((guild) => guild.memberCount).reduce((p, c) => p + c)} users`);
            break;
    };

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

            // send suggestions if not found and delete it after 10 seconds 
            else {
                suggests = suggestMessage(name, db, "employee");
                msg.channel.send({
                    content: suggests[0],
                    components: [suggests[1]],
                })
                // Store the message's id in an object to access it later in interactionCreate and delete it after
                .then( sent => { timeout[sent.id] = setTimeout(() => {sent.delete(); delete timeout[sent.id]}, 6000) })
            }

            // Delete wait
            wait1.delete();
        });
    };

    // p!o
    if (/^\bp!o\b.+/i.exec(msg.content.trim())) {
        await mutex.runExclusive(async () => {
            name = msg.content.slice(4);
            // Send wait
            wait3 = await msg.channel.send("Please wait...");

            // Create and send profile embed if found
            embed = await createOperatorEmbed(name);
            
            // Delete wait
            wait3.delete();
            if (embed) {
                msg.channel.send({ embeds: [embed] });
            }

            // send suggestions if not found and delete it after 10 seconds 
           else {
                suggests = suggestMessage(name, db, "operator");
                msg.channel.send({
                    content: suggests[0],
                    components: [suggests[1]],
                })
                // Store the message's id in an object to access it later in interactionCreate and delete it after
                .then( sent => { timeout[sent.id] = setTimeout(() => {sent.delete(); delete timeout[sent.id]}, 6000) })
            }

        })
    };
});


client.on('interactionCreate', async interaction => {
	if (interaction.isButton) {
        await mutex.runExclusive(async () => {
            // Search for newline
            messages = interaction.message.content.match(/^(.*)$/gm);
            type = messages[0].slice(17, -1).trim();

            // Clear timeout and delete message's id
            clearTimeout(timeout[interaction.message.id]);

            // Delete suggestions
            if (timeout[interaction.message.id]) {
                interaction.message.delete();
                delete timeout[interaction.message.id];
            }

            // Send wait and delete suggestions
            wait2 = await interaction.message.channel.send("Please wait...");
            
            // Get the part that matters
            message = messages[interaction.customId].slice(3);

            // Get slug and type
            slug = getSlug(message, db, type);

            // Send profile embed
            if (type === "employee") {
                profile = await createProfileEmbed(slug['slug']);
            } else {
                profile = await createOperatorEmbed(slug['slug']);
            }

            // Delete wait
            wait2.delete();

            interaction.channel.send({ embeds: [profile] });

        });
    };
});


client.login(process.env.TOKEN);

keepAlive();