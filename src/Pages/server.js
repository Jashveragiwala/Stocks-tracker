import { createServer } from 'http';
import { createConnection } from 'mysql2';
import { parse } from 'url';

const connection = createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'stocks'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as ID ' + connection.threadId);
});

const server = createServer((req, res) => {
  const reqUrl = parse(req.url, true);

  if (reqUrl.pathname === '/api/watchlist' && req.method === 'GET') {
    connection.query('SELECT * FROM watchlist', (err, rows) => {
      if (err) {
        console.error('Error querying MySQL: ' + err.stack);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error querying the database' }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify(rows));
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

const port = 5000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
