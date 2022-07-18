
// 拉取自己的所有项目列处理 让用户自己选 安装那个项目
// 选完后 再显示所有的版本号 让用户选
// 可能还需要用户配置一些数据(eg：依赖、版本... ) 来渲染(package.json)我的项目
const path = require('path')
const axios = require('axios');
const ora = require('ora');
const chalk = require('chalk');
const fs = require('fs');
const Inquirer = require('inquirer');
const { downloadDirectory } = require('./constants');
const { promisify } = require('util'); // 用于转换promise
let downloadGitRepo = require('download-git-repo'); // 下载模板(代码)
downloadGitRepo = promisify(downloadGitRepo);
let ncp = require('ncp'); // copy 目录
ncp = promisify(ncp)


const fetchRepoList = async () => {
    const { data } = await axios.get('https://api.github.com/users/panyushan-jade/repos');
    return data
}

const wrapperLoading = (fn,message) => async (...args) => {
    const spinner = ora(message.loadingInfo);
    try{
        spinner.start();
        const data = await fn(...args);
        spinner.succeed()
        return data
    }catch(err){
        spinner.fail(message.failInfo);
        return null
    }
}

const downLoad = async repo => {
    const dest = `${downloadDirectory}/${repo}`
    await downloadGitRepo(`panyushan-jade/${repo}`,dest)
    return dest
}

module.exports = async (projectName) => {
    let repos = await wrapperLoading(fetchRepoList,{
        loadingInfo:'fetching template......',
        failInfo:'fetching fail please try again'
    })();
    if(!repos) return
    repos = repos.map( item => item.name);
    // 选择模板
    const { repo } = await Inquirer.prompt({
        name:'repo',
        type:'list',
        message:'please choice a template to create project',
        choices:repos
    })
    const result = await wrapperLoading(downLoad,{
        loadingInfo:'download template......',
        failInfo:'download fail please try again'
    })(repo)
    //简单的项目直接拷贝
    /* 
        判断是否有同名的项目，并提示操作
    */
    if(fs.existsSync(path.resolve(projectName))){
        const { isExist } = await Inquirer.prompt({
            name:'isExist',
            type:'list',
            message:`${projectName} exists in the current directory. Overwrite?`,
            choices:['yes','no']
        })
        if( isExist === 'yes'){
            console.log('');
            await ncp(result,path.resolve(projectName))
            console.log(chalk.green(`succeed ✔✔✔`));
            console.log(chalk.green(`cd ${projectName} and install 🙌`));
            console.log('');
        }else{
            process.exit()
        }
    }else{
        await ncp(result,path.resolve(projectName))
    }
    //复杂的项目 使用模板渲染 ejs  metalsmith(遍历文件) consolidate(模板引擎集合)
}