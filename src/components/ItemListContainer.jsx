import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"
import ItemList from "./ItemList.jsx"

function ItemListContainer() {

    const [products, setProducts] = useState([]);
    const { brandId } = useParams();

    useEffect(() => {
        /*======= Conexion con la base de datos de firebase =======*/
        const productsCollection = collection(db, 'products');
        const productsQuery = brandId ? query(productsCollection, where('marca', '==', brandId)) : productsCollection;
        getDocs(productsQuery)
            .then((querySnapshot) => {
                const products = querySnapshot.docs.map(doc => {
                    return {
                        id: doc.id,
                        ...doc.data()
                    }
                })
                setProducts(products)
            })

    }, [brandId])

    return (
        <main>
            <ItemList products={products} />
        </main>
    )
}

export default ItemListContainer