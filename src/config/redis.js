const Redis = require('ioredis');

let redis;

const connectRedis = () => {
  try {
    redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      retryStrategy: (times) => {
        if (times > 3) {
          console.log('Redis connection failed - running without cache');
          return null;
        }
        return Math.min(times * 50, 2000);
      },
      lazyConnect: true
    });

    redis.on('connect', () => {
      console.log('Redis Connected!');
    });

    redis.on('error', (err) => {
      console.log('Redis Error - running without cache:', err.message);
    });

  } catch (error) {
    console.log('Redis not available - running without cache');
  }

  return redis;
};

const getRedis = () => redis;

module.exports = { connectRedis, getRedis };