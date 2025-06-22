import { processError } from '../utils.js';
import UserService from '../services/user.service.js';
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/user.dto.js';
import CartServices from '../services/cart.service.js';
import '../helpers/env.js';

class UserController {
  async register(req, res) {
    const { first_name, last_name, email, age, password } = req.body;
    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).json({ status: 'error', message: 'Invalid data' });
    }
    try {
      // const newCart = await CartServices.create();

      // const newUser = await UserService.registerUser({ first_name, last_name, email, age, password , cart:newCart })
      const newUser = await UserService.registerUser({
        first_name,
        last_name,
        email,
        age,
        password,
      });

      const token = jwt.sign(
        {
          user_name: newUser.first_name,
          email: newUser.email,
          rol: newUser.role,
          cart: newUser.cart,
        },
        process.env.SECRET_WORD,
        { expiresIn: '1h' }
      );
      // res.cookie(process.env.SECRET_COOKIE, token, {
      //   maxAge: 360000,
      //   httpOnly: true,
      // });
      if (req.headers.accept?.includes('application/json')) {
        res.cookie(process.env.SECRET_COOKIE, token, {
          maxAge: 360000,
          httpOnly: true,
        });
        return res
          .status(201)
          .json({ status: 'success', message: 'User registered' });
      } else {
        res.cookie(process.env.SECRET_COOKIE, token, {
          maxAge: 360000,
          httpOnly: true,
        });
        res.redirect('/api/sessions/current');
      }
    } catch (error) {
      // processError(error, res);
      res.status(500).json({
        status: 'error',
        message: 'Fatal error',
      });
    }
  }

  async login(req, res) {
    const { first_name, password } = req.body;
    if (!first_name || !password) {
      return res.status(400).json({ status: 'error', message: 'Invalid data' });
    }
    try {
      const user = await UserService.loginUser(first_name, password);
      const tokenUser = jwt.sign(
        {
          user_name: user.first_name,
          email: user.email,
          rol: user.role,
          cart: user.cart,
        },
        process.env.SECRET_WORD,
        { expiresIn: '1h' }
      );
      if (req.headers.accept?.includes('application/json')) {
        res.cookie(process.env.SECRET_COOKIE, tokenUser, {
          httpOnly: true,
          maxAge: 3600000,
        });
        return res
          .status(200)
          .json({ status: 'success', message: 'Logged in' });
      } else {
        res.cookie(process.env.SECRET_COOKIE, tokenUser, {
          httpOnly: true,
          maxAge: 3600000,
        });
        res.redirect('/api/sessions/current');
      }
    } catch (error) {
      processError(error, res);
    }
  }

  async current(req, res) {
    if (req.user) {
      const user = req.user;
      const userDTO = new UserDTO(user);
      if (req.user.rol == 'admin') {
        return res.render('profile', { user: userDTO, isAdmin: true });
      }
      res.render('profile', { user: userDTO });
    } else {
      res.send('Acceso denegado');
    }
  }

  async currentJson(req, res) {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'No autorizado' });
    res.json({ status: 'success', payload: user });
  }

  async logout(req, res) {
    if (req.headers.accept?.includes('application/json')) {
      res.clearCookie('coderCookieToken');
      return res
        .status(200)
        .json({ status: 'success', message: 'logout successful' });
    } else {
      res.clearCookie('coderCookieToken');
      res.redirect('/login');
    }
  }
}

export default UserController;
