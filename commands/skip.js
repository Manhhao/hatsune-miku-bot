const { SlashCommandBuilder } = require('@discordjs/builders');
const embed = require('../other/embeds.js');
const music = require('@koenie06/discord.js-music');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Überspringt das jetzige Lied'),
    async execute(interaction) {

        const connected = await music.isConnected({interaction: interaction});
        if (!connected){
            await interaction.reply({embeds : [embed.wrongUsage(`Der Bot befindet sich in keinem Voice Channel <@${interaction.member.id}>`)], ephemeral : true});
            return;
        }

        await music.skip({interaction : interaction});

        await interaction.reply({embeds: [embed.embedMessage("Überspringe den jetzigen Song")]});
    }
}