import mwalajs from 'mwalajs';
import { homeController,Steps,welcome,about } from '../controllers/homeController.mjs';

const router = mwalajs.Router(); // Corrected Router usage

router.get('/', homeController.getHomePage);
router.get('/steps',Steps.getSteps);
router.get('/welcome',welcome.getwelcome);
router.get('/about',about.getabout);


export { router as homeRoutes };
