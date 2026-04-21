import { env } from '@repo/env/server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import onError from '@repo/server-utils/handlers/error';
import notFound from '@repo/server-utils/handlers/not-found';
import createAuth from '@repo/auth';
import getDbInstance from '@repo/db/adapter';
import { validateUser } from '@repo/auth/middleware';

// File controllers
import { fileUploadUrl, saveFile, saveFolder, getItems, deleteFile, deleteFolder } from '@/controllers/fileController';

// Share controllers
import { shareItem, getSharedWithMe, getSharesForItem, revokeShare, searchUsers } from '@/controllers/sharefileController';

// Middlewares
import { validatePermissions } from './middlewares/fileaccess';


const app = new Hono();

const dbInstance = await getDbInstance(env.DATABASE_URL);
const auth = createAuth({
  adapter: dbInstance,
  jwtSecret: env.JWT_SECRET,
});

app.use(
  '/api/*',
  cors({
    origin: env.ALLOWED_ORIGINS,
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  }),
);

// Auth routes (public — login, signup, etc.)
app.route('/api/auth', auth);

// Auth middleware for all /api/files/* routes
app.use('/api/files/*', validateUser(dbInstance));

// File routes
app.post('/api/files/file-upload', validatePermissions('create'), fileUploadUrl);
app.post('/api/files/save-file', validatePermissions('create'), saveFile);
app.post('/api/files/save-folder', validatePermissions('create'), saveFolder);
app.get('/api/files/get-items', validatePermissions('read'), getItems);
app.delete('/api/files/delete-file', validatePermissions('delete'), deleteFile);
app.delete('/api/files/delete-folder', validatePermissions('delete'), deleteFolder);

// Share routes
app.post('/api/files/share', shareItem);
app.get('/api/files/shared-with-me', getSharedWithMe);
app.get('/api/files/shares/:itemId', getSharesForItem);
app.delete('/api/files/share/:shareId', revokeShare);
app.get('/api/files/search-users', searchUsers);

app.get('/', (c) => {
  return c.text('API server is running');
});


app.notFound(notFound);
app.onError(onError);

export default app;


