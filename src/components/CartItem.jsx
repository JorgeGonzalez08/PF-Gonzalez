import { useContext } from 'react'
import CartContext from "../context/CartContext";
import { toast } from 'sonner'

function CartItem({ code, title, image, selectedStorage, selectedColor, selectedPrice, count, itemsPrice }) {
    const { removeItem } = useContext(CartContext);

    const handleRemove = () => {
        toast.success('Producto eliminado')
        setTimeout(() => {
            removeItem(selectedStorage, selectedColor)
        }, 600)
    }

    return (
        <>
            <div key={code} className="flex items-center  rounded-lg bg-white sm:flex-row">
                <img className="m-2 h-24 w-28 rounded-md border object-fill object-center" src={image} alt="" />
                <div className="flex w-full flex-col px-4 py-4">
                    <span className="font-semibold text-lg">{title}</span>
                    <span className="float-right">Almacenamiento: {selectedStorage}</span>
                    <p className="float-right">Color: {selectedColor}</p>
                    <p className="float-right">Cantidad: {count}</p>
                    <p className="float-right">Precio: ${selectedPrice}</p>
                    <p className="text-lg font-bold">SubTotal: ${itemsPrice.toFixed(3)}</p>
                </div>
                <button className=" text-white  bg-red-600 hover:bg-red-700  rounded-lg p-2 m-2" onClick={handleRemove}>
                    <svg width="30px" height="30px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#ffffff" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>delete [#ffffff]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-179.000000, -360.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M130.35,216 L132.45,216 L132.45,208 L130.35,208 L130.35,216 Z M134.55,216 L136.65,216 L136.65,208 L134.55,208 L134.55,216 Z M128.25,218 L138.75,218 L138.75,206 L128.25,206 L128.25,218 Z M130.35,204 L136.65,204 L136.65,202 L130.35,202 L130.35,204 Z M138.75,204 L138.75,200 L128.25,200 L128.25,204 L123,204 L123,206 L126.15,206 L126.15,220 L140.85,220 L140.85,206 L144,206 L144,204 L138.75,204 Z" id="delete-[#ffffff]"> </path> </g> </g> </g> </g></svg></button>
            </div>
        </>
    )
}

export default CartItem