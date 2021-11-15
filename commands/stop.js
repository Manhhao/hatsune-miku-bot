const { SlashCommandBuilder } = require('@discordjs/builders');
const con = require('../other/debug.js');
const del = require('../other/delete.js');
const music = require('@koenie06/discord.js-music');
const embed = require('../other/embeds.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stoppt den Bot'),
    async execute(interaction) {

        const isConnected = await music.isConnected({interaction: interaction})

        if (isConnected){
            music.stop({interaction: interaction});
            del.delByAuthor('Spielt:',interaction.channel,20);
            await interaction.reply({embeds : [embed.forcedstop(interaction)]});
        } else {
            interaction.reply({embeds : [embed.embedError(`Der Bot befindet sich in keinem Voice Channel <@${interaction.member.id}>`)], ephemeral: true});
        }

    }
}