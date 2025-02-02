import fs from "fs"

export class CartsManager {
    static #path = ""

    static setPath(rutaArchivo = "") {
        this.#path = rutaArchivo
    }

    static async getCarts() {
        if (fs.existsSync(this.#path)) {
            return JSON.parse(await fs.promises.readFile(this.#path, { encoding: "utf-8" }))
        } else {
            return []
        }
    }

    static async createCarts() {
        let carts = await this.getCarts();
        let cid = 1
        if (carts.length > 0) {
            cid = Math.max(...carts.map(item => item.cid)) + 1
        }
        let newCarts = {
            cid,
            products: []
        }
        carts.push(newCarts)

        await this.#grabaArchivo(JSON.stringify(carts, null, 5))

        return newCarts
    }

    static async getCartById(cid) {
        let carts = await this.getCarts()
        let cart = carts.find(item => item.cid === cid)
        return cart
    }


    static async addProductToCart(cid, { pid }) {


        let carts = await this.getCarts()
        let indexCart = carts.findIndex(item => item.cid === cid)

        let existsProduct = carts[indexCart].products.find(item => item.pid === pid)

        if (existsProduct) {

            existsProduct.quantity += 1

            await this.#grabaArchivo(JSON.stringify(carts, null, 5))
            return existsProduct

        } else {

            let updateCart =
            {
                pid,
                quantity: 1
            }
            carts[indexCart].products.push(updateCart);

            await this.#grabaArchivo(JSON.stringify(carts, null, 5))
            return updateCart

        }

      
    }

    static async #grabaArchivo(datos = "") {
        if (typeof datos != "string") {
            throw new Error(`error método grabaArchivo - argumento con formato inválido`)
        }
        await fs.promises.writeFile(this.#path, datos)
    }
}