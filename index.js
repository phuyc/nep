const Discord = require("discord.js")
const keepAlive = require("./server")
const { help, credits, noSkin, profileUsage, operatorUsage, skinUsage, shipUsage, colors } = require("./embeds")
const { createProfileEmbed, createOperatorEmbed, suggestMessage, getSlug, createSkinEmbed, createShipEmbed, getRandomColor, rearmAndAwakenedSlug } = require("./profile")
const Database = require("better-sqlite3");
const { ActivityType } = require("discord.js");
const autoUpdate = require("./update");
var Mutex = require('async-mutex').Mutex;

/*
TODO: Add a command that show lists of employees, operators, skins, ships (p!list)
      Add small QOL (p!operator, p!profile)
 */

// Mutex
const mutex = new Mutex();

// Declare variables
let name, embed, suggests, message, profile, wait, messages, slug, type, skin, index, ship, caseInsensitive;
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
    if (!msg.content.trim().toLowerCase().startsWith(prefix)) return;

    caseInsensitive = msg.content.trim().toLowerCase();
    // For static commands
    switch (caseInsensitive) {

        // Help
        case prefix + "help":
        case prefix + 'h':
            msg.channel.send({ embeds: [help.setColor(getRandomColor(colors))] });
            break;

        // Ping (https://stackoverflow.com/questions/63411268/discord-js-ping-command)
        case prefix + 'ping':
            msg.channel.send('Loading data...').then (async (ping) =>{
                ping.delete()
                msg.channel.send(`🏓Your Latency is ${ping.createdTimestamp - msg.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
            })
            break;
        
        // Credits
        case prefix + 'i':
        case prefix + 'info':
            msg.channel.send({ embeds: [credits.setColor(getRandomColor(colors))] });
            break;
    
        // Stat
        case prefix + 'stat':
            msg.channel.send(`currently in ${client.guilds.cache.size} servers with ${client.guilds.cache.map((guild) => guild.memberCount).reduce((p, c) => p + c)} users`);
            break;

        // Profile (Usage)
        case prefix + 'p':
        case prefix + 'profile':
            msg.channel.send({ embeds: [profileUsage.setColor(getRandomColor(colors))]});
            break;

        // Operator (Usage)
        case prefix + 'o':
        case prefix + 'operator':
            msg.channel.send({ embeds: [operatorUsage.setColor(getRandomColor(colors))] });
            break;

        // Skin (Usage)
        case prefix + 'skin':
            msg.channel.send({ embeds: [skinUsage.setColor(getRandomColor(colors))] });
            break;
        case prefix + 'ship':
            msg.channel.send({ embeds: [shipUsage.setColor(getRandomColor(colors))]});
            break;
    };


    // p!p
    if (/^\bp!p\b.+/i.exec(caseInsensitive) || /^\bp!profile\b.+/i.exec(caseInsensitive)) {

        // Lock
        await mutex.runExclusive(async () => {

            // Get name
            if (msg.content.toLowerCase().startsWith('p!p')) name = msg.content.slice(4);
            if (msg.content.startsWith('p!profile')) name = msg.content.slice(10);            

            // Send wait
            wait = await msg.channel.send("Please wait...");

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
            wait.delete();
        });
    };


    // p!o
    if (/^\bp!o\b.+/i.exec(caseInsensitive) || /^\bp!operator\b.+/i.exec(caseInsensitive)) {
        
        await mutex.runExclusive(async () => {
            
            // Get name
            if (msg.content.startsWith('p!o')) name = msg.content.slice(4);
            if (msg.content.startsWith('p!operator')) name = msg.content.slice(11);   
            
            // Send wait
            wait = await msg.channel.send("Please wait...");

            // Create and send profile embed if found
            embed = await createOperatorEmbed(name);
            
            // Delete wait
            wait.delete();
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
    

    // p!skin
    if (/^\bp!skin\b.+/i.exec(caseInsensitive)) {

        await mutex.runExclusive(async () => {

            name = msg.content.slice(7);

            // Send wait
            wait = await msg.channel.send("Please wait...");

            // Create and send profile embed if found
            skin = await createSkinEmbed(name);
            
            // Send suggest if can't find employee
            if (skin === 1) {
                suggests = suggestMessage(name, db, "skin");
                msg.channel.send({
                    content: suggests[0],
                    components: [suggests[1]],
                })
                // Store the message's id in an object to access it later in interactionCreate and delete it after
                .then( sent => { timeout[sent.id] = setTimeout(() => {sent.delete(); delete timeout[sent.id]}, 6000) });
                wait.delete();
                return;
            }

            // Found employee has no skin
            if (skin === 2) {
                msg.channel.send({ embeds: [noSkin] });
                wait.delete();
                return;
            }

            // Found employee has 1 skin
            if (!skin.actionRow) {
                msg.channel.send({ embeds: [skin.embeds[0]] });
                wait.delete();
                return;
            }
            
            // Found employee has multiple skins
            msg.channel.send({
                embeds: [skin.embeds[0]],
                components: [skin.actionRow]
            })
            // Save the skins and actionRow for further uses for 15 minutes
            .then( sent => {timeout[sent.id] = skin;
                            setTimeout(() => {delete timeout[sent.id]}, 900000);
            });

            // Delete wait
            wait.delete();
    })}


    // p!ship
    if (/^\bp!ship\b.+/i.exec(caseInsensitive)) {

        await mutex.runExclusive(async () => {

            name = msg.content.slice(7);

            // Send wait
            wait = await msg.channel.send("Please wait...");

            // Create and send profile ship if found
            ship = await createShipEmbed(name);
            
            // Send suggest if can't find employee
            if (!ship) {
                suggests = suggestMessage(name, db, "ship");
                msg.channel.send({
                    content: suggests[0],
                    components: [suggests[1]],
                })
                // Store the message's id in an object to access it later in interactionCreate and delete it after
                .then( sent => { timeout[sent.id] = setTimeout(() => {sent.delete(); delete timeout[sent.id]}, 6000) });
                wait.delete();
                return;
            }

            msg.channel.send({ embeds: [ship] })

            // Delete wait
            wait.delete();
        })}

    // TODO:
    if (/^\bp!list\b.+/i.exec(caseInsensitive)) {
        // Invalid arguments
        return;
        if (!['employee', 'operator', 'ship', 'skin'].includes(msg.content.slice(7).trim)) {
            // TODO: Return Usage embed
        }

        // TODO: Code p!list

    }

});




// Interaction
client.on('interactionCreate', async interaction => {
	if (interaction.isButton) {
        if (['1', '2', '3'].includes(interaction.customId)) {
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
                wait = await interaction.message.channel.send("Please wait...");
                
                // Get the part that matters
                message = messages[interaction.customId].slice(3);

                // Get slug and type
                slug = getSlug(message, db, type);

                // Send profile embed
                if (type === "employee") {
                    profile = await createProfileEmbed(slug['slug']);
                    interaction.channel.send({ embeds: [profile] });

                // Operator
                } else if (type === "operator") {
                    profile = await createOperatorEmbed(slug['slug']);
                    interaction.channel.send({ embeds: [profile] });

                // Skin
                } else if (type === "ship") {
                    profile = await createShipEmbed(slug['slug']);
                    interaction.channel.send({ embeds: [profile] })
                    
                //Ship
                } else if (type === "skin") {
                    profile = await createSkinEmbed(slug['slug']);

                    // Found employee has no skin
                    if (profile === 2) {
                        interaction.channel.send({ embeds: [noSkin] });
                        wait.delete();
                        return;
                    }

                    // Found employee has 1 skin
                    if (!profile.actionRow) {
                        interaction.channel.send({ embeds: [profile.embeds[0]] });
                        wait.delete();
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

                // Delete wait
                wait.delete();
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
}})


client.login(process.env.TOKEN);

keepAlive();

setInterval(autoUpdate, 1800000)