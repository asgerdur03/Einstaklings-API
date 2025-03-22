import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'

const app = new Hono()

app.get('/', (c) => {
  const routes = app.routes.map((route) => [
    route.path,
    route.method
  ])
  return c.json(routes)
})


app.route('/users', userRoutes);
app.route('/posts', postRoutes);

serve({
  fetch: app.fetch,
  port: 5000
  //3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
