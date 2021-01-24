const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('../config.json');
const fs = require('fs')
class Jelli {
    constructor(){
        this.bot = client;
        this.config = config;
        this.commands = this.loadCommands();
    }
    launch(){
        this.loadEvents();
        console.log("The bot has been launched!");
        this.bot.login(config.token);
    }
    loadEvents(){
        const eventFiles = fs.readdirSync(__dirname + "/events");
        for(const file of eventFiles){
            const event = require(`./events/${file}`);
            this.bot.on(file.split(".")[0], event.bind(null, this));
            delete require.cache[require.resolve(`./events/${file}`)];
        }
        console.log(`Loaded all event files!`);
    }
    loadCommands(){
        const commandFiles = fs.readdirSync(__dirname + "/commands");
        const commands = new Discord.Collection();
        for(const file of commandFiles){
            const command = require(`./commands/${file}`);
            commands.set(file.split(".")[0], command);
        }
        console.log("All commands have been loaded");
        return commands;
    }
}
module.exports = Jelli;