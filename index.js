import Server from './src/Server';
import app from './src/app';
import config from './config';

const server = new Server(app, config);

server.start();

process.on('SIGINT', () => server.stop());
process.on('SIGTERM', () => server.stop());
