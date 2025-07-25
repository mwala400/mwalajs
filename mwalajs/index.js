import express from 'express';

class Mwala {
  constructor() {
    this.app = express();
  }

  // Set application settings
  set(setting, value) {
    this.app.set(setting, value);
  }

  // Accept multiple middlewares or (path, middleware)
  use(...args) {
    this.app.use(...args);
  }

  // Serve static files
  useStatic(dirPath) {
    this.app.use(express.static(dirPath));
  }

  // Route methods
  get(...args) {
    this.app.get(...args);
  }

  post(...args) {
    this.app.post(...args);
  }

  put(...args) {
    this.app.put(...args);
  }

  delete(...args) {
    this.app.delete(...args);
  }

  listen(port, callback) {
    this.app.listen(port, callback);
  }

  Router() {
    return express.Router();
  }

  // Built-in body parsers
  json() {
    return express.json();
  }

  urlencoded(options = { extended: true }) {
    return express.urlencoded(options);
  }

  // Async external middlewares
  async session(options) {
    const { default: session } = await import('express-session');
    return session(options);
  }

  async cookieParser(secret) {
    const { default: cookieParser } = await import('cookie-parser');
    return cookieParser(secret);
  }

  async helmet(options) {
    const { default: helmet } = await import('helmet');
    return helmet(options);
  }

  async compress(options) {
    const { default: compression } = await import('compression');
    return compression(options);
  }

  async morgan(format) {
    const { default: morgan } = await import('morgan');
    return morgan(format);
  }

  async override(method) {
    const { default: methodOverride } = await import('method-override');
    return methodOverride(method);
  }

  async cors(options) {
    const { default: cors } = await import('cors');
    return cors(options);
  }

  async rateLimit(options) {
    const { default: rateLimit } = await import('express-rate-limit');
    return rateLimit(options);
  }

  async bodyParserJson() {
    const { default: bodyParser } = await import('body-parser');
    return bodyParser.json();
  }

  async bodyParserUrlencoded(options = { extended: true }) {
    const { default: bodyParser } = await import('body-parser');
    return bodyParser.urlencoded(options);
  }
}

export default new Mwala();
