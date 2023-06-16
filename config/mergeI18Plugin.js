const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

function getLangMd5(string) {
  return crypto.createHash("md5").update(string).digest("hex");
}

/**
 * 可传入参数
 * req.i18Dir   i18n存放路径zh-CN的上一级
 * req.lang     需要聚合的语言 [zh-CN,zh-TW,zh-HK]
 * req.pages    需要插入md5信息的页面名称 例如 index.html 需要在目标页面添加一个meta标签<meta name="i18n" content="i18n" />
 */

class MyPlugin {
  constructor(req) {
    this.i18Dir = req.i18Dir;
    this.lang = req.lang;
    this.pages = req.pages;
    this.langMd5 = this.lang ? this.lang.map((i) => [i, ""]) : [];
  }

  apply(compiler) {
    // 在 'emit' 事件中合并JSON
    compiler.hooks.emit.tap("mergeI18", (compilation) => {
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
            const md5 = getLangMd5(contents);
            compilation.assets[`${lang}.${md5}.json`] = {
              source: function () {
                return contents;
              },
              size: function () {
                return contents.length;
              },
            };
            const index = this.langMd5.findIndex((i) => i[0] === lang);
            if (index > -1) {
              this.langMd5[index] = `${lang}:${md5}`;
            }
          }
        });
      });
    });
    // 在 'afterEmit' 事件中将json的md5信息写入HTML
    compiler.hooks.afterEmit.tap("ChangePage", (compilation) => {
      const outputPath = path.resolve(compilation.compiler.options.output.path);
      console.log("langMd5:", this.langMd5, outputPath);
      for (let name of this.pages) {
        // 读取页面信息
        const filePath = path.join(outputPath, name);

        fs.readFile(filePath, "utf8", (err, data) => {
          if (err) {
            console.error(filePath, "读取失败", err);
          } else {
            const newPage = data.replace(
              '<meta name="i18n" content="i18n',
              `<meta name="i18n" content="${this.langMd5.join(" ")}`
            );
            fs.writeFile(filePath, newPage, "utf8", (err) => {
              if (err) {
                console.error(filePath, "写入失败", err);
              } else {
                console.log("已成功写入内容到指定文件！");
              }
            });
          }
        });
      }
    });
  }
}

module.exports = MyPlugin;
