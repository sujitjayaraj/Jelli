const { MongoClient } = require("mongodb")
const {database:dbconfig} = require("../../config.json")
class Database{
    constructor(){
        this.client = new MongoClient(`mongodb+srv://${dbconfig.user}:${dbconfig.password}@jelli.9bira.mongodb.net/${dbconfig.name}?retryWrites=true&w=majority`,{useUnifiedTopology:true});
    }
    async connect() {
        await this.client.connect();
        console.log("Successfully connected to the database");
        this.modlogs = this.client.db("Jelli").collection("modlogs");
        this.guilds = this.client.db("Jelli").collection("guilds");
    }
    /**
     * 
     * @param {*} msg Discord message object
     * @param {*} offender Discord guildMember object of the offender
     * @param {String} action The action taken against the offender
     * @param {String} reason The reason for the moderation action carried out
     */
    addModLog(msg, offender, action, reason){
        try{
            this.modlogs.insertOne({"offender_id":offender.id, "offender_name":offender.user.tag, "action":action, "reason":reason, "timestamp":msg.createdTimestamp, "moderator_id":msg.author.id, "moderator_name":msg.author.tag, "guild_id":msg.guild.id});
        }
        catch(error){
            this.connect();
            this.modlogs.insertOne({"offender_id":offender.id, "offender_name":offender.user.tag, "action":action, "reason":reason, "timestamp":msg.createdTimestamp, "moderator_id":msg.author.id, "moderator_name":msg.author.tag, "guild_id":msg.guild.id});
        }
    }
    /**
     * 
     * @param {*} msg Discord message object
     * @param {*} offender Discord guildMember object of the offender
     */
    async getModLogs(msg, offender){
        let modlogs = [];
        var myCursor
        try{
            myCursor = await this.modlogs.find({"offender_id":offender.id, "guild_id":msg.guild.id})
            modlogs = await myCursor.toArray();
        }
        catch(error){
            this.connect();
            myCursor = await this.modlogs.find({"offender_id":offender.id, "guild_id":msg.guild.id})
            modlogs = await myCursor.toArray();
        }
        return modlogs;
    }
    /**
     * 
     * @param {String} guildID The ID of the Discord guild
     */
    async getGuildInfo(guildID){
        let result;
        try{
            result = await this.guilds.findOne({"_id":guildID});
            return result;
        }
        catch(error){
            await this.connect();
            result = await this.guilds.findOne({"_id":guildID});
            return result;
        }
    }
}
module.exports = Database;