const { version } = require('../package.json');

// mac 的系统是 darwin
// 将下载的模板放到本地的.template 临时隐藏文件夹中(缓存),以便下次直接读取缓存或进行ejs模板渲染
const downloadDirectory = `${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}/.template`

module.exports = {
    version,
    downloadDirectory
}