import mwalajs from 'mwalajs';
import { manController } from '../controllers/manController.mjs';
const router = mwalajs.Router();
router.get('/', manController.getmanPage);
export { router as manRoute };