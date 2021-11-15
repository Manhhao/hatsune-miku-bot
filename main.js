//run this to start the bot
const fs = require('fs');
const con = require('./other/debug.js');
const del = require('./other/delete.js');
const embed = require('./other/embeds.js');
const { Client, Collection, Intents, MessageActionRow } = require('discord.js');
const { token } = require('./config.json');

//STARTING BOT
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES] });

//COMMAND & DISCORD-EVENT HANDLING
client.commands = new Collection();
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
   const command = require(`./commands/${file}`);
   client.commands.set(command.data.name, command);
}
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
   const event = require(`./events/${file}`);
   if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
   } else {
      client.on(event.name, (...args) => event.execute(...args));
   }
}

// MUSIC-BOT EVENTS

const music = require('@koenie06/discord.js-music');
const events = music.event;

events.on('playSong', async (channel, songInfo, requester) => {
   con.log(`Playing ${songInfo.title} now`);
   del.delByAuthor('Spielt:',channel,20);
   del.delByAuthor('Zur Queue hinzugefügt:',channel,20,songInfo.title);
   await channel.send({embeds : [embed.playstatus(channel,songInfo,requester)]});
});

events.on('addSong', async (channel, songInfo, requester) => {
   con.log(`Added ${songInfo.title} to queue`);
   channel.send({embeds: [embed.songadded(songInfo,requester)]});
});

events.on('finish', async (channel) => {
   del.delByAuthor('Spielt:',channel,20);
   con.log(`Finished playing`);
});

//BOT LOGIN (END OF FILE)
client.login(token);