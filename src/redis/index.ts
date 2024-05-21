import { createClient } from 'redis'
import config from './config'
const client = createClient(config)
client.connect()
client.on('error', (err) => {
    console.error('Redis error:', err)
})

client.on('connect', () => {
    console.log('Connected to Redis')
})

export const redisClient = client
