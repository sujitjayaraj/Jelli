class Parser{
    /**
     * 
     * @param {*} msg Discord message object 
     * @param {String[]} args Array of args to find members from
     */
    async getGuildMembers(msg, args){
        let guildMembers = args.map(async (arg, i) => {
            if(/^<?@?!?(\d+)>?$/.test(arg)){
                const userId = arg.match(/^<?@?!?(\d+)>?$/)[1];
                const member = msg.guild.members.fetch(userId);
                return member;
            }
            return undefined;
        })
        guildMembers.map(x => x!==undefined);
        return await Promise.all(guildMembers);
    }
    /**
     * 
     * @param {*} msg Discord message object
     * @param {String[]} args Array of args to find channels from
     */
    async getGuildChannels(msg, args){
        const guildChannels = args.map(async (arg, i) => {
            if(/^<?#?(\d+)>?$/.test(arg)){
                const channelID = arg.match(/^<?#?(\d+)>?$/)[1];
                const channel = msg.guild.channels.cache.find(x => x.id === channelID);
                return channel;
            }
            return undefined;
        })
        guildChannels.filter(x => x!==undefined);
        return await Promise.all(guildChannels);
    }
    async getIds(msg, args){
        let guildMembers = [];
        args.map(async (arg, i) => {
            if(/^<?@?!?(\d+)>?$/.test(arg)) guildMembers.push(arg.match(/^<?@?!?(\d+)>?$/)[1]);
        });
        return guildMembers;
    }
}
module.exports = Parser;