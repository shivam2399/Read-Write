const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    if(url === '/') {
        res.setHeader('Content-Type', 'text/html');

        res.end(`
            <form action="/message" method="POST">
             <label>Name:</label>
             <input type="text" name="username"></input>
             <button type="submit">Add</button>
            </form>
        `);
    } else {
        if(req.url=="/message") {
            res.setHeader('Content-Type', 'text/html');

            let dataChunks = [];
            req.on('data', (chunk) => {
                dataChunks.push(chunk);
            });

            req.on('end', () => {
                let combinedBuffer = Buffer.concat(dataChunks);
                let value = combinedBuffer.toString().split('=')[1];

                fs.writeFile('message.txt', value, (err) => {
                    
                    res.statusCode = 302; // redirect status code
                    res.setHeader('Location', '/');
                    res.end()
                });
            });
        } else {
            if(url == '/read') {
                fs.readFile('message.txt', (err, data) => {
                    console.log(data.toString());
                    res.end(`
                        <h1>${data.toString()}</h1>
                    `);
                })
            }
        }
    }
})

server.listen(3000, () => {
    console.log('Server is running on port 3000');
})