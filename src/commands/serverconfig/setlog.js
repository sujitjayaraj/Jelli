module.exports = {
    name: "setlog",
    aliases: ["setlogs"],
    usage: "setlogs <#channel>",
    description: "Sets the server log channel where mod actions are logged.",

    async execute(app, msg, args){
        if(!msg.member.hasPermission("MANAGE_GUILD",{checkAdmin:true, checkOwner:true})) return;
        let guildChannel = await app.parser.getGuildChannels(msg, args);
        guildChannel = guildChannel.length != 0?guildChannel[0]:undefined;
        if(guildChannel!==undefined){
            try{
                await app.db.guilds.updateOne({"_id":msg.guild.id}, {$set:{"log_channel":guildChannel.id}});
                msg.react(app.config.reactions.tick);
                msg.channel.send(`Server log channel has been set to ${guildChannel}`);
            }
            catch (error){
                msg.react(app.config.reactions.cross);
                msg.channel.send("❌ An error has occured. The log channel could not be set!");
                console.error(error);
            }
        }
        else{
            msg.react(app.config.reactions.cross);
            msg.channel.send("❌ Unable to set log channel. Please enter a valid channel!");
        }
    }
}