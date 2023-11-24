const http = require('node:http');
const app = require('./app.js');

/**
 * returns a valid port, whether provided as a number or a string
 * @param { string | number } val
 * @returns { string | number }
 */

const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * looks for different errors and handles them appropriately. It is then saved in the server
 * @param { error } error
 */

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/**
 * logging the port or named pipe the server is running on in the console
 */

const listenersHandler = () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
}

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', listenersHandler);

server.listen(port);
