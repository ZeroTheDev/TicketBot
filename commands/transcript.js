const { MessageEmbed, MessageAttachment } = require('discord.js');
const config = require('../config.json');
const fun = require('../function/transcript');
module.exports.run = async(client, message, args) => {
    if (!message.channel.name.startsWith(`ticket-`)) {
        const channelerror = new MessageEmbed()
            .setDescription(`You are not in the correct channel!`)
            .setColor(client.config.embed.color)
        message.channel.send(channelerror).then(message => message.delete({ timeout: 7500 }))
    } else {
        await message.delete()
        let first = new MessageEmbed()
            .setColor('RED')
            .setDescription(`Saving File`)
        message.channel.send(first).then(async(f) => {
            let filepath = await fun.justtranscript(message, config);
            let done = new MessageEmbed()
                .setColor('GREEN')
                .setDescription(`Transcript Saved!`)
            f.edit({ embed: done })
            let atc = new MessageAttachment(`./src/ticket/transcript-${message.channel.id}.html`)
            await message.channel.send(atc);
        })
    }
}

module.exports.help = {
    name: "transcript",
    description: "transcripts a ticket",
    usage: "",
    category: "Ticket",
    aliases: []
};