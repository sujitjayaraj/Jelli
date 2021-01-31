module.exports = {
    name: "roleadd",
    usage: "roleadd @user <roles>",
    description: "Adds the given set of roles to the mentioned user",
    aliases: ["role", "radd", "ra"],

    async execute(app, msg, args){
        if(!msg.member.hasPermission("MANAGE_ROLES", {
            checkAdmin: true,
            checkOwner: true
        })) return;
        if(!msg.guild.me.hasPermission("MANAGE_ROLES")){
            msg.react(app.config.reactions.cross);
            msg.channel.send("❌ I do not have the `MANAGE_ROLES` permission. Please check my role permissions and try again!");
            return;
        }
        const guildMembers = await app.parser.getGuildMembers(msg, args);
        const roleNames = args.slice(1).join(" ").split(",").map(x => x.trim());
        const target = guildMembers.length != 0?guildMembers[0]:undefined
        if(target !== undefined){
            roles = roleNames.map(roleName => {
                const role = msg.guild.roles.cache.find(x => x.name === roleName);
                if(role === undefined) msg.channel.send(`⚠️ Could not find the role ${roleName}`);
                return role;
            });
            roles = roles.filter(role => role!==undefined);
            try{
                await target.roles.add(roles);
                msg.react(app.config.reactions.tick);
                msg.channel.send(`${app.config.reactions.tick} Successfully added ${roles.length} role(s) to ${target.user.tag}`);
            }
            catch(error){
                msg.react(app.config.reactions.cross);
                msg.channel.send("❌ There was an error adding the roles, please check if my role is higher in the hierarchy than the roles being added!");
                console.error(error);
            }
        }
        else{
            msg.react(app.config.reactions.cross);
            msg.channel.send("❌ Please mention a valid user or enter a valid user ID");
        }
    }
}