// commander 解析用户参数

const program = require('commander');
const path = require('path');
const { version } = require('./constants');


const mapActions = {
    create:{
        alias:'c',
        description:'create a project',
        examples:[
            'djade-cli create <project-name>'
        ]
    },
    '*':{
        alias:'',
        description:'command not found',
        examples:[]
     }
}

// Object.keys 功能一样 Reflect.ownKeys可以循环Symbol
Reflect.ownKeys(mapActions).forEach((action) => {
    program
    .command(action) // 配置命令名字 
    .alias(mapActions[action].alias)   // 命令别名
    .description(mapActions[action].description) // 命令对应的描述
    .action( () => {   // 执行命令对应的动作
        if( action === '*'){
            console.log(mapActions[action].description)
        }else{
            require(path.resolve(__dirname,action))(...process.argv.slice(3))
        }
    })
})


program.version(version).parse(process.argv)

