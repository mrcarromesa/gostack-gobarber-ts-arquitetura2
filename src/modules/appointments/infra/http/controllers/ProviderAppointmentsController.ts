import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

class ProviderAppointmentsController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { day, month, year } = req.query;

    const { id } = req.user;

    const listProviderAppointment = container.resolve(
      ListProviderAppointmentsService,
    );

    const appointments = await listProviderAppointment.execute({
      provider_id: id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });
    return res.json(appointments);
  }
}

export default new ProviderAppointmentsController();
