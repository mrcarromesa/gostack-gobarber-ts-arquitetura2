import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

class AppointmentsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { provider_id, date } = req.body;

    const { id } = req.user;

    const createAppointment = container.resolve(CreateAppointmentService);

    const appointment = await createAppointment.execute({
      provider_id,
      user_id: id,
      date,
    });
    return res.json(appointment);
  }
}

export default new AppointmentsController();
