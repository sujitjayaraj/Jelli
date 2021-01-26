const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('../config.json');
const Database = require("./utility/database.js");
const fs = require('fs')
class Jelli {
    constructor(){
        this.bot = client;
        this.config = config;
        this.db = new Database();
        this.commands = this.loadCommands();
    }
    async launch(){
        this.loadEvents();
        console.log("All events have been loaded!");
        await this.db.connect();
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
        const categories = fs.readdirSync(__dirname + "/commands");
        const commands = new Discord.Collection();
        for(const category of categories){
            const commandFiles = fs.readdirSync(__dirname + `/commands/${category}`).filter(file => file.endsWith(".js"));
            for(const file of commandFiles){
                const command = require(`./commands/${category}/${file}`);
                commands.set(file.split(".")[0], command);
<<<<<<< HEAD
                command.category = category;
=======
>>>>>>> main
            }
        }
        console.log("All commands have been loaded");
        return commands;
    }
}
module.exports = Jelli;