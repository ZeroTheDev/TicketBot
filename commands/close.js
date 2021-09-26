const { MessageEmbed } = require('discord.js');
const fs = require('fs').promises;
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM();
const document = dom.window.document;
const config = require('../config.json')
const closefun = require('../function/transcript');
const { MessageButton, MessageActionRow } = require('discord-buttons');
module.exports.run = async(client, message, args) => {

    if (!message.channel.name.startsWith(`ticket-`)) {
        const channelerror = new MessageEmbed()
            .setDescription(`You are not in the correct channel!`)
            .setThumbnail(message.author.displayAvatarURL({ format: `png` }))
            .setColor(config.embed.color)
            .setTimestamp();
        message.channel.send(channelerror).then(message => message.delete({ timeout: 7500 })).catch(console.error);
    } else {
        if (!message.member.roles.cache.some(r => client.config.ticket.support_roles.includes(r.id))) {
            let e1 = new MessageEmbed()
                .setDescription(`You cannot use this command`)
                .setColor(client.config.embed.color)
                .setFooter(client.config.embed.footer)
            message.channel.send(e1).then(msg => msg.delete({ timeout: 10000 }));
        } else {
            let embed = new MessageEmbed()
                .setAuthor(`Request by ${message.author.username}`, message.author.avatarURL())
                .setColor(config.embed.color)
                .setDescription(`Would you like to close the ticket?`)
                .setTimestamp();

            let closebutton = new MessageButton()
                .setStyle('red')
                .setLabel(`Close`)
                .setEmoji('🔒')
                .setID(`close-${message.channel.id}`)

            let keepbutton = new MessageButton()
                .setStyle('grey')
                .setLabel(`Cancel`)
                .setID(`open-${message.channel.id}`)

            let row = new MessageActionRow()
                .addComponents(closebutton, keepbutton);

            message.channel.send({ embed: embed, components: row }).then(msg => {
                client.once('clickButton', async(button) => {
                    if (button.id == `close-${message.channel.id}`) {
                        closefun.transcript(message, config);
                    } else if (button.id == `open-${message.channel.id}`) {
                        let e5 = new MessageEmbed()
                            .setDescription(`Ticket system canceled`)
                            .setColor(config.embed.color)
                            .setFooter(`Action by ${message.author.tag}`)
                        msg.edit({ embed: e5 });
                    }

                })
            })
        }
    }
};

module.exports.help = {
    name: "close",
    description: "closes a ticket",
    usage: "",
    category: "Ticket",
    aliases: []
};