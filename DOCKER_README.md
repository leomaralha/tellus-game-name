# Tellus Game Name - Docker Setup

This project includes a complete Docker setup with NestJS, PostgreSQL, Redis, and PM2 for process management.

## Services

- **NestJS App**: Main application running with PM2 in cluster mode
- **PostgreSQL**: Database server with initialization scripts
- **Redis**: In-memory data store for caching and sessions
- **Adminer**: Database administration tool (accessible at http://localhost:8080)

## Quick Start

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Start all services:**
   ```bash
   npm run docker:up
   ```

3. **Access the application:**
   - Application: http://localhost:3000
   - PostgreSQL: localhost:5432
   - Redis: localhost:6379

## Available Scripts

### Docker Commands
- `npm run docker:up` - Start all services in detached mode
- `npm run docker:down` - Stop all services
- `npm run docker:build` - Rebuild the application container
- `npm run docker:logs` - View logs from all services
- `npm run docker:restart` - Restart the application container

### PM2 Commands (for local development)
- `npm run start:pm2` - Start application with PM2
- `npm run stop:pm2` - Stop PM2 processes
- `npm run restart:pm2` - Restart PM2 processes
- `npm run delete:pm2` - Delete PM2 processes
- `npm run logs:pm2` - View PM2 logs
- `npm run monit:pm2` - PM2 monitoring dashboard

## PM2 Configuration

The PM2 configuration is in `ecosystem.config.js`. You can customize:

- **Number of instances**: Set `PM2_INSTANCES` environment variable or modify the config file
- **Memory limits**: Adjust `max_memory_restart`
- **Watch options**: Configure file watching for development
- **Logging**: Customize log files and formats

### Scaling Instances

To change the number of PM2 instances:

1. **Via environment variable:**
   ```bash
   export PM2_INSTANCES=4
   npm run docker:restart
   ```

2. **Via ecosystem.config.js:**
   ```javascript
   instances: 4, // Change this number
   ```

## Database

### Connection Details
- Host: `postgres` (in Docker) or `localhost` (local)
- Port: `5432`
- Database: `tellus_db`
- Username: `tellus`
- Password: `tellus123`

### Adminer Access
- URL: http://localhost:8080
- System: PostgreSQL
- Server: postgres
- Username: tellus
- Password: tellus123
- Database: tellus_db

## Redis

Redis is available at:
- Host: `redis` (in Docker) or `localhost` (local)
- Port: `6379`

## Development

### File Watching
The Docker setup includes volume mounting for real-time code changes:
- Source code changes are automatically reflected
- PM2 watches for file changes and restarts processes
- No need to rebuild the container for code changes

### Debugging
To enable debugging:
1. Modify the Dockerfile.dev to expose debug port
2. Add debug configuration to ecosystem.config.js
3. Use your IDE's remote debugging features

## Production Considerations

For production deployment:
1. Create a separate `Dockerfile.prod`
2. Use multi-stage builds for smaller images
3. Set appropriate environment variables
4. Configure proper logging and monitoring
5. Use secrets management for sensitive data
6. Set up health checks

## Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 3000, 5432, 6379, and 8080 are available
2. **Permission issues**: Ensure Docker has proper permissions
3. **Memory issues**: Adjust PM2 memory limits in ecosystem.config.js

### Logs
- Application logs: `npm run docker:logs`
- PM2 logs: Check `logs/` directory
- Database logs: `docker-compose logs postgres`
- Redis logs: `docker-compose logs redis`

### Reset Everything
```bash
npm run docker:down
docker volume prune
npm run docker:up
```
