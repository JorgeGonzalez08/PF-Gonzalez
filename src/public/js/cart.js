let cid= document.getElementById('selectCart')
const addCart = async(pid)=>{

    let res=await fetch(`/api/carts/${cid.value}/product/${pid}`,{
        method:"post"
    })
    if(res.status>=400){
        alert(`Error...!!! consulte con el administrador`)
        return 
    }
    let data=await res.json()
    alert(data.payload)
    window.location.reload()
}

let linkCart = document.getElementById('linkCart');

if(linkCart){
linkCart.addEventListener('click',()=>{
    linkCart.href=`/carts/${cid.value}`
})

}