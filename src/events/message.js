module.exports = async(app, msg) => {
    if(msg.author.bot) return;
    const result = await app.db.guilds.findOne({"_id":msg.guild.id});
    let prefix = "-";
    if(result)
        prefix = result.prefix;
    else
        app.db.guilds.updateOne({"_id":guild.id},{$set:{"_id":guild.id, "name":guild.name, "prefix":"-", "log_channel":""}}, {upsert:true});
    if(!msg.content.toLowerCase().startsWith(prefix) || msg.content.length == 1) return; //Message does not start with bot prefix
    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    let command = app.commands.get(commandName) || app.commands.find(cmd => cmd.aliases && cmd.aliases[0].length && cmd.aliases.includes(commandName));
    if(!command){ //Check if command exists
        msg.reply("Sorry this command is not available!");
        return;
    }
    command.execute(app, msg, args);
}