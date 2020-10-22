import { Router } from 'express';
import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticated';
import AppointmentController from '../controllers/AppointmentsController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

// appointmentsRouter.get('/', async (req, res) => {
//   return res.json(await appointmentsRepository.find());
// });

appointmentsRouter.post('/', AppointmentController.create);
appointmentsRouter.get('/me', ProviderAppointmentsController.index);

export default appointmentsRouter;
