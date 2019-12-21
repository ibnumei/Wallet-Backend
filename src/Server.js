import http from 'http';


/**
 * Represent the thing that provides a service
 */
export default class Server {
  constructor(app, config) {
    this._app = app;
    this._config = config;
    this._server = null;
  }

  start() {
    const { port } = this._config;
    this._server = http.createServer(this._app);
    this._server.listen(port);
  }

  stop() {
    this._server.close();
  }
}
