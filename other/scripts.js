const con = require('./debug.js');

module.exports = {
    getVoiceOfInteraction : function(interaction){
        const channels = interaction.guild.channels;
        for (const channel of channels.values())
        {
            con.debug(channel.id);
        }
    }
}