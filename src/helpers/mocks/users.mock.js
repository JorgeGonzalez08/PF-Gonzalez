import { faker } from "@faker-js/faker";

export const createMockUser = ()=>{
    // const code = faker.number.int({min:1000,max:9999})
    const first_name = faker.person.firstName()
    const last_name = faker.person.lastName()
    const email = faker.internet.email({firstName:first_name,lastName:last_name})
    const age = Number.parseInt(faker.commerce.price({min:18, max:80,dec:0}))
    const password = faker.internet.password({ length: 8 })
    
    const roles = ['user','admin']
    const role = roles[faker.number.int({min:0,max:1})]
    return {first_name,last_name,email,age,password,role}
}

export default createMockUser;