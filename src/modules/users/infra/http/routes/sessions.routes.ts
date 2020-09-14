import { Router } from 'express';
import AuthenticationUserService from '@modules/users/services/AuthenticationUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (req, res) => {
  const { email, password } = req.body;

  const authenticationUserSerivce = new AuthenticationUserService();
  const { user, token } = await authenticationUserSerivce.execute({
    email,
    password,
  });

  return res.json({ user, token });
});

export default sessionsRouter;
