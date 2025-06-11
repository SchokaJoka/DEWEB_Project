import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { readVotes, createVote } from './db.js'

const app = new Hono()

app.use('/api/*', cors())

app.get('/api/votes', async (c) => {
  const votes = readVotes();
  return c.json(votes);
})

app.post('/api/votes', async (c) => {
  const vote = await c.req.json();
  const updatedVotes = createVote(vote);
  return c.json(updatedVotes);
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
