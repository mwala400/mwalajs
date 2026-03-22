// config/autodb-backup.mjs
// ────────────────────────────────────────────────
// MWALA AUTO BACKUP – EMAIL + AES-256-GCM + SEQUELIZE DUMP
// Features:
// • PM2 persistent background mode
// • Live log in current directory (mwala-autobackup-live.log)
// • Auto-rotate log when > 3MB
// • Clear decrypt instructions
// • Commands: mwala autodb-backup [init|start|stop|status|logs|decrypt ...]
// ────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { promisify } from 'node:util';
import { exec } from 'node:child_process';
import nodemailer from 'nodemailer';
import crypto from 'node:crypto';
import dns from 'node:dns/promises';
import dotenv from 'dotenv';
import { pathToFileURL } from 'node:url';

dotenv.config();

const execPromise = promisify(exec);

// ─────────────────────────────
// PATHS – log in current directory
// ─────────────────────────────
const CONFIG_FILE  = path.join(process.cwd(), 'config/autodb-config.json');
const SECRETS_FILE = path.join(process.cwd(), 'autodb-backup-secrets.json');
const LOG_DIR      = process.cwd();
const LOG_FILE     = path.join(LOG_DIR, 'mwala-autobackup-live.log');
const BACKUP_ROOT  = path.join(process.cwd(), 'backups');
const PID_FILE     = path.join(process.cwd(), 'autodb-backup.pid');

const MAX_LOG_SIZE = 3 * 1024 * 1024; // 3MB

// ─────────────────────────────
// LOGGING with auto-rotation
// ─────────────────────────────
const log = (msg, level = 'INFO') => {
  const ts = new Date().toISOString();
  const entry = `[${ts}] [${level}] ${msg}\n`;

  try {
    // Rotate if too big
    if (fs.existsSync(LOG_FILE) && fs.statSync(LOG_FILE).size > MAX_LOG_SIZE) {
      const rotated = path.join(LOG_DIR, `mwala-autobackup-${Date.now()}.log`);
      fs.renameSync(LOG_FILE, rotated);
      console.log(`Log rotated → ${path.basename(rotated)}`);
    }
    fs.appendFileSync(LOG_FILE, entry);
  } catch (e) {
    console.error(`[LOG ERROR] Cannot write log: ${e.message}`);
  }

  console.log(entry.trim());
};

// ─────────────────────────────
// ASK HELPER
// ─────────────────────────────
const ask = (question, hidden = false) => new Promise((resolve) => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  if (!hidden) {
    rl.question(question, (ans) => { rl.close(); resolve(ans.trim()); });
  } else {
    process.stdout.write(question);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    let input = '';
    const handler = (c) => {
      c = c.toString();
      if (c === '\r' || c === '\n') {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdin.removeListener('data', handler);
        process.stdout.write('\n');
        rl.close();
        resolve(input);
      } else {
        process.stdout.write('*');
        input += c;
      }
    };
    process.stdin.on('data', handler);
  }
});

// ─────────────────────────────
// SECRETS
// ─────────────────────────────
function loadSecrets() {
  if (fs.existsSync(SECRETS_FILE)) {
    try { return JSON.parse(fs.readFileSync(SECRETS_FILE, 'utf-8')); } catch (e) {
      log(`Corrupted secrets file: ${e.message}`, 'ERROR');
    }
  }
  return {};
}

function saveSecrets(data) {
  try {
    fs.writeFileSync(SECRETS_FILE, JSON.stringify(data, null, 2), 'utf-8');
    log(`Secrets saved: ${SECRETS_FILE}`);
  } catch (e) {
    log(`Failed to save secrets: ${e.message}`, 'ERROR');
  }
}

