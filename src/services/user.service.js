import { createHash, isValidPassword } from '../utils.js';
import UserRepository from '../repositories/user.repository.js';
import CartService from './cart.service.js';

class UserService {
  async registerUser(userData) {
    const existe = await UserRepository.getUserByEmail(userData.email);
    if (existe) {
      throw new Error('El usuario ya existe');
    }

    userData.password = createHash(userData.password);
    const newCart = await CartService.create();
    return await UserRepository.createUser({ ...userData, cart: newCart });
  }
  async loginUser(userName, password) {
    const user = await UserRepository.getUserByUser(userName);
    if (!user || !isValidPassword(password, user)) {
      throw new Error('Invalid credentials');
    }
    return user;
  }
}

export default new UserService();
