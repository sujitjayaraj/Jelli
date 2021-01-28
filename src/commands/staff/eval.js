module.exports = {
	name: 'eval',
	aliases: ['do', 'run'],

	async execute(app, msg, args) {
		if(msg.author.id != "365080146618875906") return;
		const commandInput = args.join(" ");

		try {
			const start = new Date().getTime()
			let evaled = await eval(commandInput)
			const end = new Date().getTime()

			if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)

			const segments = evaled.match(/[\s\S]{1,1500}/g)
            msg.delete();
			if (segments.length === 1) {
                msg.channel.send({embed:{
                    description: `\`\`\`js\n${segments[0]}\`\`\``,
                    color: 0x8e00ff,
                    footer:{
                        text: `Time taken: ${end - start}ms`
                    },
                    author: {
                        name: msg.author.tag,
                        icon_url: msg.author.displayAvatarURL({dynamic : true})
                    }
                }
                });
			}
			else {
				for (let i = 0; i < (segments.length < 5 ? segments.length : 5); i++) {
					await msg.channel.send(`\`\`\`js\n${segments[i]}\`\`\``);
				}
			}
		}
		catch (err) {
            msg.channel.send({embed:{
                title: 'Something went wrong',
                description: `\`\`\`js\n${err}\`\`\``,
                color: 0xc68958,
            }
            });
		}
	}
}