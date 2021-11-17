const con = require('../other/debug.js');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        con.log("Initializing Bot");
        const guilds = client.guilds.cache.map(guild => `${guild.id} (${guild.name})`);
        client.user.setActivity(`DECO*27`, {type : "LISTENING"});
        con.log(`Active guilds: ${guilds}`);
        con.done(`Bot initialized as ${client.user.tag}`);
    },
};

