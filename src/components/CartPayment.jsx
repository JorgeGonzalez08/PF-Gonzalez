import { useState, useContext } from 'react'
import { useForm } from 'react-hook-form'
import CartContext from '../context/CartContext';
import { collection, addDoc, doc } from "firebase/firestore"
import { db } from '../firebase/firebaseConfig';
import { Toaster, toast } from 'sonner'

function CartPayment() {

    const { register, handleSubmit } = useForm();
    const { cart, totalItems, totalPrice, clearCart } = useContext(CartContext);
    const promise = () => new Promise((resolve) => setTimeout(() => resolve(), 1400));

    const toastSuccsess = () => {

        toast.promise(promise, {
            loading: 'Finalizando compra',
            success: () => {
                return ` Compra realizada con exito`;
            },
            error: 'Error',
        });

    }
    const send = (data) => {
        if (!data.email || !data.name || !data.address || !data.stateAddress || !data.zipCode || !data.delivery) {
            toast.error('Favor de llenar todos los campos')
            return;
        }
        toastSuccsess()
        setTimeout(() => {
            const order = { clientData: data, products: cart, items: totalItems, total: totalPrice }
            const orderRef = collection(db, "orders");
            addDoc(orderRef, order)
                .then(() => {
                    clearCart()
                })

        }, 2000);
    }

    return (
        <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
            <p className="text-xl font-medium">Detalles de pago</p>
            <p className="text-gray-400">Completa tu pedido proporcionando tus detalles de pago.</p>
            <form className="" onSubmit={handleSubmit(send)}>
                <label className="mt-4 mb-2 block text-sm font-medium">Nombre completo</label>
                <div className="relative">
                    <input type="text" id="name" name="name" className="w-full rounded-md border border-purple-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-purple-500 focus:ring-purple-500" {...register("name")} placeholder="Nombre completo" />
                    <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                        <svg viewBox="0 0 16 16" className="h-4 w-4 text-purple-400" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z" fill="#ffffff"></path> <path d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z" fill="#ffffff"></path> </g></svg>
                    </div>
                </div>
                <label className="mt-4 mb-2 block text-sm font-medium">Email</label>
                <div className="relative">
                    <input type="text" id="email" name="email" className="w-full rounded-md border border-purple-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-purple-500 focus:ring-purple-500" {...register("email")} placeholder="example@gmail.com" />
                    <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>

                    </div>
                </div>
                <label className="mt-4 mb-2 block text-sm font-medium">Direccion de envio</label>
                <div className="flex flex-col sm:flex-row">
                    <div className="relative flex-shrink-0 sm:w-7/12">
                        <input type="text" id="billing-address" name="billing-address" className="w-full rounded-md border border-purple-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-purple-500 focus:ring-purple-500" {...register("address")} placeholder="Direccion" />
                        <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                            <img className="h-4 w-4 object-contain" src="https://www.svgrepo.com/show/508593/flag-mx.svg" alt="" />

                        </div>
                    </div>
                    <select type="text" name="billing-state" className="w-full rounded-md border border-purple-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-purple-500 focus:ring-purple-500" {...register("stateAddress")}>
                        <option value="CDMX">CDMX</option>
                        <option value="Monterrey">Monterrey</option>
                        <option value="Guadalajara">Guadalajara</option>
                        <option value="Cancun">Cancun</option>
                    </select>
                    <input type="text" name="billing-zip" className="flex-shrink-0 rounded-md border border-purple-200 px-4 py-3 text-sm shadow-sm outline-none sm:w-1/6 focus:z-10 focus:border-purple-500 focus:ring-purple-500" {...register("zipCode")} placeholder="C.P." />
                </div>
                <p className="mt-4 text-sm font-medium">Opciones de envio</p>
                <div className="mt-4 grid gap-6">
                    <div className="relative">
                        <input className="peer hidden" id="radio_1" type="radio" name="radio" value="FEDEX" {...register("delivery")} />
                        <span className="peer-checked:border-purple-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-purple-300 bg-white"></span>
                        <label className="peer-checked:border-2 peer-checked:border-purple-700 peer-checked:bg-purple-50 flex cursor-pointer select-none rounded-lg border border-purple-300 p-4" htmlFor="radio_1">
                            <img className="w-14 object-cover" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAfCAMAAACF8f6iAAAAnFBMVEX///8rAIZFL5G0rs7/fgvzYQCup8r4xKn5074ZAIA7HowAAHv1dhXZ1uT1cgBVQZb9xqYxCIj09Pj/eAD0awD0ZwD2lVw+Io2nn8TBu9S5s8/7y7b72srRzeB9cKubkb6Kf7TKxds3F4v88epOOJTs6u/2mmb3vJz64tJ5aqn2rYbh3ulpWaJeTJz0fSz1gzz2pXhwYaP0ikr86N6P/SxKAAAA6UlEQVQ4je2Rb0+DMBCH78pY/wzKYGxggbZ2w22iTN33/242e6EmxkpifMfzosm1eXK/uwLMzPyZZRRFy6/lmlLKJohc5Lj6qAouNrLc7iaIWNV36lNEskhY004RhepSqLUpoDD23nnx1LaM7eHKgomR5JgdhDm4vsoJEi+W24djnJxk3ISjGqXFWVlHKgu3jo1fzqOUkoajugFq8XTW9tkp6HOykLd7mYy/zOhS6FCDMsZlqa18x8v4Ahc5Sr9btv5RXPEUwHDOX0EjzxDL0n/HW+zdeAe0uYb79t3gz6H79rAPezMz/8o72o8PioeAcvkAAAAASUVORK5CYII=" alt="" />
                            <div className="ml-5">
                                <span className="mt-2 font-semibold">Fedex Delivery</span>
                                <p className="text-slate-500 text-sm leading-6">Entrega: 2-4 Dias</p>
                            </div>
                        </label>
                    </div>
                    <div className="relative">
                        <input className="peer hidden" id="radio_2" type="radio" name="radio" value="DHL" {...register("delivery")} />
                        <span className="peer-checked:border-purple-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-purple-300 bg-white"></span>
                        <label className="peer-checked:border-2 peer-checked:border-purple-700 peer-checked:bg-purple-50 flex cursor-pointer select-none rounded-lg border border-purple-300 p-4" htmlFor="radio_2">
                            <img className="w-14 object-fill" src="https://multipress.com.mx/wp-content/uploads/2018/12/dhl-mexico-logo.png" alt="" />
                            <div className="ml-5">
                                <span className="mt-2 font-semibold">DHL Delivery</span>
                                <p className="text-slate-500 text-sm leading-6">Entrega: 2-4 Dias</p>
                            </div>
                        </label>
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-lg font-medium text-gray-900">ENVIO</p>
                    <p className="text-lg font-semibold text-gray-900">GRATIS</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-lg font-medium text-gray-900">TOTAL</p>
                    <p className="text-2xl font-semibold text-gray-900">${totalPrice.toFixed(3)}</p>
                </div>

                <Toaster position="top-right" expand={true} richColors />
                <button className="mt-4 mb-8 w-full rounded-md bg-purple-950 px-6 py-3 font-medium text-white hover:bg-purple-800" type='submit'>Finalizar compra</button>
            </form>
        </div>
    )
}

export default CartPayment