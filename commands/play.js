const { SlashCommandBuilder } = require('@discordjs/builders');
const con = require('../other/debug.js');
const music = require('@koenie06/discord.js-music');
const embed = require('../other/embeds.js');
const print = require('../other/printObjects.js');
const { appid } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Spielt einen Song anhand Titel oder URL')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('URL/Titel des Songs')
                .setRequired(true)),
    async execute(interaction) {

        const song = interaction.options.getString('song');

        if (interaction.member.voice.channelId === null){
            await interaction.reply({embeds: [embed.embedError(`Du bist nicht in einem Voice Channel!`, interaction)], ephemeral : true})
            return;
        }

        interaction.deferReply({ ephemeral: true });

        await music.play({
            interaction: interaction,
            channel: interaction.member.voice.channel,
            song: song
        })

        interaction.editReply({embeds: [embed.checkmark(interaction)], ephemeral : true} );
    }
}