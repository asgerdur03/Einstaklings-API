import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'
import { cors } from 'hono/cors'
import { prettyJSON } from 'hono/pretty-json'
import commentRoutes from './routes/commentRoutes.js'
import likeRoutes from './routes/likeRoutes.js'

const PORT = process.env.PORT || '5000'
const port = Number.parseInt(PORT, 10)

const app = new Hono()
app.use(prettyJSON())
app.use('/*', cors({origin: '*'}))
app.notFound((c) => c.json({ error: 'Not found' }, 404));
app.onError((err,c) => {
  console.error(err.name, err.message);

  if (err.name === 'Malformed JSON in request body') {
    return c.json({ error: 'Invalid JSON' }, 400);
  }

  return c.json({ error: 'internal server error' }, 500);
});


app.get('/', (c) => {
  const routes = app.routes.map((route) => [
    route.path,
    route.method
  ])
  return c.json(routes)
})


app.route('/users', userRoutes);
app.route('/posts', postRoutes);
app.route('/comments', commentRoutes);
app.route('/likes', likeRoutes);

serve({
  fetch: app.fetch,
  port,
  //3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
