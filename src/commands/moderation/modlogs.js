const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "modlogs",
    aliases: ["modlog", "log", "logs"],
    usage: "-modlogs @user",

    async execute(app, msg, args){
        if(!msg.member.hasPermission(["KICK_MEMBERS", "BAN_MEMBERS"], {
            checkAdmin: true,
            checkOwner: true
        })){
            msg.reply("You do not have the permission to use the command.");
            return;
        }
        const guildMembers = await app.parser.getGuildMembers(msg, args);
        const offender = guildMembers.length != 0?guildMembers[0]:undefined
        if(offender !== undefined){
            let embed = new MessageEmbed();
            let modlogs = await app.db.getModLogs(msg, offender);
            modlogs.forEach((log, i) => {
                embed.addField(`Case ${i}`, `\`\`\`Name:${log.offender_name}\nAction:${log.action}\nReason:${log.reason}\nModerator:${log.moderator_name}\`\`\``);
            });
            embed.setTimestamp(Date.now());
            embed.setAuthor(msg.author.tag, msg.author.avatarURL({dynamic:true}));
            msg.channel.send({embed:embed});
        }
    }
}