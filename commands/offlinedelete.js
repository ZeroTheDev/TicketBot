const { MessageEmbed } = require('discord.js');


module.exports.run = async(client, message, args) => {
    message.delete()
    if (!message.member.roles.cache.some(r => client.config.ticket.support_roles.includes(r.id))) {
        let e1 = new MessageEmbed()
            .setDescription(`You cannot use this command`)
            .setColor(client.config.embed.color)
            .setFooter(client.config.embed.footer)
        message.channel.send(e1).then(msg => msg.delete({ timeout: 10000 }));
    } else {
        let msg = args[0];
        if (!msg) {
            let e1 = new MessageEmbed()
                .setDescription(`Please input a channel id`)
                .setColor(client.config.embed.color)
            message.channel.send(e1)
        } else {
            connection.query(`SELECT * FROM open_tickets WHERE channel = '${msg}'`, (err, reslove) => {
                if (reslove[0] == undefined) {
                    let e2 = new MessageEmbed()
                        .setDescription(`No tickets were found with that ID`)
                        .setColor(client.config.embed.color)
                    message.channel.send(e2)
                } else {
                    connection.query(`DELETE FROM open_tickets WHERE channel = '${msg}'`)
                    let e3 = new MessageEmbed()
                        .setDescription(`I have deleted the channel id that matches \`${msg}\``)
                        .setColor(client.config.embed.color)
                    message.channel.send(e3)
                }
            })
        }
    }
}

module.exports.help = {
    name: "offlinedelete",
    category: "Ticket",
    aliases: [],
    description: "offlines delete a channel from the database"
}