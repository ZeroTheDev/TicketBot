const { MessageEmbed } = require('discord.js');
module.exports.run = async(client, message, args) => {
    await message.delete();
    if (!message.channel.name.startsWith('ticket-')) {
        let e1 = new MessageEmbed()
            .setDescription(`You can only use this command in tickets!`)
            .setColor(client.config.embed.color)
            .setFooter(client.config.embed.footer)
        message.channel.send(e1).then(msg => msg.delete({ timeout: 10000 }))
    } else {
        if (!message.member.roles.cache.some(r => client.config.ticket.support_roles.includes(r.id))) {
            let e1 = new MessageEmbed()
                .setDescription(`You cannot use this command`)
                .setColor(client.config.embed.color)
                .setFooter(client.config.embed.footer)
            message.channel.send(e1).then(msg => msg.delete({ timeout: 10000 }));
        } else {
            let added = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!args[0]) {
                const argserror = new MessageEmbed()
                    .setDescription(`You must mention someone!`)
                    .setThumbnail(message.author.displayAvatarURL({ format: `png` }))
                    .setColor(client.config.embed.color)
                    .setTimestamp()
                    .setFooter(client.config.embed.footer)
                message.channel.send(argserror).then(message => message.delete({ timeout: 5000 })).catch(console.error);
            } else {
                if (!added) {
                    let args21 = args[0];
                    const failedtofind = new MessageEmbed()
                        .setDescription(`I was unable to find the user \`${args21}\``)
                        .setThumbnail(message.author.displayAvatarURL({ format: `png` }))
                        .setColor(client.config.embed.color)
                        .setTimestamp()
                        .setFooter(client.config.embed.footer)
                    message.channel.send(failedtofind).then(message => message.delete({ timeout: 8500 })).catch(console.error);
                } else {
                    if (added.id === message.author.id) {
                        let dude = new MessageEmbed()
                            .setDescription(`You cannot remove your self`)
                            .setColor(client.config.embed.color)
                            .setTimestamp()
                            .setFooter(client.config.embed.footer)
                        message.channel.send(dude).then(message => message.delete({ timeout: 8500 })).catch(console.error);
                    } else {
                        message.channel.updateOverwrite(added, {
                            VIEW_CHANNEL: false,
                            SEND_MESSAGES: false,
                            READ_MESSAGE_HISTORY: false,
                        });

                        const addembed = new MessageEmbed()
                            .setColor(client.config.embed.color)
                            .setDescription(`${message.author} has removed ${added} from this ticket`);
                        message.channel.send(addembed).catch(console.error);
                    }
                }
            }
        }
    }
}
module.exports.help = {
    name: "remove",
    description: "removes a user from the ticket",
    category: "Ticket",
    aliases: [],

};