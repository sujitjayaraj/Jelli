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
            msg.channel.send(`**${app.config.reactions.cross} I do not have the \`MANAGE_ROLES\` permission. Please check my role permissions and try again**`);
            return;
        }
        const guildMembers = await app.parser.getGuildMembers(msg, args.shift());
        const roleNames = args.join(" ").split(",").map(x => x.trim());
        if(guildMembers.length == 0){
            msg.channel.send(`**${app.config.reactions.cross} Invalid user provided. Please mention a valid user or enter their valid Discord ID**`);
            return;
        }
        target = guildMembers[0];
        roles = roleNames.map(roleName => {
            let role = msg.guild.roles.cache.find(x => x.name === roleName);
            if(role === undefined) msg.channel.send(`${app.config.reactions.cross} Could not find the role ${roleName}`);
            if((msg.member.roles.highest.comparePositionTo(role) <= 0) && (msg.author.id !== msg.guild.ownerID)){
                msg.channel.send(`**⚠️ Unable to add the role ${role.name} as the role is equal or higher than you in the role hierarchy**`);
                role = undefined;
            }
            return role;
        });
        roles = roles.filter(role => role!==undefined);
        try{
            await target.roles.add(roles);
            msg.channel.send(`**${app.config.reactions.tick} Successfully added ${roles.length} role(s) to ${target.user.tag}**`);
        }
        catch(error){
            msg.react(app.config.reactions.cross);
            msg.channel.send(`**${app.config.reactions.cross} There was an error adding the roles, please check if my role is higher in the hierarchy than the roles being added**`);
            console.error(error);
        }
    }
}