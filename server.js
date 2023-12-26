const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const logEvents = require('./logEvents');

const EventEmitter = require('events');

class Emitter extends EventEmitter { };
// initialize object and emittting the log
const logEmitter = new Emitter();
logEmitter.on('log', (msg, fileName) => logEvents(msg, fileName));
const PORT = process.env.PORT || 3500;

const serveFile = async (filePath, contentType, response) => {
    try {
        const rawData = await fsPromises.readFile(
            filePath, 
            !contentType.includes('image') ? 'utf8' : ''
        );
        const data = contentType === 'application/json'
            ? JSON.parse(rawData) : rawData;
        response.writeHead(
            filePath.includes('404.html') ? 404 : 200, 
            {'Content-Type': contentType}
        );
        response.end(
            contentType === 'application/json' ? JSON.stringify(data) : data
        );
    } catch (error) {
        console.log(error);
        logEmitter.emit('log', `${error.name}: ${error.message}`, 'errorLog.txt');
        response.statusCode = 500;
        response.end();
    }
}

const server = http.createServer((req, res) => {
    console.log(req.url, req.method);
    logEmitter.emit('log', `${req.url}\t${req.method}`, 'requestLog.txt');

    const extension = path.extname(req.url);

    let contentType;

    switch (extension) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';
            break;
    }

    let filePath = 
        contentType === 'text/html' && req.url === '/'
            ? path.join(__dirname, 'src', 'views', 'index.html')
            : contentType === 'text/html' && req.url.slice(-1) === '/'
                ? path.join(__dirname, 'src', 'views', req.url, 'index.html')
                : contentType === 'text/html'
                    ? path.join(__dirname, 'src', 'views', req.url)
                    : path.join(__dirname, req.url);
    
    // makes .html extension not required in the browser
    if (!extension && req.url.slice(-1) !== '/') filePath += '.html';

    const fileExists = fs.existsSync(filePath);

    if (fileExists) {
        // serve the file
        serveFile(filePath, contentType, res);
    } else {
        
        // 301 redirect
        switch (path.parse(filePath).base) {
            case 'old-page.html':
                res.writeHead(301, {'location': '/about.html'});
                res.end();
                break;
            case 'www-page.html':
                res.writeHead(301, {'location': '/'});
                res.end();
                break;
            default:
                // 404
                serveFile(path.join(__dirname, 'src', 'views', '404.html'), 'text/html', res);
                break;
        }
    }
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})