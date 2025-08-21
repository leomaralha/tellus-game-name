module.exports = {
  apps: [
    {
      name: 'tellus-app',
      script: 'dist/main.js',
      instances: process.env.PM2_INSTANCES || 2, 
      exec_mode: 'cluster',
      watch: true,
      ignore_watch: [
        'node_modules',
        'logs',
        '*.log',
        'test',
        'coverage'
      ],
      watch_options: {
        followSymlinks: false,
        usePolling: true,
        interval: 1000
      },
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '1G',
      log_file: 'logs/combined.log',
      out_file: 'logs/out.log',
      error_file: 'logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      kill_timeout: 5000,
      listen_timeout: 8000,
      shutdown_with_message: true,
      autorestart: true,
      merge_logs: true,
      wait_ready: true
    }
  ]
};
