import { createClient } from 'redis';
import config from './config'
const client = createClient(config)
client.connect();
  
export const redisClient=client



