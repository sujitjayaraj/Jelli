module.exports = {
    name: "kick",
    description: "Kicks the `user` with the provided `reason`",
    usage: "-kick @user reason",

    async execute(app, msg, args){
        if(!msg.member.hasPermission("KICK_MEMBERS")){
            msg.reply("You do not have the permission to use the command.");
            return;
        }
        if(!msg.guild.me.hasPermission("KICK_MEMBERS")){
            msg.reply("I do not have the `KICK_MEMBERS` permission, please check my permissions and try again.");
            return;
        }
        const guildMembers = await app.parser.getGuildMembers(msg, args);
        const offender = guildMembers.length != 0?guildMembers[0]:undefined
        if(offender !== undefined){
            let reason = args.slice(1).join(" ");
            reason = reason.length == 0? "No reason provided" : reason;
            if(!offender.kickable){
                msg.channel.send(`❌ Unable to kick **${offender.user.tag} as the user is higher in the role hierarchy!`);
                return;
            }
            try{
                await offender.send(`You have been kicked from the server **${msg.guild.name}** by moderator **${msg.author.tag}** with reason: **${reason}**`);
            }
            catch(error){
                msg.channel.send("⚠️ Unable to DM the offender due to the offender's DM settings.");
            }
            try{
                await offender.kick(reason);
                msg.channel.send({embed:{
                    description: `**${offender.user.tag} has been kicked** | ${reason}`,
                    color: 0xff0000
                }});
                app.db.addModLog(msg, offender, "kick", args.slice(1).join(" "));
            }
            catch(error){
                msg.channel.send(`❌ Unable to kick **${offender.user.tag}**. Please check my role permissions!`);
            }
        }
        else{
            msg.channel.send(`❌ Unable to kick the provided user. Please enter user ID or mention!`);
        }
    }
}