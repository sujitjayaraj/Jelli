class Parser{
    /**
     * 
     * @param {*} msg Discord message object 
     * @param {String[]} args Array of args to find members from
     */
    getGuildMembers(msg, args){
        const guildMembers = args.map((arg, i) => {
            if(/^<?@?!?(\d+)>?$/.test(arg)){
                const userId = arg.match(/^<?@?!?(\d+)>?$/)[1];
                const member = message.channel.guild.members.find(m => m.id === userId)
                return member;
            }
            return undefined;
        })
        return guildMembers.filter(x => x!== undefined);
    }
}