// ─────────────────────────────
// ENVIRONMENT
// ─────────────────────────────
function detectEnvironment() {
  if (process.env.NODE_ENV === 'production') return 'secure';
  if (process.env.LOCAL_DEV === 'true') return 'insecure';
  if (process.cwd().includes('/var/') || process.cwd().includes('/home/') || process.cwd().includes('/opt/')) {
    return 'secure';
  }
  return 'insecure';
}

// ─────────────────────────────
// CREDENTIALS
// ─────────────────────────────
async function getCredentials() {
  const envType = detectEnvironment();
  log(`Environment: ${envType.toUpperCase()}`);

  let email = process.env.AUTODB_BACKUP_EMAIL;
  let encPass = process.env.AUTODB_BACKUP_ENCRYPT_PASS;
  let authType = 'password';
  let authValue;

  const secrets = loadSecrets();

  email = email || secrets.email || (await ask('Backup email (sender & receiver): '));
  if (email) secrets.email = email;

  encPass = encPass || secrets.encPass || (await ask('Encryption password: ', true));
  if (encPass) secrets.encPass = encPass;

  if (envType === 'secure') {
    if (process.env.OAUTH_CLIENT_ID && process.env.OAUTH_CLIENT_SECRET && process.env.OAUTH_REFRESH_TOKEN) {
      authType = 'oauth2';
      authValue = {
        type: 'OAuth2',
        user: email,
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      };
      log('Using OAuth2 from .env');
    } else {
      let appPass = secrets.appPass || process.env.AUTODB_BACKUP_APP_PASS;
      if (!appPass) {
        appPass = await ask('Gmail App Password (16 chars, no spaces): ', true);
      }
      authValue = appPass;
      secrets.appPass = appPass;
    }
  } else {
    let pass = secrets.pass || process.env.EMAIL_PASS;
    if (!pass) {
      pass = await ask('Gmail / App Password: ', true);
    }
    authValue = pass;
    secrets.pass = pass;
  }

  saveSecrets(secrets);
  return { email, encPass, authType, authValue };
}

// ─────────────────────────────
// LOAD SEQUELIZE
// ─────────────────────────────
async function loadSequelize() {
  try {
    const seqPath = path.join(process.cwd(), 'config', 'createTablesetdb.mjs');
    if (!fs.existsSync(seqPath)) throw new Error(`Sequelize config not found: ${seqPath}`);
    const url = pathToFileURL(seqPath).href;
    const mod = await import(url);
    if (!mod.sequelize) throw new Error('Sequelize instance not exported');
    return mod.sequelize;
  } catch (err) {
    log(`Sequelize load failed: ${err.message}`, 'ERROR');
    throw err;
  }
}

// ─────────────────────────────
// INTERVAL
// ─────────────────────────────
function parseInterval(str = '60sec') {
  str = str.trim().toLowerCase();
  if (/^\d+$/.test(str)) return Number(str) * 1000;
  const match = str.match(/^(\d+)(sec|min|hr|hrs|hour|hours|day|days)?$/);
  if (!match) throw new Error(`Invalid interval: ${str}. Example: 30min`);
  const num = Number(match[1]);
  const unit = match[2] || 'sec';
  const map = { sec:1000, min:60000, hr:3600000, hrs:3600000, hour:3600000, hours:3600000, day:86400000, days:86400000 };
  return num * (map[unit] || 1000);
}

