const config = require('../config.json');
const { MessageEmbed } = require('discord.js');


module.exports.run = async(client, message, args) => {
    let e1 = new MessageEmbed()
        .setFooter(`Made by Zero Development`)
        .setTitle(`Help menu for ${client.user.username}`)
        .setColor(config.embed.color)
        .addField(`${config.prefix}add`, `Adds a user to the ticket`)
        .addField(`${config.prefix}close`, `Closes a ticket`)
        .addField(`${config.prefix}create`, `Sends the ticket panel`)
        .addField(`${config.prefix}offlinedelete`, `Removes a ticket from the database`)
        .addField(`${config.prefix}opentickets`, `Shows all the open tickets`)
        .addField(`${config.prefix}remove`, `Removes a user from the ticket`)
        .addField(`${config.prefix}rename`, `Renames a ticket`)
        .addField(`${config.prefix}transcript`, `Transcripts the ticket`)
    message.channel.send(e1)
}

module.exports.help = {
    name: "help",
    description: "Help command",
    category: "Ticket",
    aliases: []
};