//app.mjs
import mwalajs from 'mwalajs';
import { homeRoutes } from './routes/homeRoutes.mjs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use mwalajs directly (it's an instance now)
mwalajs.set('view engine', 'ejs');
mwalajs.set('views', path.join(__dirname, 'views'));
// Serve static files correctly
mwalajs.useStatic(path.join(__dirname, 'public'));
// Use routes
mwalajs.use('/', homeRoutes);
mwalajs.use('/steps', homeRoutes);
mwalajs.use('/about', homeRoutes);
mwalajs.use('/welcome', homeRoutes);
mwalajs.get('/mwalajs-framework-documentation', (req, res) => {
  res.render('mwalajs-framework-documentation');
});

// Start server
const port = process.env.PORT || 2025;
mwalajs.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
