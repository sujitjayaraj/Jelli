module.exports = async (app, guild) => {
    console.log(`Added bot in ${guild.name} (${guild.id})`);
    await app.db.addGuild(guild);
}