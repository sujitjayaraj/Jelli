const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "modlogs",
    aliases: ["modlog", "log", "logs"],
    usage: "-modlogs @user",

    async execute(app, msg, args){
        if(!msg.member.hasPermission(["KICK_MEMBERS", "BAN_MEMBERS"])) return;
        const guildMembers = await app.parser.getIds(msg, args.shift());
        if(guildMembers.length == 0){
            msg.channel.send(`**${app.config.reactions.cross} Invalid user provided. Please mention a valid user or enter their valid Discord ID**`);
            return;
        }
        const offender = guildMembers[0];
        let embed = new MessageEmbed();
        let modlogs = await app.db.getModLogs(msg, {id:offender});
        if(modlogs.length == 0)
        {
            msg.channel.send("**No modlogs for that user**");
            return;
        }
        modlogs.forEach((log, i) => {
            embed.addField(`Case ${i}`, `\`\`\`Name:${log.offender_name}\nAction:${log.action}\nReason:${log.reason}\nModerator:${log.moderator_name}\`\`\``);
        });
        embed.setTimestamp(Date.now());
        embed.setAuthor(msg.author.tag, msg.author.avatarURL({dynamic:true}));
        msg.channel.send({embed:embed});
    }
}