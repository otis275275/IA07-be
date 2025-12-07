import AuthRouter from './auth.js';
import homeRouter from './home.js'
import UserRouter from './user.js';
import HomeRouter from './home.js';
export default function routes(app) {
    // Define your routes here
    app.use('/api/auth', AuthRouter)
    app.use('/api', UserRouter)
    app.use('/', HomeRouter);
}