// ─────────────────────────────
// DUMP DATABASE
// ─────────────────────────────
async function sequelizeDumpToSql(config) {
  const sequelize = await loadSequelize();
  const dir = config.outputDir || path.join(BACKUP_ROOT, config.dbName);
  fs.mkdirSync(dir, { recursive: true });

  const ts = new Date().toISOString().replace(/[:.T]/g, '-');
  const sqlFile = path.join(dir, `${config.dbName}-${ts}.sql`);

  log(`Starting dump → ${path.basename(sqlFile)}`);

  let sql = `-- MWALA Backup\n-- DB: ${config.dbName}\n-- ${new Date().toISOString()}\n\nSET FOREIGN_KEY_CHECKS=0;\n\n`;

  try {
    const [tables] = await sequelize.query('SHOW TABLES');
    const tableNames = tables.map(r => Object.values(r)[0]);

    for (const table of tableNames) {
      const [[create]] = await sequelize.query(`SHOW CREATE TABLE \`${table}\``);
      sql += `${create['Create Table']};\n\n`;

      const [rows] = await sequelize.query(`SELECT * FROM \`${table}\``);
      if (rows.length > 0) {
        sql += `INSERT INTO \`${table}\` VALUES\n`;
        const values = rows.map(row => `(${Object.values(row).map(v => sequelize.escape(v)).join(', ')})`).join(',\n');
        sql += `${values};\n\n`;
      }
    }

    sql += 'SET FOREIGN_KEY_CHECKS=1;\n';

    fs.writeFileSync(sqlFile, sql, 'utf-8');
    const sizeMB = (fs.statSync(sqlFile).size / 1024 / 1024).toFixed(2);
    log(`Dump created: ${path.basename(sqlFile)} (${sizeMB} MB)`);
    return sqlFile;
  } catch (err) {
    log(`Dump failed: ${err.message}`, 'ERROR');
    throw err;
  }
}

// ─────────────────────────────
// ENCRYPT
// ─────────────────────────────
async function encryptFile(inputPath, password) {
  try {
    const encPath = inputPath + '.enc';
    const iv = crypto.randomBytes(12);
    const salt = Buffer.from('mwala-salt-2026');
    const key = crypto.scryptSync(password, salt, 32);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

    const input = fs.createReadStream(inputPath);
    const output = fs.createWriteStream(encPath);

    input.pipe(cipher).pipe(output);

    await new Promise((res, rej) => {
      output.on('finish', res);
      output.on('error', rej);
      cipher.on('error', rej);
      input.on('error', rej);
    });

    fs.writeFileSync(encPath + '.iv', iv);
    fs.writeFileSync(encPath + '.tag', cipher.getAuthTag());
    fs.unlinkSync(inputPath);

    log(`Encrypted → ${path.basename(encPath)}`);
    return encPath;
  } catch (err) {
    log(`Encryption failed: ${err.message}`, 'ERROR');
    throw err;
  }
}

// ─────────────────────────────
// SEND EMAIL
// ─────────────────────────────
async function sendEmail(creds, filePath, dbName) {
  const MAX_RETRIES = 3;
  let attempt = 0;
  let lastError;

  while (attempt < MAX_RETRIES) {
    attempt++;
    try {
      log(`SMTP attempt ${attempt}/${MAX_RETRIES}`);

      const addresses = await dns.resolve4('smtp.gmail.com').catch(() => []);
      if (addresses.length) log(`Resolved IPv4: ${addresses.slice(0,3).join(', ')}...`);

      let config = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        family: 4,
        connectionTimeout: 10000,
        greetingTimeout: 5000,
        socketTimeout: 15000,
        auth: {}
      };

      if (creds.authType === 'oauth2') {
        config.auth = creds.authValue;
        log('Using OAuth2');
      } else {
        config.auth = { user: creds.email, pass: creds.authValue };
        log('Using App/Password');
      }

      if (detectEnvironment() === 'insecure') {
        config.tls = { rejectUnauthorized: false };
        log('TLS validation disabled (insecure env)');
      }

      const transporter = nodemailer.createTransport(config);

      try {
        await transporter.verify();
        log('SMTP connection verified');
      } catch (vErr) {
        log(`Verify warning (non-fatal): ${vErr.message}`, 'WARN');
      }

      const filename = path.basename(filePath);
      const sizeMB = (fs.statSync(filePath).size / 1024 / 1024).toFixed(2);

      await transporter.sendMail({
        from: creds.email,
        to: creds.email,
        subject: `MWALA Encrypted Backup: ${dbName} (${new Date().toLocaleString()})`,
        text: `Backup sent.\nSize: ${sizeMB} MB\n\nDecrypt:\n  mwala autodb-backup decrypt "${filename}"\n\nAfter decrypt: mysql -u root -p your_db < file.decrypted.sql`,
        attachments: [{ filename, path: filePath }]
      });

      log(`Email sent: ${filename}`);
      return;
    } catch (err) {
      lastError = err;
      log(`SMTP attempt ${attempt} failed: ${err.code || err.message}`, 'ERROR');

      if (['ECONNREFUSED', 'ETIMEDOUT', 'EHOSTUNREACH'].includes(err.code)) {
        await new Promise(r => setTimeout(r, 3000 * attempt));
        continue;
      }

      break;
    }
  }

  let msg = lastError?.message || 'Unknown';
  let tip = '';

  if (lastError?.code === 'EAUTH') tip = 'Wrong credentials. Use App Password (2FA required) or OAuth2.';
  if (lastError?.code === 'ECONNREFUSED') tip = 'Connection refused. Check firewall/port 465/587.';
  if (lastError?.code?.includes('CERT')) tip = 'Certificate issue – antivirus scanning?';

  throw new Error(`Email failed after ${attempt} tries: ${msg}\nTip: ${tip}`);
}

