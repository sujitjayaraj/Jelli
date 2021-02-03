module.exports = {
    name: "kick",
    description: "Kicks the `user` with the provided `reason`",
    usage: "-kick @user reason",

    async execute(app, msg, args){
        if(!msg.member.hasPermission("KICK_MEMBERS")) return;
        if(!msg.guild.me.hasPermission("KICK_MEMBERS")){
            msg.channel.send("⚠️ I do not have the `KICK_MEMBERS` permission, please check my role permissions and try again");
            return;
        }
        const guildMembers = await app.parser.getGuildMembers(msg, args.shift());
        if(guildMembers.length === 0){
            msg.channel.send(`**${app.config.reactions.cross} Invalid user provided. Please mention a valid user or enter their valid Discord ID**`);
            return;
        }
        const offender = guildMembers[0];
        const reason = args.length === 0? "No reason provided" : args.join(" ");
        if(!offender.kickable){
            msg.channel.send(`**${app.config.reactions.cross} Unable to kick ${offender.user.tag} as the user is equal or higher than me (the bot) in the role hierarchy**`);
            return;
        }
        if((msg.member.roles.highest.comparePositionTo(offender.roles.highest) <= 0) && (msg.author.id !== msg.guild.ownerID)){
            msg.channel.send(`**${app.config.reactions.cross} Unable to kick ${offender.user.tag} as the user is equal or higher than you in the role hierarchy**`);
            return;
        }
        try{
            await offender.send(`You have been kicked from the server **${msg.guild.name}** by moderator **${msg.author.tag}** with reason: **${reason}**`);
        }
        catch(error){
            msg.channel.send(`**⚠️ Unable to DM ${offender.user.tag} due to the offender's DM settings**`);
            app.sentry.captureException(error);
        }
        try{
            args.length === 0? await offender.kick() : await offender.kick(reason);
            app.logger.postModLog(msg, offender.user, "kick", reason);
            msg.channel.send({embed:{
                description: `**${app.config.reactions.tick}${offender.user.tag} has been kicked** | ${reason}`,
                color: 0xff0000
            }});
            app.db.addModLog(msg, offender, "kick", args.slice(1).join(" "));
        }
        catch(error){
            msg.channel.send(`**${app.config.reactions.cross} An error occurred while kicking the user. Please try again**`);
            app.sentry.captureException(error);
        }
    }
}