module.exports = {
  apps: [
    {
      name: 'dwp',
      script: '/app/node/dwp/server.js',
      cwd: '/app/node/dwp',
      interpreter: '/home/nodejs/.nvm/versions/node/v18.20.5/bin/node',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      },
      error_file: '/home/nodejs/.pm2/logs/dwp-error.log',
      out_file: '/home/nodejs/.pm2/logs/dwp-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    },
    {
      name: 'qsearch',
      script: '/app/node/qsearch/server.js',
      cwd: '/app/node/qsearch',
      interpreter: '/home/nodejs/.nvm/versions/node/v18.20.5/bin/node',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      },
      error_file: '/home/nodejs/.pm2/logs/qsearch-error.log',
      out_file: '/home/nodejs/.pm2/logs/qsearch-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    },
    {
      name: 'restsvr',
      script: '/app/node/restserver/index.js',
      cwd: '/app/node/restserver',
      interpreter: '/home/nodejs/.nvm/versions/node/v18.20.5/bin/node',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      max_restarts: 10,
      min_uptime: '10s',
      env: {
        NODE_ENV: 'production'
      },
      error_file: '/home/nodejs/.pm2/logs/restsvr-error.log',
      out_file: '/home/nodejs/.pm2/logs/restsvr-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    },
    {
      name: 'sapis',
      script: '/app/node/sapis/src/app.js',
      cwd: '/app/node/sapis',
      interpreter: '/home/nodejs/.nvm/versions/node/v14.17.1/bin/node',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production'
      },
      error_file: '/home/nodejs/.pm2/logs/sapis-error.log',
      out_file: '/home/nodejs/.pm2/logs/sapis-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    },
    {
      name: 'xcollab',
      script: '/app/node/xcollab/index.js',
      cwd: '/app/node/xcollab',
      interpreter: '/home/nodejs/.nvm/versions/node/v18.20.5/bin/node',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production'
      },
      error_file: '/home/nodejs/.pm2/logs/xcollab-error.log',
      out_file: '/home/nodejs/.pm2/logs/xcollab-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    },
    {
      name: 'xpdf',
      script: '/app/node/xpdf/index.js',
      cwd: '/app/node/xpdf',
      interpreter: '/home/nodejs/.nvm/versions/node/v18.20.5/bin/node',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production'
      },
      error_file: '/home/nodejs/.pm2/logs/xpdf-error.log',
      out_file: '/home/nodejs/.pm2/logs/xpdf-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    },
    {
      name: 'xwebchat',
      script: '/app/node/xwebchat/index.js',
      cwd: '/app/node/xwebchat',
      interpreter: '/home/nodejs/.nvm/versions/node/v18.20.5/bin/node',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production'
      },
      error_file: '/home/nodejs/.pm2/logs/xwebchat-error.log',
      out_file: '/home/nodejs/.pm2/logs/xwebchat-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    },
    {
      name: 'wlst',
      script: '/app/node/wlst/node_modules/.bin/next',
      args: 'dev --turbo -p 3020',
      cwd: '/app/node/wlst',
      interpreter: '/home/nodejs/.nvm/versions/node/v20.19.6/bin/node',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '2G',
      env: {
        NODE_ENV: 'development',
        PORT: 3020,
        NODE_OPTIONS: '--max-old-space-size=4096'
      },
      error_file: '/home/nodejs/.pm2/logs/wlst-error.log',
      out_file: '/home/nodejs/.pm2/logs/wlst-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    }
  ]
};
