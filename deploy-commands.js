//RUN TO REGISTER COMMANDS IN DISCORD (any .js file inside the commands-folder)
const con = require('./other/debug.js');
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

con.warn("Purged all commands & adding new commands:");

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    con.log(" + " + file);
}

const rest = new REST({ version: '9' }).setToken(token);

//USE THIS TO APPLY COMMANDS GLOBAL (won't remove commands applied to specific guilds)
rest.put(Routes.applicationCommands(clientId), { body: commands })
    .then(() => con.done('Successfully registered commands globally.'))
    .catch(console.error);

//USE THIS TO APPLY COMMANDS ONLY IN SPECIFIC GUILDS
/*
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => con.done(`Successfully registered application commands for guild ${guildId}.`))
    .catch(console.error);*/