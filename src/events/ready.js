module.exports = (app) => {
    const activities = [`for the help command`, `${app.commands.size} commands`];
    let index = 0;
    setInterval(() => {
        app.bot.user.setActivity(activities[index++], {type: 'WATCHING'});
        index = index % activities.length;
    }, 30000);
    app.bot.user.setActivity("for the help command", {type: 'WATCHING'});
}