// ─────────────────────────────
// BACKUP CYCLE – live status in log
// ─────────────────────────────
async function performBackup() {
  const start = new Date().toISOString();
  log(`BACKUP STARTED ── ${start}`);

  try {
    if (!fs.existsSync(CONFIG_FILE)) throw new Error('Config missing – run init');

    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    const creds = await getCredentials();

    const sqlPath = await sequelizeDumpToSql(config);
    const encPath = await encryptFile(sqlPath, creds.encPass);
    await sendEmail(creds, encPath, config.dbName);

    const duration = ((Date.now() - new Date(start)) / 1000).toFixed(1);
    log(`BACKUP FINISHED SUCCESSFULLY ── took ${duration}s`);
  } catch (err) {
    log(`BACKUP FAILED: ${err.message}\n${err.stack}`, 'ERROR');
  }
}

// ─────────────────────────────
// CONTROLS
// ─────────────────────────────
let backupInterval = null;

export const startAutoBackup = async () => {
  if (backupInterval) return log('Already running');

  if (!fs.existsSync(CONFIG_FILE)) {
    console.log('Run: mwala autodb-backup init');
    return;
  }

  const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
  log(`Starting auto-backup every ${Math.round(config.interval / 1000)} seconds`);

  backupInterval = setInterval(performBackup, config.interval);
  await performBackup();

  try { fs.writeFileSync(PID_FILE, process.pid.toString()); } catch {}
};

export const stopAutoBackup = () => {
  if (backupInterval) {
    clearInterval(backupInterval);
    backupInterval = null;
    if (fs.existsSync(PID_FILE)) fs.unlinkSync(PID_FILE);
    log('Auto-backup STOPPED');
    console.log('Stopped');
  }
};

// ─────────────────────────────
// INIT
// ─────────────────────────────
export const init = async () => {
  console.log('MWALA AUTO BACKUP SETUP');

  let dbName;
  try {
    const seq = await loadSequelize();
    dbName = seq.config.database;
    log(`Detected DB: ${dbName}`);
  } catch {
    dbName = await ask('Database name: ');
  }

  if (!dbName?.trim()) return console.log('DB name required');

  await getCredentials();

  const intervalStr = await ask('Interval (e.g. 60sec, 30min) [60sec]: ') || '60sec';
  let interval;
  try { interval = parseInterval(intervalStr); } catch {
    console.log('Invalid interval → using 60 seconds');
    interval = 60000;
  }

  const config = {
    provider: 'email',
    type: 'mysql',
    dbName,
    interval,
    outputDir: path.join(BACKUP_ROOT, dbName),
    createdAt: new Date().toISOString(),
    encrypted: true
  };

  fs.mkdirSync(config.outputDir, { recursive: true });
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));

  console.log('Config saved:', config);

  const startNow = (await ask('Start now? yes/no [yes]: ') || 'yes').toLowerCase();
  if (startNow === 'yes' || startNow === 'y') await startAutoBackup();
};

