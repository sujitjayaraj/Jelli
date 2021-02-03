const { execute } = require("./profile");

const {MessageEmbed} = require('discord.js');
module.exports = {
    name: "avatar",
    aliases: ["pfp", "pic"],
    description: "Returns the avatar image of the provided user or the avatar of the user who invoked this command",
    usage: "avatar @user",

    async execute(app, msg, args){
        let target = msg.member;
        if(args.length !==0){
            const guildMembers = await app.parser.getGuildMembers(msg, args.shift());
            if(guildMembers.length == 0){
                msg.channel.send(`**${app.config.reactions.cross} Invalid user provided. Please mention a valid user or enter their valid Discord ID**`);
                return;
            }
            target = guildMembers[0];
        }
        let embed = new MessageEmbed();
        embed.setTitle(`**${target.user.tag}'s** avatar`);
        embed.setColor(target.roles.highest.color);
        embed.setImage(target.user.avatarURL({dynamic:true}));
        embed.setFooter(`ID: ${target.id}`);
        embed.setTimestamp(msg.createdTimestamp);
        msg.channel.send({embed:embed});
    }
}