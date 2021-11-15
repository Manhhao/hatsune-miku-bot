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
                .setDescription('URL/titel des songs')
                .setRequired(true)),
    async execute(interaction) {

        const song = interaction.options.getString('song');

        if (interaction.member.voice.channelId === null){
            await interaction.reply({embeds: [embed.embedError(`Du bist nicht in einem Voice Channel <@${interaction.member.id}>`)], ephemeral : true})
            return;
        }
        interaction.reply({embeds: [embed.embedMessage("Sucht nach: " + song)], ephemeral : true} );
        music.play({
            interaction: interaction,
            channel: interaction.member.voice.channel,
            song: song
        })
    }
}