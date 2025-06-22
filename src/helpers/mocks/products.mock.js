import { faker } from "@faker-js/faker";

export const createMockProduct =()=>{
    // const code = faker.number.int({min:1000,max:9999})
    const code = faker.finance.litecoinAddress()
    const title = faker.commerce.productName()
    const description = faker.commerce.productDescription()
    const price = Number.parseInt(faker.commerce.price({min:100, max:200,dec:0}))
    const stock = faker.number.int({min:1 , max: 500})
    const categories = ['botana','refresco','condimento','dulces','pan','embutidos','galletas','jugos']
    const category = categories[faker.number.int({min:0,max:7})]
    return {code,title,description,price,stock,category}
}

export default createMockProduct;
