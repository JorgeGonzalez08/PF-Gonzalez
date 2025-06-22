import UserDao from '../dao/user.dao.js'

class UserRepository{
    async createUser(userData){
        return await UserDao.save(userData)
    }

    async getUserById(id){
        return await UserDao.findById(id)
    }
    async getUserByUser(first_name){
        return await UserDao.findOne({first_name})
    }
    async getUserByEmail(email){
        return await UserDao.findOne({email})
    }
}

export default new UserRepository();