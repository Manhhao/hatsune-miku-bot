const chalk = require('chalk');

module.exports = {

    error : function(msg){
        console.log(chalk.redBright(`${getDate()} | ERROR | ${msg}`));
    },
    warn : function(msg){
        console.log(chalk.yellowBright(`${getDate()} | WARN | ${msg}`));
    },
    log : function(msg){
        console.log(`${getDate()} | INFO | ${msg}`);
    },
    done : function(msg){
        console.log(chalk.greenBright(`${getDate()} | DONE | ${msg}`));
    },
    debug : function(msg){
        console.log(chalk.blueBright(`${getDate()} | DEBUG | ${msg}`));
    },
    low : function(msg){
        console.log(chalk.gray(`${getDate()} | INFO | ${msg}`));
    }
}

function getDate(){
    const date = new Date().toString();
    const temp = date.split(' ');
    return `${temp[1]} ${temp[2]} ${temp[4]}`;
}