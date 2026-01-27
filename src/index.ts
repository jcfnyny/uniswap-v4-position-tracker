import 'reflect-metadata';
import app from './app';
import config from './config';
import logger from './utils/logger';
import { initializeDatabase } from './config/database';

async function startServer(): Promise<void> {
  try {
    // Initialize database
    await initializeDatabase();

    // Start server
    app.listen(config.port, () => {
      logger.info('=================================');
      logger.info(`🚀 Server running on port ${config.port}`);
      logger.info(`📝 Environment: ${config.env}`);
      logger.info(`🔗 Health check: http://localhost:${config.port}/health`);
      logger.info(`📍 Position Manager: ${config.contracts.positionManager}`);
      logger.info(`📍 State View: ${config.contracts.stateView}`);
      logger.info('=================================');
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: any) => {
  logger.error('Unhandled Rejection:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer();
