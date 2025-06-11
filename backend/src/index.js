import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'  

const app = new Hono()

app.use('/api/*', cors())

app.get('/api/ratings', async (c) => {
  const ratings = readRatings();
  return c.json(ratings);
})

app.post('/api/ratings', async (c) => {
  const rating = await c.req.json();
  createRating(rating);
  return c.json(rating);
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