// ─────────────────────────────
// DECRYPT – very clear instructions
// ─────────────────────────────
export async function decryptFile(encFile) {
  if (!encFile?.endsWith('.enc')) {
    console.log('Error: File must end with .enc');
    console.log('Example: mwala autodb-backup decrypt mwala-2026-03-22.sql.enc');
    return;
  }

  try {
    const creds = await getCredentials();
    const iv = fs.readFileSync(encFile + '.iv');
    const tag = fs.readFileSync(encFile + '.tag');
    const key = crypto.scryptSync(creds.encPass, 'mwala-salt-2026', 32);

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);

    const outFile = encFile.replace('.enc', '.decrypted.sql');
    fs.createReadStream(encFile).pipe(decipher).pipe(fs.createWriteStream(outFile));

    await new Promise((res, rej) => {
      decipher.on('finish', res);
      decipher.on('error', rej);
    });

    log(`Decrypted → ${outFile}`);
    console.log(`
═══════════════════════════════════════════════════════
          MWALA BACKUP DECRYPTED SUCCESSFULLY
═══════════════════════════════════════════════════════

Decrypted file: ${outFile}

To restore to MySQL database:
1. Open terminal / command prompt
2. Run this exact command:

   mysql -u root -p your_database_name < "${outFile}"

   • Replace your_database_name with your actual DB name (e.g. mwala)
   • When asked, enter your MySQL root password

Tips:
• Make sure .iv and .tag files are in the same folder as .enc
• Wrong encryption password → decryption will fail
• After import you can delete .decrypted.sql for security

Live logs always here: ${LOG_FILE}
    `);
  } catch (err) {
    console.log(`Decryption failed: ${err.message}`);
    console.log('Common fixes:');
    console.log('• Wrong encryption password');
    console.log('• Missing .iv or .tag file');
    console.log('• File corrupted');
  }
}

export async function decryptFolder(folder) {
  if (!fs.existsSync(folder) || !fs.statSync(folder).isDirectory()) {
    console.log('Error: Not a valid folder');
    return;
  }

  const files = fs.readdirSync(folder).filter(f => f.endsWith('.enc'));
  if (!files.length) return console.log('No .enc files found');

  console.log(`Decrypting ${files.length} files in ${folder}...`);

  for (const f of files) {
    console.log(`  → ${f}`);
    await decryptFile(path.join(folder, f));
  }

  console.log('Folder decryption finished');
}

// ─────────────────────────────
// STATUS & LOGS
// ─────────────────────────────
export const backupStatus = () => {
  console.log('MWALA Auto Backup Status:');
  console.log('  Running:      ', !!backupInterval);
  console.log('  PID:          ', fs.existsSync(PID_FILE) ? fs.readFileSync(PID_FILE, 'utf-8').trim() : 'none');
  console.log('  Config:       ', fs.existsSync(CONFIG_FILE) ? 'yes' : 'no');
  console.log('  Secrets:      ', fs.existsSync(SECRETS_FILE) ? 'yes' : 'no');
  console.log('  Environment:  ', detectEnvironment().toUpperCase());
  console.log('  Live log:     ', LOG_FILE);
};

export const backupLogs = () => {
  if (fs.existsSync(LOG_FILE)) {
    console.log(fs.readFileSync(LOG_FILE, 'utf-8'));
  } else {
    console.log('No log file yet. Start backup first.');
  }
  console.log('\nReal-time tail:   tail -f mwala-autobackup-live.log');
  console.log('PM2 logs (if used): pm2 logs mwala-autobackup');
};