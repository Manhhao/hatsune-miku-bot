const con = require('../other/debug.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!(interaction.isCommand()||interaction.isButton()))
            return;

        let cmdTag;
        if (interaction.isButton()){
            cmdTag = interaction.customId;
            if (cmdTag === "pause"){
                con.debug("Special behaviour goes here");
                await interaction.reply('heeeheee');
                return;
            }
        } else {
            cmdTag = interaction.commandName;
        }

        con.low(`${interaction.user.tag} executed /${cmdTag} @${interaction.guild.id}`);
        const command = interaction.client.commands.get(cmdTag);
        if (!command) return;
        try {
            await command.execute(interaction);
        } catch (error) {
            con.error(`${interaction.user.tag} tried executing /${cmdTag}, but it failed!`);
            await interaction.reply({content: 'There was an error!', ephemeral: true});
        }
    },
};
