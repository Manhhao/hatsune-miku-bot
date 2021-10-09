const Discord = require("discord.js");
const { token, prefix } = require("./config.json");
const ytdl = require("ytdl-core");
const ytsr = require ("ytsr");

const client = new Discord.Client();

const queue = new Map();

client.once("ready", () => {
	console.log("bot gestartet");
    client.user.setActivity("der prefix ist -"); 
});
//const prefix = '-';
let timeout_timer;
let has_new_song = false;

function embedded_msg(msg){
    const message = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setDescription(msg)

    return message;
}; 

function embedded_msg_error(msg){
    const message = new Discord.MessageEmbed()
	.setColor('#dc143c')
	.setDescription(msg)

    return message;
}; 

function embedded_bold(msg){
    const message = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle(msg)

    return message;
}; 

function do_8ball(message, question) {
    var answers = ['It is certain.', 'It is decidedly so.', 'Without a doubt.', 'Yes – definitely.', 'You may rely on it.', 'As I see it, yes.', 'Most likely.',
    'Outlook good.', 'Yes.', 'Signs point to yes.', 'Reply hazy, try again.', 'Ask again later.', 'Better not tell you now.', 'Cannot predict now.', 'Concentrate and ask again.',
    'Don’t count on it.', 'My reply is no.', 'My sources say no.', 'Outlook not so good.', 'Very doubtful.'];

    const embed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle(`${question}`)
    .setDescription(`${answers[Math.round(Math.random()*answers.length)]}\n\ngefragt von [<@${message.author.id}>]`)

    return embed;
}

function do_roll(max = 100) {
    return Math.round(Math.random()*max);
}

function do_help(message) {
    const embed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle("Alle Commands")
    .setDescription(`<@${message.author.id}>`)
    .addFields(
        { name: 'Musik', value: '-play [Songtitel bzw. URL] - Spielt ein Lied ab bzw. fügt ein Lied zur Queue hinzu\n-skip - Überspringt das jetzige Lied\n-stop - Löscht die Queue und disconnected den Bot' },
        { name: 'Fun', value: '-8ball [Frage] - Gibt eine Antwort zu einer Frage wieder\n-roll [optional: obere grenze] - Gibt eine zufällige Zahl zurück zwischen 1 und der oberen Grenze wieder (default: 100)'},
        { name: 'Anderes', value: '-clear [Anzahl der Nachrichten] - Löscht eine Anzahl von Nachrichten im Channel'}
    )

    message.channel.send(embed);
}

async function do_clear(text_channel, amount) {
    text_channel.messages.fetch({ limit: amount }).then(msgs => {
        msgs.forEach((message) => {
            message.delete();
        });
    });
}

client.on("message", async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) {
        return;
    }
    const arr = message.content.slice(prefix.length).split(" ");
    
    const current_cmd = arr.shift().toLowerCase();

    const server_queue = queue.get(message.guild.id);

    if (current_cmd == "du") {
        message.channel.send(embedded_msg("hurensohn"))
    }
    else if (current_cmd == "nico") {
        message.channel.send(embedded_msg("stinkt"));
    }
    else if (current_cmd == "ping") {
        message.channel.send(embedded_msg("pong"));
    }
    else if (current_cmd == "play" || current_cmd == "p") {
        if (arr.length != 0)
            execute(message, server_queue, current_cmd.length);
        else 
            message.channel.send(embedded_msg_error(`Es wurde kein Songtitel bzw. keine URL angegeben [<@${message.author.id}>]`));
    }
    else if (current_cmd == "stop") {
        stop(message, server_queue);
    }
    else if (current_cmd == "skip") {
        skip(message, server_queue);
    }
    else if (current_cmd == "disconnect") {
        disconnect(message, server_queue);
    }
    else if (current_cmd == "karl") {
        message.channel.send("Karl ist eine nette Person!", {tts: true})
    }
    else if (current_cmd == "8ball") {
        if (arr.length != 0) {
            await message.channel.send(do_8ball(message, arr.join(" ")));
            message.delete();
        }
        else 
            message.channel.send(embedded_msg_error(`Es wurde keine Frage angegeben [<@${message.author.id}>]`))
    }
    else if (current_cmd == "clear") {
        const perms = message.channel.permissionsFor(message.author.id);
        if (!perms.has("MANAGE_MESSAGES")) {
            message.channel.send(embedded_msg_error(`Du hast keine Rechte diesen Command auszuführen [<@${message.author.id}>]`));
            return;
        }
        if (arr.length != 0) {
            let num = parseInt(arr[0]);
            if (!Number.isNaN(num)) {
                do_clear(message.channel, num + 1);
            }
            else {
                message.channel.send(embedded_msg_error(`Es wurde keine Anzahl angegeben [<@${message.author.id}>]`));
            }
        }
        else {
            message.channel.send(embedded_msg_error(`Es wurde keine Anzahl angegeben [<@${message.author.id}>]`));
        }
    }
    else if (current_cmd == "roll") {
        if (arr.length != 0) {
            let num = parseInt(arr[0]);
            if (!Number.isNaN(num)) {
                message.channel.send(embedded_msg(`${ do_roll(num) } [<@${message.author.id}>]`));
            }
            else {
                message.channel.send(embedded_msg(`${ do_roll() } [<@${message.author.id}>]`));
            }
        }
        else {
            message.channel.send(embedded_msg(`${ do_roll() } [<@${message.author.id}>]`));
        }
    }
    else if (current_cmd == "help") {
        do_help(message);
    }
    else if (current_cmd == "lars") {
        message.channel.send(embedded_msg("ist ein geiler Stecher"));
    }
    else if (current_cmd == "max") {
        message.channel.send(embedded_msg("ist ein Hurensohn"));
    }
    else if (current_cmd == "timo") {
        message.channel.send(embedded_msg("ist ein Gold Pleb"));
    }
});

