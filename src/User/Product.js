$(document).ready(function(){
    const getProductDetails = async() =>{
        try{
            console.log('working');
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const params = urlParams.get('data');
            let response = await fetch(`http://localhost:5018/api/Product/GetProductsById?ProductId=${params}`)
            const data = await response.json();
            console.log(data);
            let info = $('#productinfo');
            info.find('#productId').text(data.productId?data.productId:"None");
            info.find('h1').text(data.title);
            info.find('b').text(data.curr_price);
            info.find('s').text(data.act_price);
            info.find('#desc').text(data.description);
            info.find('#return').html(`Returnable upto ${data.returnable} Days <span class="text-green-900 font-bold">(${data.returnableForPrime} days exclusive for prime)</span>`);
        }
        catch(err){
            console.log(err);
        };
    }
    window.onload = getProductDetails();
})