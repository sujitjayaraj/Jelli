module.exports = {
    name: "kick",
    description: "Kicks the `user` with the provided `reason`",
    usage: "-kick @user reason",

    execute(app, msg, args){
        if(!msg.member.hasPermission("KICK_MEMBERS")){
            msg.reply("You do not have the permission to use the command.");
            return;
        }
        if(!msg.guild.me.hasPermission("KICK_MEMBERS")){
            msg.reply("I do not have the `KICK_MEMBERS` permission, please check my permissions and try again.");
            return;
        }
    }
}