const { MessageEmbed } = require('discord.js');

module.exports.run = async(client, message, args) => {
    await message.delete()
    let added = message.mentions.members.first() || message.guild.members.cache.get(args[0]);;
    if (!message.channel.name.startsWith(`ticket-`)) {
        message.channel.send(`You must be in a ticket to use this command`).then(message => message.delete({ timeout: 10000 }));
    } else {
        if (!args[0]) {
            message.channel.send(`Please make sure to mention someone`).then(message => message.delete({ timeout: 10000 }));
        } else {
            if (!added) {
                let args21 = args[0];
                message.channel.send(`I was unable to find the user \`${args21}\``).then(message => message.delete({ timeout: 10000 }));
            } else {
                if (added.id == message.author.id) {
                    let e3 = new MessageEmbed()
                        .setDescription(`You cannot add your self`)
                        .setColor(client.config.embed_color)
                    message.channel.send(e3).then(msg => msg.delete({ timeout: 7500 }));
                } else {
                    if (added.id == client.user.id) {
                        let e1 = new MessageEmbed()
                            .setDescription(`You cannot add ${client.user.tag}`)
                            .setFooter(`Action by ${message.author.tag}`)
                            .setColor(client.config.embed.color)
                        message.channel.send(e1).then(message => message.delete({ timeout: 7500 })).catch(console.error);
                    } else {
                        message.channel.updateOverwrite(added, {
                            VIEW_CHANNEL: true,
                            SEND_MESSAGES: true,
                            READ_MESSAGE_HISTORY: true,
                        });

                        const addembed = new MessageEmbed()
                            .setColor(client.config.embed.color)
                            .setDescription(`${message.author} has added ${added} into this ticket`);
                        message.channel.send(addembed).catch(console.error);
                    }
                }
            }
        }
    }
};
module.exports.help = {
    name: "add",
    description: "add someone to your ticket.",
    category: "Ticket",
    aliases: []
};