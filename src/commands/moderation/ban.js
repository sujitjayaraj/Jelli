module.exports = {
    name: "ban",
    description: "Bans the `user` with the provided `reason`",
    usage: "-ban @user reason",

    async execute(app, msg, args){
        if(!msg.member.hasPermission("BAN_MEMBERS")) return;
        if(!msg.guild.me.hasPermission("BAN_MEMBERS")){
            msg.react(app.config.reactions.cross);
            msg.channel.send("⚠️ I do not have the `BAN_MEMBERS` permission, please check my role permission and try again.");
            return;
        }
        const guildMembers = await app.parser.getGuildMembers(msg, args.shift());
        if(guildMembers.length === 0){
            msg.react(app.config.reactions.cross);
            msg.channel.send("❌ Invalid user provided. Please mention a valid user or enter their valid Discord ID.");
            return;
        }
        const offender = guildMembers[0];
        let reason = args.slice(1).join(" ");
        reason = args.length === 0? "No reason provided" : args.join(" ");
        if(!offender.bannable){
            msg.react(app.config.reactions.cross);
            msg.channel.send(`❌ Unable to ban **${offender.user.tag} as the user is higher in the role hierarchy!`);
            return;
        }
        if((msg.member.roles.highest.comparePositionTo(offender.roles.highest) <= 0) && (msg.author.id !== msg.guild.ownerID)){
            msg.channel.send(`**${app.config.reactions.cross} Unable to ban ${offender.user.tag} as the user is equal or higher than you in the role hierarchy**`);
            return;
        }
        try{
            await offender.send(`You have been banned from the server **${msg.guild.name}** by moderator **${msg.author.tag}** with reason: **${reason}**`);
        }
        catch(error){
            msg.channel.send("⚠️ Unable to DM the offender due to the offender's DM settings.");
        }
        try{
            await offender.ban({reason:reason});
            msg.channel.send({embed:{
                description: `**${offender.user.tag} has been banned** | ${reason}`,
                color: 0xff0000
            }});
            app.db.addModLog(msg, offender, "ban", args.slice(1).join(" "));
        }
        catch(error){
            msg.react(app.config.reactions.cross);
            msg.channel.send(`❌ Unable to ban **${offender.user.tag}**. An error has occured!`);
            console.error(error);
        }
    }
}