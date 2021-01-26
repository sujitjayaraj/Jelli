module.exports = {
    name: "ping",
    aliases: ["pong", "pang", "pong"],

    async execute(app, msg, args){
        msg.reply({embed: {
            title: "🏓Pong!",
            timestamp: (new Date(Date.now())).toISOString(),
            fields: [
                {
                    name: "Latency",
                    value: app.bot.ws.ping,
                    inline: true
                },
                {
                    name: "Uptime",
                    value: new Date(app.bot.uptime).toISOString().slice(11,19),
                    inline: true
                }
            ]
        }});
    }
}