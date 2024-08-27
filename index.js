import { readFile, accessSync, constants } from 'fs';
import { createServer } from 'http';
import { join, normalize, resolve, extname } from 'path';

const port = 8000;
const directoryName = './public';
const apkDirectory = './apk';

const types = {
  html: 'text/html',
  css: 'text/css',
  js: 'application/javascript',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  json: 'application/json',
  xml: 'application/xml',
  apk: 'application/vnd.android.package-archive', // 添加 APK MIME 类型
};

const root = normalize(resolve(directoryName));
const apkRoot = normalize(resolve(apkDirectory));

const server = createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
 const version = req.url.replace(/\//g, '');

  
 console.log(version)
 
 if(version == 2){
	res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('404: newest');
    return;
 }

  const extension = extname(req.url).slice(1);
  const type = extension ? types[extension] : types.html;
  const supportedExtension = Boolean(type);

  if (!supportedExtension) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('404: File not found1');
    return;
  }

  let fileName = req.url;
  if (req.url === '/') fileName = 'index.html';
  else if (!extension) {
    try {
      accessSync(join(root, fileName));
    } catch (err) {
      fileName = `${fileName}.html`;
    }
  }

  const filePath = "./apk/test.apk";

  readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('404: File not found2');
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/vnd.android.package-archive' });
    res.end(data);
  });
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
