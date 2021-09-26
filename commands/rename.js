const { MessageEmbed } = require('discord.js');

module.exports.run = async(client, message, args) => {
    if (!message.member.roles.cache.some(r => client.config.ticket.support_roles.includes(r.id))) {
        let e1 = new MessageEmbed()
            .setDescription(`You cannot use this command`)
            .setColor(client.config.embed.color)
            .setFooter(client.config.embed.footer)
        message.channel.send(e1).then(msg => msg.delete({ timeout: 10000 }));
    } else {
        if (!message.channel.name.toLowerCase().startsWith(`ticket-`)) {
            let e1 = new MessageEmbed()
                .setDescription(`You must be in a ticket channel to change name`)
                .setColor(client.config.embed.color)
            message.channel.send(e1)
        } else {
            let name = args.join(` `);
            if (!name) {
                let e2 = new MessageEmbed()
                    .setDescription(`Please make sure to put a name.`)
                    .setColor(client.config.embed.color)
                message.channel.send(e2)
            } else {
                if (name.length > 12) {
                    let e3 = new MessageEmbed()
                        .setDescription(`Channel name cannot be longer then 12 chars`)
                        .setColor(client.config.embed.color)
                    message.channel.send(e3)
                } else {
                    message.channel.setName(`ticket-${name}`)
                    let e4 = new MessageEmbed()
                        .setDescription(`Channel name has been set \`ticket-${name}\``)
                        .setColor(client.config.embed.color)
                    message.channel.send(e4)
                }
            }
        }
    }
}

module.exports.help = {
    name: "rename",
    category: "Ticket",
    aliases: [],
    description: "Renames a channel"
}