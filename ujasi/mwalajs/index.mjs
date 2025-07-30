import express from 'express';

class Mwala {
  // ... constructor, set, use, etc.
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

  Router() {
    return express.Router();
  }

  
  //  ADD THESE METHODS to support GET/POST/PUT/DELETE
  get(path, handler) {
    this.app.get(path, handler);
  }

  post(path, handler) {
    this.app.post(path, handler);
  }

  put(path, handler) {
    this.app.put(path, handler);
  }

  delete(path, handler) {
    this.app.delete(path, handler);
  }

  // ✅ Proxy core express middleware
  json() {
    return express.json();
  }

  urlencoded(options) {
    return express.urlencoded(options);
  }

  raw(options) {
    return express.raw(options);
  }

  text(options) {
    return express.text(options);
  }

  async cookieParser(secret) {
    const { default: cookieParser } = await import('cookie-parser');
    return cookieParser(secret);
  }

  async session(options) {
    const { default: session } = await import('express-session');
    return session(options);
  }

  async morgan(format) {
    const { default: morgan } = await import('morgan');
    return morgan(format);
  }

  async helmet(options) {
    const { default: helmet } = await import('helmet');
    return helmet(options);
  }

  async compress(options) {
    const { default: compression } = await import('compression');
    return compression(options);
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

  async bodyParserUrlencoded(options) {
    const { default: bodyParser } = await import('body-parser');
    return bodyParser.urlencoded(options);
  }
}

export default new Mwala();
