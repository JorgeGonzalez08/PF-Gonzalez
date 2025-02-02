import fs from "fs"
export class ProductsManager{
    static #path=""

    static setPath(rutaArchivo=""){
        this.#path=rutaArchivo
    }

    static async getProducts(){
        if(fs.existsSync(this.#path)){
            return JSON.parse(await fs.promises.readFile(this.#path, {encoding:"utf-8"}))
        }else{
            return []
        }
    }

    
    static async getProductById(pid){
        let products=await this.getProducts()
        let product=products.find(p=>p.pid===pid)
        return product
    }

    static async getProductByName(title){
        let products=await this.getProducts()
        let product=products.find(item=>item.title.toLowerCase()===title.trim().toLowerCase())
        return product
    }

    static async createProduct(product={}){   
        let products=await this.getProducts()
        let pid=1
        if(products.length>0){
            pid=Math.max(...products.map(item=>item.pid))+1
        }
        let newProduct={
            pid, 
            ...product,
            status:true,
            thumbnails:[]
           
        }
        products.push(newProduct)

        await this.#grabaArchivo(JSON.stringify(products, null, 5))
        
        return newProduct
    }

    static async updateProduct(pid, updates={}){

        let products=await this.getProducts()
        let indexProduct=products.findIndex(item=>item.pid===pid)

        if(indexProduct===-1){
            throw new Error(`producto inexistente con pid ${pid}`)
        }

        products[indexProduct]={
            ...products[indexProduct],
            ...updates,  
            pid
        }

        await this.#grabaArchivo(JSON.stringify(products, null, 5))
        return products[indexProduct]
    }

    
    static async deleteProductById(pid){
        let products = await this.getProducts();
        const index = products.findIndex(product => product.pid === pid);
       
        products.splice(index,1);
        await this.#grabaArchivo(JSON.stringify(products, null, 5))
        return products
    }

    static async deleteProductByTitle(title){
        let products = await this.getProducts();
        const index = products.findIndex(product => product.title === title);
        products.splice(index,1);
        await this.#grabaArchivo(JSON.stringify(products, null, 5))
        return products
    }
    
    
    static async #grabaArchivo(datos=""){
        if(typeof datos!="string"){
            throw new Error(`error método grabaArchivo - argumento con formato inválido`)
        }
        await fs.promises.writeFile(this.#path, datos)
    }
}