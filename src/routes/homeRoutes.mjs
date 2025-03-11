import mwalajs from 'mwalajs';
import { homeController } from '../controllers/homeController.mjs';

const router = mwalajs.constructor.Router(); // Corrected Router usage

router.get('/', homeController.getHomePage);

export { router as homeRoutes };
