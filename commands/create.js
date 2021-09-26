const { MessageEmbed } = require('discord.js');
const { MessageButton } = require('discord-buttons');

module.exports.run = async(client, message, args) => {
    await message.delete()
    if (!message.member.roles.cache.some(r => client.config.ticket.support_roles.includes(r.id))) {
        let e1 = new MessageEmbed()
            .setDescription(`You cannot use this command`)
            .setColor(client.config.embed.color)
            .setFooter(client.config.embed.footer)
        message.channel.send(e1).then(msg => msg.delete({ timeout: 10000 }));
    } else {
        let desc = args.join(` `);
        if (!desc) {
            let e2 = new MessageEmbed()
                .setTimestamp()
                .setColor(client.config.embed.color)
                .setDescription(`Please ensure to provide a ticket message.`)
            message.channel.send(e2).then(msg => msg.delete({ timeout: 7500 }))
        } else {
            connection.query(`INSERT INTO ticket_settings (guild, channel, descr, button_id) VALUES ('${message.guild.id}', '${message.channel.id}', '${desc}', 'ticket-${message.channel.id}')`, (err, res) => {
                let e3 = new MessageEmbed()
                    .setTitle(`Ticket system | ${message.guild.name}`)
                    .setDescription(desc)
                    .setThumbnail(client.config.embed.logo)
                    .setColor(client.config.embed.color)
                    .setFooter(`${message.guild.name} Ticket system | ID: ${res.insertId}`)

                let button = new MessageButton()
                    .setLabel("React to create a ticket!")
                    .setStyle('blurple')
                    .setEmoji("🎫")
                    .setID(`ticket-${message.channel.id}`)
                message.channel.send({ embed: e3, button }).then(msg => {
                    connection.query(`UPDATE ticket_settings SET message_id = '${msg.id}' WHERE id = ${res.insertId}`)
                })
            })

        }
    }
}


module.exports.help = {
    name: "create",
    category: "Ticket",
    aliases: [],
    description: "sends the ticket panel"
}