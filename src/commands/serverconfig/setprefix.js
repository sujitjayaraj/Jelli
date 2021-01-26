module.exports = {
    name: "setprefix",
    description: "Changes the server prefix",

    async execute(app, msg, args){
        const newPrefix = args.join(" ");
        await app.db.guilds.updateOne({"_id":msg.guild.id},{$set:{"prefix":newPrefix}});
        msg.channel.send(`Server prefix successfully updated to **${newPrefix}**`);
    }
}