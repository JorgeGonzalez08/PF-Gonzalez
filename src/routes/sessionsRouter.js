import { Router } from 'express';
import passport from 'passport';

import UserController from '../controllers/user.controller.js';
const userController = new UserController();

export const sessionsRouter = Router();

sessionsRouter.post('/register', userController.register);
sessionsRouter.post('/login', userController.login);
sessionsRouter.get(
  '/current',
  passport.authenticate('current', { session: false }),
  userController.current
);
sessionsRouter.get(
  '/current/json',
  passport.authenticate('current', { session: false }),
  userController.currentJson
);
sessionsRouter.post('/logout', userController.logout);
