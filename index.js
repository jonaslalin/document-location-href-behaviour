const http = require('http');
const fs = require('fs');

const port = process.env.SERVER_PORT || 3000;

function requestHandler(req, res) {
  const url = new URL(req.url, `http://localhost:${port}/`);
  const path = url.pathname;
  const delay = url.searchParams.get('delay') || 0;
  console.log(`serving path ${path}, with delay ${delay} ms`);

  setTimeout(() => {
    switch (path) {
      case '/':
      case '/redirect':
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream((path.substr(1) || 'index') + '.html').pipe(res);
        break;
      case '/red.gif':
      case '/blue.gif':
        res.writeHead(200, { 'Content-Type': 'image/gif' });
        fs.createReadStream(path.substr(1)).pipe(res);
        break;
      case '/hello.js':
      case '/goodbye.js':
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        fs.createReadStream(path.substr(1)).pipe(res);
        break;
      default:
        res.writeHead(404);
        res.end();
    }
  }, delay);
}

http.createServer(requestHandler).listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
