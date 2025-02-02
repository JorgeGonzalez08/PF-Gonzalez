import { productsModel } from "./model/productsModel.js";

export class ProductsManagerMongoose{

    static async getAllProducts(){
        return await productsModel.find().lean();
    }

    static async getProducts(page,limit,category){
        if (category) {
            return await productsModel.paginate({category},{
                limit,
                page,
                lean:true
            })
        }
        return await productsModel.paginate({},{
            limit,
            page,
            lean:true
        })
    }
    static async getProductsSort(page,limit,sort,category){

        if (category) {    
            return await productsModel.paginate({category},{
                limit,
                page,
                sort:{price:sort},
                lean:true
            })
        }else{
        return await productsModel.paginate({},{
            limit,
            page,
            sort:{price:sort},
            lean:true
        })}
    }

    static async getProductById(pid){
        let products = await this.getAllProducts();
        let product = products.find(p => p._id == pid);
        return product;
    }

    static async addProduct(product){
        let newProduct = await productsModel.create(product);
        return newProduct.toJSON()
    }

    static async updateProduct(id, product){
        return await productsModel.findByIdAndUpdate(id,product,{new:true}).lean();
    }

    static async deleteProduct(pid){
        return await productsModel.findByIdAndDelete(pid).lean();
    }
}