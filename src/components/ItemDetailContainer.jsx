import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"
import ItemDetail from "./ItemDetail"

function ItemDetailContainer() {
  const [product, setProduct] = useState({})
  const { productId } = useParams();

  useEffect(() => {
    const productRef = doc(db, 'products', productId);
    getDoc(productRef)
      .then((doc) => {
        if (doc.exists()) {
          setProduct({
            id: doc.id,
            ...doc.data()
          })
        }
      })
  }, [productId])


  return (
    <>
      <ItemDetail {...product} />
    </>
  )
}

export default ItemDetailContainer