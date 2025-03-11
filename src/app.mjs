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
mwalajs.static(path.join(__dirname, 'public'));

// Use routes
mwalajs.use('/', homeRoutes);

// Start server
const port = process.env.PORT || 3000;
mwalajs.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
