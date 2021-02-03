module.exports = {
    name: "unban",
    description: "Unbans the `user` with the provided `reason`",
    usage: "-unban @user reason",

    async execute(app, msg, args){
        if(!msg.member.hasPermission("BAN_MEMBERS")) return;
        if(!msg.guild.me.hasPermission("BAN_MEMBERS")){
            msg.react(app.config.reactions.cross);
            msg.channel.send("❌ I do not have the `BAN_MEMBERS` permission, please check my `BAN_MEMBERS` role permission and try again!");
            return;
        }
        const guildMembers = await app.parser.getIds(msg, args.shift());
        if(guildMembers.length == 0){
            msg.channel.send(`**${app.config.reactions.cross} Invalid user provided. Please mention a valid user or enter their valid Discord ID**`);
            return;
        }
        const offenderID = guildMembers[0];
        let reason = args.slice(1).join(" ");
        reason = reason.length == 0? "No reason provided" : reason;
        try{
            offender = await msg.guild.members.unban(offenderID, reason);
            msg.react(app.config.reactions.tick);
            msg.channel.send({embed:{
                description: `**${offender.tag} has been unbanned** | ${reason}`,
                color: 0x00ff00
            }});
            app.db.modlogs.insertOne({"offender_id":offender.id, "offender_name":offender.tag, "action":"unban", "reason":reason, "timestamp":msg.createdTimestamp, "moderator_id":msg.author.id, "moderator_name":msg.author.tag, "guild_id":msg.guild.id});
        }
        catch(error){
            msg.react(app.config.reactions.cross);
            msg.channel.send(`❌ Unable to unban the provided user. Please enter a valid user ID or mention!`);
        }
    }
}