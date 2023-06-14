const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

class MyPlugin {
  constructor(i18Dir) {
    this.i18Dir = i18Dir;
  }

  apply(compiler) {
    // 在 'emit' 事件中注册一个处理函数
    compiler.hooks.emit.tap("mergeI18Plugin", (compilation) => {
      const cwd = path.resolve(__dirname, this.i18Dir);

      const directoryPath = path.join(cwd, "zh-CN"); // 设置目录路径
      const directoryPathTW = path.join(cwd, "zh-TW"); // 设置目录路径
      const directoryPathHK = path.join(cwd, "zh-HK"); // 设置目录路径
      const outputData = {}; // 初始化输出数据

      //读取目录
      fs.readdir(directoryPath, (err, files) => {
        if (err) {
        } else {
          // 过滤json文件
          const jsonFiles = files.filter(
            (file) => path.extname(file) === ".json"
          );
          console.log("开始聚合zh-CN");
          // 读取每个json文件并保存到outputData中
          jsonFiles.forEach((file) => {
            const filePath = path.join(directoryPath, file);
            const data = JSON.parse(fs.readFileSync(filePath));
            outputData[file.replace(".json", "")] = data;
          });
          const contents = JSON.stringify(outputData);
          compilation.assets["zh-CN.json"] = {
            source: function () {
              return contents;
            },
            size: function () {
              return contents.length;
            },
          };
        }
      });

      // 读取目录
      fs.readdir(directoryPathTW, (err, files) => {
        if (err) {
        } else {
          // 过滤json文件
          const jsonFiles = files.filter(
            (file) => path.extname(file) === ".json"
          );
          // 读取每个json文件并保存到outputData中
          jsonFiles.forEach((file) => {
            const filePath = path.join(directoryPathTW, file);
            const data = JSON.parse(fs.readFileSync(filePath));
            outputData[file.replace(".json", "")] = data;
          });

          const contents = JSON.stringify(outputData);
          compilation.assets["zh-TW.json"] = {
            source: function () {
              return contents;
            },
            size: function () {
              return contents.length;
            },
          };
        }
      });

      // 读取目录
      fs.readdir(directoryPathHK, (err, files) => {
        if (err) {
        } else {
          // 过滤json文件
          const jsonFiles = files.filter(
            (file) => path.extname(file) === ".json"
          );
          // 读取每个json文件并保存到outputData中
          jsonFiles.forEach((file) => {
            const filePath = path.join(directoryPathHK, file);
            const data = JSON.parse(fs.readFileSync(filePath));
            outputData[file.replace(".json", "")] = data;
          });
          const contents = JSON.stringify(outputData);
          compilation.assets["zh-HK.json"] = {
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
  }
}

module.exports = MyPlugin;
