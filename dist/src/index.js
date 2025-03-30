import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';
import commentRoutes from './routes/commentRoutes.js';
import likeRoutes from './routes/likeRoutes.js';
const PORT = process.env.PORT || '5000';
const port = Number.parseInt(PORT, 10);
const app = new Hono();
app.use(prettyJSON());
app.use('/*', cors({ origin: '*' }));
app.notFound((c) => c.json({ error: 'Not found' }, 404));
app.onError((err, c) => {
    console.error(err.name, err.message);
    return c.json({ error: 'internal server error' }, 500);
});
app.get('/', (c) => {
    const routes = app.routes.map((route) => [
        route.path,
        route.method
    ]);
    return c.json(routes);
});
import { cloudinary } from './lib/cloudinary.js';
app.post('/upload', async (c) => {
    const body = await c.req.parseBody();
    const files = body.image;
    console.log("files: ", files);
    if (!files || (Array.isArray(files) && files.length === 0)) {
        return c.json({ error: 'No files uploaded' }, 400);
    }
    const fileArray = Array.isArray(files) ? files : [files];
    const processedImages = await Promise.all(fileArray.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64 = buffer.toString('base64');
        const result = await cloudinary.uploader.upload(`data:${file.type};base64,${base64}`, {
            resource_type: 'image',
            folder: 'cats',
        });
        return {
            name: file.name,
            size: file.size,
            type: file.type,
            url: result.secure_url
        };
    }));
    return c.json({ image: processedImages });
});
app.route('/users', userRoutes);
app.route('/posts', postRoutes);
app.route('/comments', commentRoutes);
app.route('/likes', likeRoutes);
serve({
    fetch: app.fetch,
    port,
    //3000
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});
