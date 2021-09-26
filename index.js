const { Client, Collection, MessageEmbed } = require('discord.js');
const client = new Client();
require('discord-buttons')(client);

const chalk = require('chalk');
const config = require('./config.json');
const fs = require('fs');

client.config = config;

const mysql = require('mysql');
connection = mysql.createPool({
    connectionLimit: 10,
    host: config["database"].host,
    user: config["database"].user,
    password: config["database"].password,
    database: config["database"].name,
});

connection.query(`SELECT * FROM open_tickets`, (err, reslove) => {
    if (err) return console.log(chalk.red `[ERROR]` + chalk.white ` There was an error connecting to the database. If you need support contact Zero via discord ZeroTheDev#1295`)
})



const { sep } = require("path");
const { MessageButton } = require('discord-buttons');
client.prefix = config.prefix;
["commands", "aliases"].forEach(x => client[x] = new Collection());
const load = (dir = "./commands") => {
    fs.readdirSync(dir).forEach(dirs => {
        const commands = fs.readdirSync(`${dir}${sep}`).filter(files => files.endsWith(".js"));
        for (const file of commands) {
            const pull = require(`${dir}/${file}`);
            if (pull.help && typeof(pull.help.name) === "string" && typeof(pull.help.category) === "string") {
                if (client.commands.get(pull.help.name)) return;
                client.commands.set(pull.help.name, pull);
                console.log(chalk.green `Command Loaded ` + chalk.white `${config.prefix}${pull.help.name} | Description: ${pull.help.description}`)
            } else {
                console.log(`${error} Error loading command in ${dir}${dirs}. you have a missing help.name or help.name is not a string. or you have a missing help.category or help.category is not a string`);
                continue;
            }
            if (pull.help.aliases && typeof(pull.help.aliases) === "object") {
                pull.help.aliases.forEach(alias => {
                    if (client.aliases.get(alias)) return console.warn(`Two commands or more commands have the same aliases ${alias}`);
                    client.aliases.set(alias, pull.help.name);
                });
            }
        }
    });
};

load();


client.on('clickButton', async(button) => {
    await button.defer();
    if (!button.message.channel.name.startsWith("ticket-")) {
        connection.query(`SELECT * FROM ticket_settings WHERE channel = '${button.message.channel.id}' AND message_id = '${button.message.id}'`, async(err, reslove) => {
            if (reslove[0]) {
                connection.query(`SELECT * FROM open_tickets WHERE user = '${button.clicker.user.id}' AND ticket_id = '${reslove[0].id}'`, async(err2, reslove2) => {
                    if (reslove2[0]) {
                        button.message.channel.send(`You already have a ticket opended in <#${reslove2[0].channel}>`).then(msg => msg.delete({ timeout: 7500 }))
                    } else {
                        let eve = button.guild.roles.cache.find(r => r.name === "@everyone");
                        let permissionOverwriteArray = [{
                                id: button.clicker.user.id,
                                allow: ['SEND_MESSAGES', 'VIEW_CHANNEL']
                            },
                            {
                                id: eve.id,
                                deny: ['SEND_MESSAGES', 'VIEW_CHANNEL']
                            },
                            {
                                id: client.user.id,
                                allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'MANAGE_MESSAGES']
                            },
                        ]
                        config.ticket.support_roles.forEach(roleid => {
                            let role = button.guild.roles.cache.get(roleid);
                            if (!role) {
                                return;
                            } else {
                                let tempArray = {
                                    id: role.id,
                                    allow: ['SEND_MESSAGES', 'VIEW_CHANNEL']
                                }
                                permissionOverwriteArray.push(tempArray)
                            }
                        })
                        button.guild.channels.create(`ticket-${button.clicker.user.username}`, {
                            text: 'text'
                        }).then(channel => {
                            connection.query(`INSERT INTO open_tickets (user, usertag, channel, time_open, ticket_id) VALUES ('${button.clicker.user.id}', '${button.clicker.user.username}', '${channel.id}', '${new Date()}', '${reslove[0].id}')`)
                            channel.setParent(config.ticket.cat)
                            channel.overwritePermissions(permissionOverwriteArray)
                            let e2 = new MessageEmbed()
                                .setTitle(`Ticket opened!`)
                                .addField(`User`, `${button.clicker.user.username} \`${button.clicker.user.id}\``)
                                .setColor(config.embed.color)
                                .setThumbnail(button.clicker.user.displayAvatarURL({ format: `png`, dynamic: true }))

                            let closebutton = new MessageButton()
                                .setStyle('red')
                                .setLabel(`Close`)
                                .setEmoji('🔒')
                                .setID(`ticket-${channel.id}`)
                            channel.send({ button: closebutton, embed: e2 })
                            let e5 = new MessageEmbed()
                                .setDescription(`Your new ticket has been opened in ${channel}`)
                                .setColor(config.embed.color)
                            button.message.channel.send(e5).then(ms => ms.delete({ timeout: 5000 }));
                        })
                    }
                })
            }
        })
    } else if (button.id.startsWith(`ticket`)) {
        let member = button.message.guild.members.cache.get(button.clicker.user.id);
        if (!member.roles.cache.some(r => client.config.ticket.support_roles.includes(r.id))) {
            button.message.channel.send(`${button.clicker.user}, You cannot close tickets!.`).then(msg => msg.delete({ timeout: 7500 }))
        } else {
            const closefun = require('./function/transcript')
            closefun.transcript(button.message, config);
        }
    }

});

client.once('ready', () => {
    console.log(chalk.red `[MADE BY: ZeroTheDev#1295]` + chalk.white ` ${client.user.tag} is now online :)`)
})

client.on('message', (message) => {
    if (message.author.bot) return;
    if (message.guild == undefined) return;
    if (!message.content.startsWith(config.prefix)) return;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);
    const commandfile = client.commands.get(cmd.slice(config.prefix.length));
    if (commandfile) commandfile.run(client, message, args);
})

client.login(config.token).catch(e => {
    if (e) {
        console.log(chalk.redBright `[ERROR]` + chalk.white ` Your token is invaild within config\n${e}`)
        process.exit()
    }
})