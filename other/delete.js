const con = require('./debug.js');
const prnt = require('./printObjects.js');

module.exports = {

    delByAuthor : function(author,channel,amount=99,title=null){
        if (amount > 100){
            con.error('bulkdelete may not be larger than 100');
            return;
        }
        channel.messages.fetch({ limit: amount }).then(messages => {
            console.log(`Received ${messages.size} messages`);
            //Iterate through the messages here with the variable "messages".
            messages.forEach(message => del(message,author,title))
        })
    }
}

function del(message,author,title=null){
    if (message.embeds[0] !== undefined){
        if (message.embeds[0].author !== null){
            //con.debug(message.embeds[0].title);
            if (message.embeds[0].author.name.includes(author)){
                if (title !== null && message.embeds[0].title.includes(title) || title === null){
                    con.log('Deleted message : ' + message.embeds[0].author.name);
                    message.delete();
                }
            }
        }
    }
}