import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticated';
import AppointmentController from '../controllers/AppointmentsController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

// appointmentsRouter.get('/', async (req, res) => {
//   return res.json(await appointmentsRepository.find());
// });

appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date(),
    },
  }),
  AppointmentController.create,
);
appointmentsRouter.get('/me', ProviderAppointmentsController.index);

export default appointmentsRouter;
