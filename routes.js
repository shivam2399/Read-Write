const fs = require('fs');

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;

    if (url === '/') {
        res.setHeader('Content-Type', 'text/html');
        fs.readFile('message.txt', (err, data) => {
            const message = err ? 'No message yet.' : data.toString();

            res.end(`
                <h1>${message}</h1>
                <form action="/message" method="POST">
                    <label>Name:</label>
                    <input type="text" name="username" />
                    <button type="submit">Add</button>
                </form>
            `);
        });
    } else if (url === '/message' && method === 'POST') {
        let dataChunks = [];
        req.on('data', (chunk) => {
            dataChunks.push(chunk);
        });

        req.on('end', () => {
            const parsedBody = Buffer.concat(dataChunks).toString();
            const value = parsedBody.split('=')[1];

            fs.writeFile('message.txt', value, (err) => {
                res.statusCode = 302;
                res.setHeader('Location', '/');
                res.end();
            });
        });
    }
}

module.exports = requestHandler;