class Parser{
    /**
     * 
     * @param {*} msg Discord message object 
     * @param {String} content The string to find guild members from
     * @returns {Promise<GuildMember[]>} A promise that resolve into an array of guildMembers
     */
    getGuildMembers(msg, content){
        const args = content.split(" ");
        let guildMembers = args.map((arg, i) => {
            if(/^<?@?!?(\d+)>?$/.test(arg)){
                const userId = arg.match(/^<?@?!?(\d+)>?$/)[1];
                const member = msg.guild.members.fetch(userId);
                return member;
            }
            return undefined;
        })
        guildMembers = guildMembers.filter(x => x!==undefined);
        return Promise.all(guildMembers);
    }
    /**
     * 
     * @param {*} msg Discord message object
     * @param {String} content The string to find Discord GuildChannel objects from
     * @returns {*} An array of iscord GuildChannel objects
     */
    getGuildChannels(msg, content){
        const args = content.split(" ");
        let guildChannels = args.map((arg, i) => {
            if(/^<?#?(\d+)>?$/.test(arg)){
                const channelID = arg.match(/^<?#?(\d+)>?$/)[1];
                const channel = msg.guild.channels.cache.find(x => x.id === channelID);
                return channel;
            }
            return undefined;
        })
        guildChannels = guildChannels.filter(x => x!==undefined);
        return guildChannels;
    }
    /**
     * 
     * @param {*} msg Discord message object
     * @param {String} content The string to find User IDs from
     * @returns {String[]} An array of User IDs which may not be valid
     */
    getIds(msg, content){
        const args = content.split(" ");
        let ids = args.map((arg, i) => {
            if(/^<?@?!?(\d+)>?$/.test(arg)) return arg.match(/^<?@?!?(\d+)>?$/)[1];
            return undefined;
        });
        ids = ids.filter(x => x!== undefined);
        return ids;
    }
}
module.exports = Parser;