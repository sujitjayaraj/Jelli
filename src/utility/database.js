const { MongoClient } = require("mongodb")
const {database:dbconfig} = require("../../config.json")
class Database{
    constructor(app){
        this.client = new MongoClient(`mongodb+srv://${dbconfig.user}:${dbconfig.password}@jelli.9bira.mongodb.net/${dbconfig.name}?retryWrites=true&w=majority`,{useUnifiedTopology:true});
        this.app = app;
    }
    async connect() {
        await this.client.connect();
        console.log("Successfully connected to the database");
        this.users = this.client.db("Jelli").collection("users");
        this.guilds = this.client.db("Jelli").collection("guilds");
    }
    async addGuild(guild){
        this.guilds.updateOne({"_id":guild.id},{$set:{"_id":guild.id, "name":guild.name, "prefix":"-"}}, {upsert:true});
        console.log(`New database record created for ${guild.name} (${guild.id})`);
    }
}
module.exports = Database;