const Discord = require("discord.js");
const { token, prefix } = require("./config.json");
const ytdl = require("ytdl-core");
const yts = require("yt-search");

const client = new Discord.Client();

const queue = new Map();

client.once("ready", () => {
	console.log("bot gestartet");
    client.user.setActivity("der prefix ist -"); 
});
//const prefix = '-';
let timeout_timer;
let has_new_song = false;

client.on("message", async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) {
        return;
    }
    const arr = message.content.slice(prefix.length).split(" ");

    const current_cmd = arr.shift();

    const server_queue = queue.get(message.guild.id);

    if (current_cmd == "du") {
        message.channel.send("hurensohn")
    }
    else if (current_cmd == "nico") {
        message.channel.send("stinkt");
    }
    else if (current_cmd == "ping") {
        message.channel.send("pong");
    }
    else if (current_cmd == "play" || current_cmd == "p") {
        if (arr.length != 0)
            execute(message, server_queue, current_cmd.length);
        else 
            message.channel.send("Der Song fehlt");
    }
    else if (current_cmd == "stop") {
        stop(message, server_queue);
    }
    else if (current_cmd == "skip") {
        skip(message, server_queue);
    }
});

async function execute(message, server_queue, cmd_len) {
    const voice_channel = message.member.voice.channel;
    if (!voice_channel)
      return message.channel.send(
        "Du bist nicht in einem Voice Channel"
      );
    const permissions = voice_channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        "Ich habe keine Rechte den Channel zu joinen"
      );
    }

    const arg = message.content.slice(prefix.length + cmd_len + 1);
    
    const video_finder = async (query) =>{
        const video_result = await yts(query);
        return (video_result.videos.length > 1) ? video_result.videos[0] : null;
    }

    let song = {};

    if (ytdl.validateURL(arg)) {
        const song_info = await ytdl.getInfo(arg);
        song = { 
            title: song_info.videoDetails.title, 
            url: song_info.videoDetails.video_url 
        };
    }
    else {
        const video = await video_finder(arg);
        if (video) {
            song = { 
                title: video.title, 
                url: video.url 
            };
        } 
        else {
             message.channel.send('kp irgendein fehler');
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
            has_new_song = true;
            server_queue.songs.push(song);
            return message.channel.send(`Zur Queue hinzugefügt: **${song.title}**`);
        }
    }
}
  
function skip(message, server_queue) {
    if (!message.member.voice.channel)
        return message.channel.send(
        "Du bist nicht in einem Voice Channel");

    if (!server_queue) {
        return message.channel.send("Keine Lieder in der Queue");
    }
    server_queue.connection.dispatcher.end();
}
  
function stop(message, server_queue) {     
    if (!server_queue)
        return message.channel.send("Keine Lieder in der Queue");
      
    server_queue.songs = [];
    server_queue.connection.dispatcher.end();
}
  
function play(guild, song) {
    const server_queue = queue.get(guild.id);
    if (!song) {
        timeout_timer = setTimeout(() => { 
            if (!has_new_song) {
                server_queue.voice_channel.leave();
                queue.delete(guild.id);

                server_queue.text_channel.send("zu lange inaktiv");
                return;
            }
        }, 180000)
        return;
    }

    if (has_new_song) {
        has_new_song = false;
        const dispatcher = server_queue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
            server_queue.text_channel.messages.fetch({ limit: 20 }).then(msgs => {
                msgs.forEach((message) => {
                    if (message.content.includes(song.title) && message.content.includes("Spielt:")) {
                        message.delete();
                    }
                });
            });
            
            server_queue.songs.shift();
            play(guild, server_queue.songs[0]);
        })
        .on("error", error => console.error(error));
        dispatcher.setVolumeLogarithmic(server_queue.volume / 5);
        server_queue.text_channel.send(`Spielt: **${song.title}**`);
    }
}
  
client.login(token);