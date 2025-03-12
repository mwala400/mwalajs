import express from 'express';

class Mwala {
  constructor() {
    this.app = express();
    this.settings = {};
  }

  set(setting, value) {
    this.settings[setting] = value;
    this.app.set(setting, value);
  }

  use(route, handler) {
    if (typeof route === 'string') {
      this.app.use(route, handler);
    } else {
      this.app.use(route);
    }
  }

  static(pathDir) {
    this.app.use(express.static(pathDir));
  }

  listen(port, callback) {
    this.app.listen(port, callback);
  }

  // Ensure Router is available
  static Router() {
    return express.Router();
  }
}

// Export an instance of Mwala
export default new Mwala();

