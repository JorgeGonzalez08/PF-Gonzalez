import logger from "../../helpers/logger.helper.js";

document.querySelector('.cleanCart').addEventListener('click', async () => {
    const { value: confirm } = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción eliminará todos los productos de tu carrito.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        background:'black',
        color: "white",
        
        confirmButtonText: 'Sí, limpiar carrito!'
    });

    if (confirm) {
        try {
            const cartId = document.querySelector('.cartContainer').getAttribute('data-cart-id');

            if (!cartId) {
                throw new Error('No se encontró el ID del carrito.');
            }

            const response = await fetch(`/api/carts/${cartId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                Swal.fire('Carrito Vacio!', 'Todos los productos han sido eliminados.', 'success');
                document.querySelector('.cartContainer').innerHTML = '<p>El carrito está vacío.</p>';
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al limpiar el carrito.');
            }
        } catch (error) {
            Swal.fire('Error!', error.message, 'error');
        }
    }
});


document.querySelector('.buyCart').addEventListener('click', async () => {
    try {
        const cartId = document.querySelector('.cartContainer').getAttribute('data-cart-id');

        if (!cartId) {
            throw new Error('No se encontró el ID del carrito.');
        }

        const { value: confirm } = await Swal.fire({
            title: '¿Estás listo para comprar?',
            text: "Asegúrate de que tu carrito esté correcto.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            background:'black',
        color: "white",
            confirmButtonText: 'Sí, comprar!'
        });

        if (confirm) {
            const purchaseResponse = await fetch(`/api/carts/${cartId}/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            const result = await purchaseResponse.json();


            if (result.success && result.purchaseTicket) {
                window.location.href = `/ticket/${result.purchaseTicket.code}`;
            } else {
                if (result.outStockProducts && result.outStockProducts.length > 0) {
                    Swal.fire({
                        title: 'Error!',
                        text: `No hay suficiente stock para: ${result.outStockProducts.map(p => p.product.title).join(', ')}`,
                        icon: 'error'
                    });
                } else {
                    Swal.fire('Error!', result.message || 'No se pudo procesar la compra.', 'error');
                }
            }
        }
    } catch (error) {
        logger.ERROR("Error al intentar realizar la compra:", error);
        Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al intentar realizar la compra. Por favor, intenta nuevamente más tarde.',
            icon: 'error'
        });
    }
});