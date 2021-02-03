const {MessageEmbed} = require('discord.js');
module.exports = {
    name: "profile",
    aliases: ["info", "whois", "who", "p"],
    description: "Provides information on the provided user or about the user who invoked the command if no user is given",
    usage: "profile @user",

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
        embed.setAuthor(target.user.tag, target.user.avatarURL({dynamic:true}));
        embed.setDescription(`${target}`);
        embed.addField("**Joined**", target.joinedAt.toString());
        embed.addField("**Registered**", target.user.createdAt.toString());
        const roles = Array.from(target.roles.cache.keys()).map(x => "<@&"+x+">");
        embed.addField(`**Roles [${roles.length}]**`, roles.join(", "));
        embed.addField("**Permissions**", target.permissions.toArray().map(x => "`"+x+"`").join(", "));
        embed.setColor(target.roles.highest.color);
        embed.setTimestamp(msg.createdTimestamp);
        embed.setFooter(`ID: ${target.id}`);
        msg.channel.send({embed:embed});
    }
}