import { useContext, useState, useRef } from "react"
import CartContext from "../context/CartContext";
import '../index.css'
import { Toaster, toast } from 'sonner'

function ItemDetail({ title, code, images = [], price = [], storage = [], colors = [], description }) {

  const refColor = useRef();
  const refStorage = useRef();
  const refPrice = useRef();
  const { addItem } = useContext(CartContext);
  const [count, setCount] = useState(1);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(0);

  let lastPrice = price.length - 1;

  const decrement = () => {
    if (count > 1) {
      setCount(count - 1)
    }
  }

  const selectionColors = (e) => {
    const color = e.target.textContent.toUpperCase();
    refColor.current.innerHTML = color;
    setSelectedColor(color);
  }

  const selectionStorage = (e) => {
    const storageOption = e.target.textContent.toUpperCase();
    refStorage.current.innerHTML = storageOption;
    setSelectedStorage(storageOption);

    const index = storage.indexOf(storageOption);
    const priceOption = price[index];
    refPrice.current.innerHTML = `$${priceOption}`;
    setSelectedPrice(priceOption);
  }

  const handleAdd = () => {
    if (!selectedColor || !selectedStorage) {
      toast.error('Favor de seleccionar un color y almacenamiento')
      return;
    }

    let itemsPrice = selectedPrice * count;
    const productToAdd = {
      code, title, image: images[0], selectedStorage, selectedColor, selectedPrice, count, itemsPrice
    }
    addItem(productToAdd)
    refStorage.current.innerHTML = " ";
    refColor.current.innerHTML = " ";
    refPrice.current.innerHTML = `$${price[0]} - $${price[lastPrice]}`;
    setSelectedColor(null);
    setSelectedStorage(null);
    setSelectedPrice(0);
    setCount(1);
    toast.success('Producto agregado al carrito')
  }

  return (
    <section className="main__product">
      <div className="main__images">
        <div className="main__gallery">
          {images.map((image, index) => (
            <img className="main__gallery-image" key={index} src={image} alt={`Imagen ${index + 1}`} />
          ))}

        </div>
        <img className="main__image" alt={title} src={images[0]} />
      </div>
      <div className="main__desc">
        <p className="main__desc-title">{title}</p>
        <p className="main__desc-code">Código de Producto: {code}</p>
        <p ref={refPrice} className="main__desc-price">${price[0]} - ${price[lastPrice]}</p>

        <p className="main__desc-text">Color: <span ref={refColor} className="color"></span></p>
        <div className="main__desc-colors">
          {colors.map((color, index) =>

            <button onClick={selectionColors} key={index} className="main__desc-color" style={{ backgroundColor: color, color, border: "1px", borderColor: "black", borderStyle: "solid" }}>{color}</button>)

          }
        </div>
        <p className="main__desc-text">Almacenamiento: <span ref={refStorage} className="storage"></span></p>
        <div className="main__desc-storages">
          {storage.map((itemStorage, index) => <button onClick={selectionStorage} key={index} className="main__desc-button">{itemStorage}</button>)}
        </div>
        <div className="main__desc-buttons">
          <button className="main__desc-button" onClick={decrement}><i className="fa-solid fa-minus" aria-hidden="true"></i></button>
          <p className="main__desc-amount">{count}</p>
          <button className="main__desc-button" onClick={() => setCount(count => count + 1)}><i className="fa-solid fa-plus" aria-hidden="true"></i></button>
        </div>
        <Toaster richColors expand={true} position="bottom-right" />
        <button className="main__desc-button width" onClick={handleAdd}>AGREGAR AL CARRITO</button>
        <p className="main__desc-text">Descripcion: </p>
        <p className="description">{description}</p>
      </div>
    </section>
  )
}

export default ItemDetail