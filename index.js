const fs = require('fs');
const http = require('http');
const path = require('path');
const port = process.env.SERVER_PORT || 3000;

function requestHandler(req, res) {
  const url = new URL(req.url, `http://localhost:${port}/`);
  const pathname = url.pathname;
  const delay = url.searchParams.get('delay') || 0;
  console.log(`serving path ${pathname}, with delay ${delay} ms`);

  setTimeout(() => {
    switch (pathname) {
      case '/':
      case '/redirect': {
        const file = path.resolve(
          __dirname,
          `${pathname.substr(1) || 'index'}.html`
        );
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream(file).pipe(res);
        break;
      }
      case '/red.gif':
      case '/blue.gif': {
        const file = path.resolve(__dirname, pathname.substr(1));
        res.writeHead(200, { 'Content-Type': 'image/gif' });
        fs.createReadStream(file).pipe(res);
        break;
      }
      case '/hello.js':
      case '/goodbye.js': {
        const file = path.resolve(__dirname, pathname.substr(1));
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        fs.createReadStream(file).pipe(res);
        break;
      }
      default:
        res.writeHead(404);
        res.end();
    }
  }, delay);
}

http.createServer(requestHandler).listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
