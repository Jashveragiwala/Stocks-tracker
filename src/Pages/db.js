const http = require('http');
const mysql = require('mysql2');
const { parse } = require('querystring');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'stocks'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as ID ' + connection.threadId);
});

const server = http.createServer((req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/api/watchlist') {
    connection.query('SELECT * FROM watchlist', (err, rows) => {
      if (err) {
        console.error('Error querying MySQL: ' + err.stack);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Error querying MySQL');
        return;
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(rows));
    });
  } else if (req.method === 'POST' && req.url === '/api/watchlist') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const newStock = JSON.parse(body);
      connection.query('SELECT MAX(SerialNo) AS maxSerial FROM watchlist', (err, result) => {
        if (err) {
          console.error('Error querying MySQL: ' + err.stack);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'text/plain');
          res.end('Error querying MySQL');
          return;
        }

        const maxSerial = result[0].maxSerial || 0;
        const newSerial = maxSerial + 1;

        const { StockName, CurrentPrice, Checked } = newStock;
        connection.query('INSERT INTO watchlist (SerialNo, StockName, CurrentPrice, Bought) VALUES (?, ?, ?, ?)', 
          [newSerial, StockName, CurrentPrice, Checked], (err, result) => {
            if (err) {
              console.error('Error inserting into MySQL: ' + err.stack);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'text/plain');
              res.end('Error inserting into MySQL');
              return;
            }

            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ SerialNo: newSerial, StockName, CurrentPrice, Checked }));
          });
      });
    });
  } else if (req.method === 'DELETE' && req.url.startsWith('/api/watchlist/')) {
    const serialNo = req.url.split('/')[3]; // Extract the serial number from the URL
    connection.query('DELETE FROM watchlist WHERE SerialNo = ?', [serialNo], (err, result) => {
      if (err) {
        console.error('Error deleting from MySQL: ' + err.stack);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Error deleting from MySQL');
        return;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: `Deleted item with SerialNo ${serialNo}` }));
    });
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
  }
});

const port = 3001;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
