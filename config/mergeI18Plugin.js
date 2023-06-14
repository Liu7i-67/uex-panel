const fs = require("fs");
const path = require("path");

/**
 * 可传入参数
 * req.i18Dir   i18n存放路径zh-CN的上一级
 * req.lang     需要聚合的语言 [zh-CN,zh-TW,zh-HK]
 */

class MyPlugin {
  constructor(req) {
    this.i18Dir = req.i18Dir;
    this.lang = req.lang;
  }

  apply(compiler) {
    // 在 'emit' 事件中注册一个处理函数
    compiler.hooks.emit.tap("mergeI18Plugin", (compilation) => {
      const cwd = path.resolve(__dirname, this.i18Dir);
      (this.lang || []).forEach((lang) => {
        // 设置目录路径
        const directoryPath = path.join(cwd, lang);
        // 初始化输出数据
        const outputData = {};
        // 读取目录
        fs.readdir(directoryPath, (err, files) => {
          if (!err) {
            // 过滤json文件
            const jsonFiles = files.filter(
              (file) => path.extname(file) === ".json"
            );
            // 读取每个json文件并保存到outputData中
            jsonFiles.forEach((file) => {
              const filePath = path.join(directoryPath, file);
              const data = JSON.parse(fs.readFileSync(filePath));
              outputData[file.replace(".json", "")] = data;
            });
            const contents = JSON.stringify(outputData);
            compilation.assets[`${lang}.json`] = {
              source: function () {
                return contents;
              },
              size: function () {
                return contents.length;
              },
            };
          }
        });
      });
    });
  }
}

module.exports = MyPlugin;
