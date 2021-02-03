module.exports = async (app, guild) => {
    try{
        app.db.guilds.updateOne({"_id":guild.id},{$set:{"_id":guild.id, "name":guild.name, "prefix":"-", "log_channel":""}}, {upsert:true});
    }
    catch(error){
        app.db.connect();
        app.db.guilds.updateOne({"_id":guild.id},{$set:{"_id":guild.id, "name":guild.name, "prefix":"-", "log_channel":""}}, {upsert:true});
    }
    console.log(`Added bot in ${guild.name} (${guild.id})`);
}