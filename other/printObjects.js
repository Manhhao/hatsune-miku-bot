const con = require('../other/debug.js');

module.exports = {
    show : function(object){
        print(object,0);
    }
}

function print(object, depth){
    if (depth >= 4)
        return;
    let space = "";
    for(let i=0;i<depth;i++)
        space += ' ';
    for(let k in object){
        if (k === 'guild')
            continue;
        if (typeof object[k] === 'object' && object[k] !== null){
            console.log(`${space}${k} : `);
            print(object[k],depth+1);
        } else {
            console.log(`${space}${k} : ${object[k]}`);
        }
    }
}