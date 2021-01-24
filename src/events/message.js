const {prefix} = require("../../config.json");
module.exports = async(app, msg) => {
    if(msg.author.bot) return;
    if(!msg.content.toLowerCase().startsWith(prefix)) return; //Message does not start with bot prefix
    const args = msg.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    let command = app.commands.get(commandName) || app.commands.find(cmd => cmd.aliases && cmd.aliases[0].length && cmd.aliases.includes(commandName));
    if(!command){ //Check if command exists
        msg.reply("Sorry this command is not available!");
        return;
    }
    command.execute(app, msg, args);
}