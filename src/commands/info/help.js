const {MessageEmbed} = require('discord.js');
module.exports = {
    name: "help",
    aliases: ["halp"],
    usage: "help <command>",
    description: "Provides help with the usage and syntax of the specified command",

    async execute(app, msg, args){
        let embed = new MessageEmbed();
        embed.setColor("#00ff00");
        embed.setFooter(`The server prefix is ${(await app.db.getGuildInfo(msg.guild.id)).prefix}`);
        if(!args.length == 0){
            const commandName = args.join(" ");
            const command = app.commands.get(commandName) || app.commands.find(cmd => cmd.aliases && cmd.aliases[0].length && cmd.aliases.includes(commandName));
            if(!command){
                msg.react(app.config.reactions.cross);
                msg.channel.send(`❌ Sorry ${msg.author}, this is an invalid command`);
                return;
            }
            embed.setTitle(`**Help for command ${command.name}**`);
            embed.setAuthor(msg.author.tag, msg.author.avatarURL({dynamic:true}));
            embed.setTimestamp(Date.now());
            embed.addFields([
                {name: "__Aliases__", value: command.aliases?command.aliases.join(", "):"N/A"},
                {name: "__Usage__", value: command.usage?command.usage:"N/A"},
                {name: "__description__", value: command.description?command.description:"N/A"}
            ]);
            msg.react(app.config.reactions.tick);
            msg.channel.send({embed: embed});
        }
        else{
            let commandList = [];
            app.commands.forEach((command) => commandList.push(command.name));
            embed.setTitle("**Help for the Jelli Bot**");
            embed.setDescription(`These are the commands currently available on the bot\n\`\`\`${commandList.join(", ")}\`\`\``);
            try{
                await msg.member.send({embed: embed});
                msg.react(app.config.reactions.tick);
                msg.channel.send(`Hey ${msg.member}, I have sent you a list of available commands!`);
            }
            catch(error){
                msg.channel.send(`❌ Hey ${msg.member}, There was an error in sending you a DM. Please check your DM settings and try again!`);
                msg.react(app.config.reactions.cross);
            }
        }
    }
}