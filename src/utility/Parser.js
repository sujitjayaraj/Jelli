class Parser{
    /**
     * 
     * @param {*} msg Discord message object 
     * @param {String[]} args Array of args to find members from
     */
    async getGuildMembers(msg, args){
        let guildMembers = [];
        args.map(async (arg, i) => {
            if(/^<?@?!?(\d+)>?$/.test(arg)){
                const userId = arg.match(/^<?@?!?(\d+)>?$/)[1];
                const member =await msg.guild.members.fetch(userId);
                guildMembers.push(member);
            }
        })
        return guildMembers;
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