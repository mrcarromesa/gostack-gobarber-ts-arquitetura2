import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

class ProviderAppointmentsController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { day, month, year } = req.body;

    const { id } = req.user;

    const listProviderAppointment = container.resolve(
      ListProviderAppointmentsService,
    );

    const appointments = await listProviderAppointment.execute({
      provider_id: id,
      day,
      month,
      year,
    });
    return res.json(appointments);
  }
}

export default new ProviderAppointmentsController();
