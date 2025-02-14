const fs = require('fs');
const path = require('path');

// 读取输入文件
const inputFile = process.argv[2]; // 通过拖放文件到脚本获取路径
if (!inputFile) {
  console.log('请将文本文件拖放到此脚本上！');
  process.exit(1);
}

// 核心转换逻辑
function convertTextToJSArray(content) {
  const lines = content.split('\n').filter(line => line.trim() !== '');
  const items = lines.map(line => {
    const [name, price] = line.split('\t');
    return { 
      name: name.trim(), 
      price: parseFloat(price.trim()), 
      weight: 1  // 默认权重
    };
  });

  return `const products = ${JSON.stringify(items, null, 2)};`;
}

// 执行转换
try {
  const content = fs.readFileSync(inputFile, 'utf-8');
  const jsCode = convertTextToJSArray(content);
  
  // 输出到同目录的 output.js 文件
  const outputPath = path.join(path.dirname(inputFile), 'output.js');
  fs.writeFileSync(outputPath, jsCode);
  console.log(`转换成功！文件已保存至: ${outputPath}`);
} catch (err) {
  console.error('错误:', err.message);
}