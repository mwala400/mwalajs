module.exports = {
  apps: [
    {
      name: "mwala-db-autobackup",
      script: "./bin/mwala.mjs",
      args: "autodb-backup start",

      interpreter: "node",
      exec_mode: "fork",

      watch: false,
      autorestart: true,
      max_memory_restart: "300M",
      restart_delay: 5000,

      env: {
        NODE_ENV: "production"
      },

      error_file: "./logs/autobackup-error.log",
      out_file: "./logs/autobackup-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss"
    }
  ]
};