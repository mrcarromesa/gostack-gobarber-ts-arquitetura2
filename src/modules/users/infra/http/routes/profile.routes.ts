import { Router } from 'express';
import ensureAuthenticated from '../middleware/ensureAuthenticated';
import ProfileController from '../controllers/ProfileController';

const profileRouter = Router();

profileRouter.use(ensureAuthenticated);

profileRouter.get('/', ProfileController.show);
profileRouter.put('/', ProfileController.update);

export default profileRouter;
