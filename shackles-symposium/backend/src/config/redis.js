const redis = require('redis');
const { promisify } = require('util');

let redisClient;

const connectRedis = async () => {
  try {
    redisClient = redis.createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      retry_strategy: (options) => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          return new Error('Redis server refused connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          return new Error('Redis retry time exhausted');
        }
        if (options.attempt > 10) {
          return undefined;
        }
        return Math.min(options.attempt * 100, 3000);
      }
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis connected successfully'.green);
    });

    redisClient.on('error', (err) => {
      console.error('❌ Redis error:', err.message.red);
    });

    redisClient.on('ready', () => {
      console.log('✅ Redis is ready to use'.cyan);
    });

    return redisClient;
  } catch (error) {
    console.error('❌ Redis connection error:', error.message.red);
    return null;
  }
};

// Promisify Redis methods
const getAsync = redisClient ? promisify(redisClient.get).bind(redisClient) : null;
const setAsync = redisClient ? promisify(redisClient.set).bind(redisClient) : null;
const delAsync = redisClient ? promisify(redisClient.del).bind(redisClient) : null;
const keysAsync = redisClient ? promisify(redisClient.keys).bind(redisClient) : null;

// Cache helper functions
const cache = {
  get: async (key) => {
    if (!redisClient) return null;
    try {
      const data = await getAsync(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Cache get error:', error.message);
      return null;
    }
  },

  set: async (key, value, expiresIn = 3600) => {
    if (!redisClient) return false;
    try {
      await setAsync(key, JSON.stringify(value), 'EX', expiresIn);
      return true;
    } catch (error) {
      console.error('Cache set error:', error.message);
      return false;
    }
  },

  del: async (key) => {
    if (!redisClient) return false;
    try {
      await delAsync(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error.message);
      return false;
    }
  },

  clear: async (pattern = '*') => {
    if (!redisClient) return false;
    try {
      const keys = await keysAsync(pattern);
      if (keys.length > 0) {
        await delAsync(...keys);
      }
      return true;
    } catch (error) {
      console.error('Cache clear error:', error.message);
      return false;
    }
  }
};

module.exports = {
  connectRedis,
  redisClient,
  cache,
  getAsync,
  setAsync,
  delAsync,
  keysAsync
};
