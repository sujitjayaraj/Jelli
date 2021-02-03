const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('../config.json');
const Parser = require('./utility/Parser.js');
const Database = require("./utility/database.js");
const fs = require('fs');
const Sentry = require('@sentry/node');
const Logger = require("./utility/Logger.js");
require('dotenv').config();
class Jelli {
    constructor(){
        this.bot = client;
        this.sentry = Sentry;
        this.config = config;
        this.parser = new Parser();
        this.logger = new Logger(this);
        this.db = new Database();
        this.commands = this.loadCommands();
    }
    async launch(){
        this.loadEvents();
        console.log("All events have been loaded!");
        this.sentry.init({
            dsn: process.env.SENTRYDSN,
            tracesSampleRate: 1.0,
        });
        console.log("Enabled Sentry error logging");
        await this.db.connect();
        console.log("The bot has been launched!");
        this.bot.login(process.env.TOKEN);
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
                command.category = category;
            }
        }
        console.log("All commands have been loaded");
        return commands;
    }
}
module.exports = Jelli;