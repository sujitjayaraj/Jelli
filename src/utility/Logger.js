const {MessageEmbed} = require('discord.js')
class Logger{
    constructor(app){
        this.app = app;
    }
    async postModLog(msg, offender, action, reason){
        let logChannel = (await this.app.db.guilds.findOne({"_id":msg.guild.id})).log_channel;
        if(!logChannel) return;
        logChannel = await msg.guild.channels.cache.find(x => x.id === logChannel);
        if(!logChannel){
            msg.channel.send("⚠️ Previously set mod logs channel has been deleted");
            await app.db.guilds.updateOne({"_id":msg.guild.id}, {$set:{"log_channel":null}});
        }
        let embed = new MessageEmbed();
        embed.setColor("#ff0000");
        embed.setAuthor(msg.author.tag, msg.author.avatarURL({dynamic:true}));
        embed.setTimestamp(Date.now());
        embed.addFields([
            {name: "__Action__", value: action},
            {name: "__offender__", value: offender.tag},
            {name: "__Reason__", value: reason},
            {name: "__Moderator__", value: msg.author.id}
        ]);
        try{
            await logChannel.send({embed: embed});
        }
        catch(error){
            console.error(error);
        }
    }
}
module.exports = Logger;