const { MessageEmbed } = require('discord.js');
const con = require('./debug.js');

function embedded_msg(msg){
    const message = new MessageEmbed()
	.setColor('#0099ff')
	.setDescription(msg)

    return message;
}; 

function embedded_msg_error(msg){
    const message = new MessageEmbed()
	.setColor('#dc143c')
	.setDescription(msg)

    return message;
}; 

function embedded_bold(msg){
    const message = new MessageEmbed()
	.setColor('#0099ff')
	.setTitle(msg)

    return message;
}; 

module.exports = {

    error : function(title,description=null){
        const embed = new MessageEmbed()
            .setColor('#FF004D')
            .setTitle(title)
            .setAuthor('⛔️ ERROR')
            .setFooter(`Something went wrong, but mainly because the bot is stupid. General information with /help`)
        if (description != null)
            embed.setDescription(description);
        con.error(`Error from Embed: ${title} - ${description}`);
        return embed;
    },

    wrongArgs : function(title,description=null){
        const embed = new MessageEmbed()
            .setColor('#FF004D')
            .setTitle(title)
            .setAuthor('⛔️ WRONG ARGUMENTS')
        if (description != null)
            embed.setDescription(description);
        con.log(`WrongArgs embed: ${title} - ${description}`);
        return embed;
    },

    embedError : function(reason){
        con.log(`embedError: ${reason}`);
        return embedded_msg_error(reason);
    },

    embedMessage : function(reason){
        con.log(`embedMsg: ${reason}`);
        return embedded_msg(reason);
    },

    wrongUsage : function(title,description=null){
        const embed = new MessageEmbed()
            .setColor('#dc143c')
            .setTitle(title)
        if (description != null)
            embed.setDescription(description);
        con.log(`WrongUsage embed: ${title} - ${description}`);
        return embed;
    },

    done : function(title,description = null){
        const embed = new MessageEmbed()
            .setColor('#00E436')
            .setTitle(title)
            .setAuthor('✅ SUCCESS')
        if (description != null)
            embed.setDescription(description);
        con.log(`Done embed: ${title} - ${description}`);
        return embed;
    },

    help : function(){
        return new MessageEmbed()
            .setColor('#29ADFF')
            .setAuthor('Cantina Band','https://cdn.discordapp.com/avatars/907619096013701120/c97a6defff1967febad71e3b149f94fa.png','https://github.com/n0j0games/discordBot')
            .setTitle('Welcome!')
            .setDescription('This bot can play music from many sources and other stuff. Click **LIST COMMANDS** for a command list or just start typing **/**')
            .setThumbnail('https://media1.giphy.com/media/3o84sK5cgfjdkPCEla/giphy.gif')
            .setFooter(`There is an issue with the musicbot: The bot may skips/stops randomly. This is caused to an update of nodejs and can't be fixed that easy. If you encounter any other issues you can report them via the 'Issues' tab in my github repository`
            ,'https://cdn0.iconfinder.com/data/icons/shift-free/32/Error-512.png');
    },

    commands : function(){
        return new MessageEmbed()
            .setColor('#29ADFF')
            .setTitle('Commands')
            .addField('/play [url/song-name]','playing music from an URL or via song search')
            .addField('/randomize [amount]','randomizes user in channel into [amount] teams')
    .addField('SOON: /vote [time] [option1] ... [option4]','create new vote with min. 2 and max. 4 options, which lasts [time] seconds');
    },

    playstatus : function(channel,songinfo,requester){
        return new MessageEmbed()
            .setColor('#0099ff')
            .setAuthor(`Spielt:`)
            .setTitle(songinfo.title)
            .setURL(songinfo.url)
            .setFooter(`${requester.username}`,`https://cdn.discordapp.com/avatars/${requester.id}/${requester.avatar}.png`)
    },

    songadded : function(songinfo,requester){
        return new MessageEmbed()
            .setColor('#0099ff')
            .setAuthor(`Zur Queue hinzugefügt:`)
            .setTitle(songinfo.title)
            .setURL(songinfo.url)
            .setFooter(`${requester.username}`,`https://cdn.discordapp.com/avatars/${requester.id}/${requester.avatar}.png`)
    },

    songsearch : function(song){
        return new MessageEmbed()
            .setColor('#FFCCAA')
            .setAuthor(`🔍 SONG SEARCH:`)
            .setTitle(`Searching for **${song}**`)
    },

    playfinished : function(){
        return new MessageEmbed()
            .setColor('#0099ff')
            .setAuthor(`Bot:`)
            .setTitle('Nothing left to play!')
            .setFooter(`Add news songs with /play [url/name]`)
    },

    skip : function(interaction){
        return new MessageEmbed()
            .setColor('#0099ff')
            .setAuthor(`Übersprungen:`)
            .setTitle(`${interaction.user.username} skipped!`)
    },

    forcedstop : function(interaction){
        return new MessageEmbed()
            .setColor('#FFEC27')
            .setAuthor(`Der Bot wurde gestoppt`)
            .setFooter(`${interaction.user.username}`,`https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png`)
    }
}