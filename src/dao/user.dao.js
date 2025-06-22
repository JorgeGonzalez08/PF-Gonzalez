import { userModel } from "./model/userModel.js";

class UserDao{
    async findById(id){
        return await userModel.findById(id)
    }

    async findOne(query){
        return await userModel.findOne(query)
    }

    async save(userData){
        const user = new userModel(userData)
        return await user.save();
    }
}

export default new UserDao();