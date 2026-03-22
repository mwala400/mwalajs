Here is the **corrected and simplified version** — **no PM2 code inside your backup module or command handler**.

Instead:
- You run PM2 **manually from the terminal** (as you want)
- The script **only runs in foreground** when you type commands
- To make it persistent (survive Ctrl+C, logout, reboot), you **start it via PM2 from terminal** once

### Final command handler block for `bin/mwala.mjs`

Replace your existing `case 'autodb-backup':` block with this clean version:

```javascript
case 'autodb-backup':
case 'autobackup': {
  const action = args[1]?.toLowerCase() || '';
  let mod;

  try {
    mod = await import('../config/autodb-backup-email.mjs');
  } catch (e) {
    console.error('Failed to load backup module:', e.message);
    process.exit(1);
  }

  if (action === 'init') {
    await mod.init();
  } else if (action === 'start') {
    console.log('Starting MWALA database auto-backup in foreground mode');
    console.log('Note: This will run until you press Ctrl+C');
    console.log('For persistent background running (recommended on VPS):');
    console.log('  1. npm install -g pm2');
    console.log('  2. pm2 start "mwala autodb-backup start" --name mwala-db-autobackup');
    console.log('  3. pm2 save                     (auto-start after reboot)');
    console.log('  4. pm2 startup                  (follow the printed command)');
    await mod.startAutoBackup();
  } else if (action === 'stop') {
    mod.stopAutoBackup();
  } else if (action === 'status') {
    mod.backupStatus();
  } else if (action === 'logs') {
    mod.backupLogs();
  } else if (action === 'decrypt' || action === 'decrypt:backupfile') {
    const file = args[2];
    if (!file) {
      console.log('Usage: mwala autodb-backup decrypt <file.enc>');
      return;
    }
    await mod.decryptFile(file);
  } else if (action === 'decrypt:folder') {
    const folder = args[2];
    if (!folder) {
      console.log('Usage: mwala autodb-backup decrypt:folder <folder>');
      return;
    }
    await mod.decryptFolder(folder);
  } else {
    console.log(`
MWALA Database Auto Backup Commands (English):

  mwala autodb-backup init                Setup backup (email, password, interval)
  mwala autodb-backup start               Start backup (runs in this terminal)
  mwala autodb-backup stop                Stop backup
  mwala autodb-backup status              Show current status
  mwala autodb-backup logs                Show log file content
  mwala autodb-backup decrypt <file.enc>  Decrypt one backup file
  mwala autodb-backup decrypt:folder <dir> Decrypt all .enc files in folder

To run persistently in background (survives Ctrl+C, logout, reboot):
  npm install -g pm2                           # Install once
  pm2 start "mwala autodb-backup start" --name mwala-db-autobackup
  pm2 save                                     # Save for auto-restart on reboot
  pm2 startup                                  # Follow the command it prints (system service)

Useful PM2 commands:
  pm2 logs mwala-db-autobackup                 # Live logs
  pm2 monit                                    # Real-time monitor
  pm2 stop mwala-db-autobackup                 # Stop
  pm2 restart mwala-db-autobackup              # Restart
  pm2 list                                     # Show all processes

Live log file (current directory): mwala-autobackup-live.log
    `);
  }
  break;
}
```

### How to use it now (as you wanted — PM2 from terminal only)

1. **Install PM2 once** (on your VPS or machine):
   ```bash
   npm install -g pm2
   ```

2. **Setup backup if not done**:
   ```bash
   mwala autodb-backup init
   ```

3. **Start persistent backup from terminal** (this is the key command you want):
   ```bash
   pm2 start "mwala autodb-backup start" --name mwala-db-autobackup
   ```

   → This runs your `start` command inside PM2
   → It survives Ctrl+C, terminal close, logout

4. **Make it auto-start after reboot** (run once):
   ```bash
   pm2 save
   pm2 startup
   ```
   → `pm2 startup` will print a command like `sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u youruser --hp /home/youruser` — copy & run it.

5. **Monitor & control**:
   ```bash
   pm2 logs mwala-db-autobackup     # live logs
   pm2 status                       # check if running
   pm2 stop mwala-db-autobackup     # stop
   pm2 restart mwala-db-autobackup  # restart
   ```

Now:
- When you run `mwala autodb-backup start` directly → it runs in foreground (stops on Ctrl+C)
- But **you don't need to run it directly anymore** — use the PM2 command above for production
- The script itself has **no PM2 logic inside** — clean and simple

This matches exactly what you asked: **PM2 runs from terminal, not embedded in code**. Let me know if you want to adjust the process name or add more PM2 flags.