import { Router } from 'express';
import AppointmentController from '../controllers/AppointmentsController';

import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticated';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);


// appointmentsRouter.get('/', async (req, res) => {
//   return res.json(await appointmentsRepository.find());
// });

appointmentsRouter.post('/', AppointmentController.create);

export default appointmentsRouter;
