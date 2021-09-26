const config = require('../config.json');
const { MessageEmbed } = require('discord.js');

module.exports.run = async(client, message, args) => {
    await message.delete()
    if (!message.member.roles.cache.some(r => client.config.ticket.support_roles.includes(r.id))) {
        let e1 = new MessageEmbed()
            .setDescription(`You cannot use this command`)
            .setColor(client.config.embed.color)
            .setFooter(client.config.embed.footer)
        message.channel.send(e1).then(msg => msg.delete({ timeout: 10000 }));
    } else {
        connection.query(`SELECT * FROM open_tickets`, (err, reslove) => {
            if (reslove[0] == undefined) {
                let e1 = new MessageEmbed()
                    .setDescription(`There are no tickets opended :(`)
                    .setColor(config.embed.color)
                message.channel.send(e1)
            } else {
                let e2 = new MessageEmbed()
                let num = 0;
                reslove.forEach(eachone => {
                    num++;
                    if (num > 25) return;
                    e2.addField(`User`, `${eachone.usertag} || \`${eachone.user}\``, true)
                    e2.addField(`Channel`, `<#${eachone.channel}> || \`${eachone.channel}\``, true)
                    e2.addField(`Date`, eachone.time_open, true)
                })
                e2.setTitle(`There are ${num} tickets open at the moment`)
                e2.setColor(config.embed.color)
                message.channel.send(e2)
            }
        })
    }
}
module.exports.help = {
    name: "opentickets",
    category: "Ticket",
    aliases: [],
    description: "checks all the open tickets"
}