setTimeout(() => {
    var notyf = new Notyf();
    const handleOrderPlacement = async (event) =>{
        event.preventDefault();
        try{
            console.log(orderingform);
            let productId = document.getElementById('productId').innerText;
            const retrievedDataString = localStorage.getItem("RefundApp");
            const retrievedDataObject = JSON.parse(retrievedDataString);
            const data = {
                productId : productId,
                memberId : retrievedDataObject.memberID
            };
            let response = await fetch("http://localhost:5018/api/Order",{
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${retrievedDataObject.token}`
                },
                body: JSON.stringify(data),
            })
            let result = await response.json();
            notyf.success(`Your order placed sucessfully with Order Id : ${result.orderId}`);
            console.log(result);
        }
        catch(err){
            console.log(err);
        }
    }
    
    const orderingform = document.getElementById('productDetail');
    orderingform.addEventListener('submit',handleOrderPlacement);
}, 1000);
