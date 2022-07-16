
// 拉取自己的所有项目列处理 让用户自己选 安装那个项目
// 选完后 再显示所有的版本号 让用户选

// 可能还需要用户配置一些数据(eg：依赖、版本... ) 来渲染(package.json)我的项目

const axios = require('axios');
const ora = require('ora');
const Inquirer = require('inquirer');


const fetchRepoList = async () => {
    const { data } = await axios.get('https://api.github.com/users/panyushan-jade/repos');
    return data
}

const wrapperLoading = (fn) => {
    const spinner = ora('fetching template......');
    spinner.start();
    return new Promise( async (resolve,reject) => {
        try{
            const data = await fn()
            spinner.succeed()
            resolve(data)
        }catch(err){
            spinner.fail('fetching fail please try again')
            reject(err)
        }
    })
}

module.exports = async (projectName) => {
    // const spinner = ora('fetching template......');
    // spinner.start();
    // let repos = await fetchRepoList();
    // spinner.succeed()
    let repos = await wrapperLoading(fetchRepoList);
    repos = repos.map( item => item.name);
    // 选择模板
    console.log('repos====>',repos);
    const { repo } = await Inquirer.prompt({
        name:'repo',
        type:'list',
        message:'please choice a template to create project',
        choices:repos
    })
    console.log('repo==>',repo); 
}