function is_bot_in_voice(guild) {
    return guild.channels.cache.some(channel => (channel.type === 'voice' && channel.members.has(client.user.id)));
}

async function execute(message, server_queue, cmd_len) {
    const voice_channel = message.member.voice.channel;
    if (!voice_channel)
      return message.channel.send(
        embedded_msg_error(`Du bist nicht in einem Voice Channel [<@${message.author.id}>]`)
      );
    const permissions = voice_channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        embedded_msg_error(`Ich habe keine Rechte den Channel zu joinen [<@${message.author.id}>]`)
      );
    }

    const arg = message.content.slice(prefix.length + cmd_len + 1);
    
    const video_finder = async (query) =>{
        const video_result = await ytsr(query, { limit: 1 });
        return (video_result.items.length > 0) ? video_result.items[0] : null;
    }

    let song = {};

    if (ytdl.validateURL(arg)) {
        const song_info = await ytdl.getInfo(arg);
        song = { 
            title: song_info.videoDetails.title, 
            url: song_info.videoDetails.video_url,
            requester: message.author.id
        };
    }
    else {
        const video = await video_finder(arg);
        if (video) {
            song = { 
                title: video.title, 
                url: video.url, 
                requester: message.author.id
            }; 
        } 
        else {
             message.channel.send(embedded_msg('kp irgendein fehler'));
        }
    }
  
    if (!server_queue) {
        const queue_item = {
            text_channel: message.channel,
            voice_channel: voice_channel,
            connection: null,
            songs: [],
            volume: 5,
        };
  
        queue.set(message.guild.id, queue_item);

        queue_item.songs.push(song);
  
        try {
            var connection = await voice_channel.join();
            queue_item.connection = connection;
            has_new_song = true;

            queue_item.connection.on("disconnect", () => {
                console.log("disconnected from voice channel");
                if (queue)
                    queue.delete(message.guild.id);
            });

            play(message.guild, queue_item.songs[0]);
        } 
        catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } 
    else {
        if (timeout_timer) {
            clearTimeout(timeout_timer);
            timeout_timer = undefined;
            has_new_song = true;

            server_queue.songs.push(song);
            play(message.guild, server_queue.songs[0]);
        }
        else {
            server_queue.songs.push(song);
            return message.channel.send(embedded_msg(`Zur Queue hinzugefügt: **${song.title}** [<@${message.author.id}>]`));
        }
    }
}

// todo: track if theovgt is alone in voicechannel and for how long
client.on('voiceStateUpdate', (old_state, new_state) => {
    let old_channel = old_state.channel
    let new_channel = new_state.channel
  
    if(old_channel == undefined && new_channel) {
  
    } 
    else if(old_channel && new_channel == undefined){
  
    }
})

playing_message = undefined;

function skip(message, server_queue) {
    if (!message.member.voice.channel)
    return message.channel.send(embedded_msg_error(
    `Du bist nicht in einem Voice Channel <@${message.author.id}>`));

    if (!is_bot_in_voice(message.guild))
        return message.channel.send(embedded_msg_error(
            `Der Bot befindet sich in keinem Channel [<@${message.author.id}>]`));

    if (!server_queue || server_queue.songs.length == 0) {
        return message.channel.send(embedded_msg_error(`Es sind keine Lieder in der Queue [<@${message.author.id}>]`));
    }
    // message.channel.send(embedded_msg(`Übersprungen: **${server_queue.songs[0].title}** [<@${message.author.id}>]`))
    message.react("👌");
    
    if (playing_message)
        playing_message.delete();

    server_queue.connection.dispatcher.end();
}

function disconnect(message, server_queue) {   
    if (!is_bot_in_voice(message.guild))
    return message.channel.send(embedded_msg_error(
        `Der Bot befindet sich in keinem Channel [<@${message.author.id}>]`));
    
    if (server_queue) {
        server_queue.voice_channel.leave();

        //message.channel.send(embedded_msg_error(
        //    `Der Bot wurde disconnected [<@${message.author.id}>]`));
        if (playing_message)
            playing_message.delete();

        message.react("👋");
    }
}

function stop(message, server_queue) {     
    if (!is_bot_in_voice(message.guild))
    return message.channel.send(embedded_msg_error(
        `Der Bot befindet sich in keinem Channel [<@${message.author.id}>]`));

    if (!server_queue || server_queue.songs.length == 0) {
        return message.channel.send(embedded_msg_error(`Es sind keine Lieder in der Queue [<@${message.author.id}>]`));
    }

    server_queue.songs = [];
    message.react("👌");

    if (playing_message)
        playing_message.delete();

    server_queue.connection.dispatcher.end();
    //message.channel.send(embedded_msg(`Alle Lieder wurden aus der Queue gelöscht [<@${message.author.id}>]`));
}

function play(guild, song) {
    const server_queue = queue.get(guild.id);

    if (!song) {
        timeout_timer = setTimeout(() => { 
            if (!has_new_song) {
                server_queue.voice_channel.leave();
                return;
            }
        }, 120000)
        return;
    }

    if (has_new_song) {
        has_new_song = false;
        const dispatcher = server_queue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
            server_queue.songs.shift();

            if (server_queue.songs[0])
                has_new_song = true;

            playing_message.delete();
            playing_message = undefined;

            play(guild, server_queue.songs[0]);
        })  
        .on("error", error => console.error(error));
        dispatcher.setVolumeLogarithmic(server_queue.volume / 5);

        server_queue.text_channel.send(embedded_msg(`Spielt: **${song.title}** [<@${song.requester}>]`)).then(msg => {
            playing_message = msg;
        });
    }
}
  
client.login(token);