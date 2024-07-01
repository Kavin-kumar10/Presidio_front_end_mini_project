$(document).ready(function(){
    const fetchProductsData = async() =>{
        console.log("working");
        try{
            const response = await fetch('http://localhost:5018/api/Product')
            const result = await response.json();
            console.log(result);
            createProducts(result);
        }
        catch(err){
            console.log(err);
        }
    }

            //     tag.setAttribute('id', 'product');
        //     tag.setAttribute('data-aos', 'fade-up');
        //     tag.setAttribute('data-aos-duration', '1000');
        //     tag.setAttribute('href', `Product.html?data=${elem.productId}`);

    window.onload = fetchProductsData();

    let products_container= $('#products_container');
    let productTemplate = $('#product');
    console.log(productTemplate);

    const createProducts = (elements) =>{
        $.each(elements,(index,elem)=>{
            console.log(elem);
            var cloneDiv = productTemplate.clone();
            if(elem.productId == 101)
                cloneDiv.find('img').attr("src", "../Assets/product1.jpg");
            cloneDiv.css('display','flex');
            cloneDiv.find('h1').text(elem.title);
            cloneDiv.find('p').text(elem.description);
            cloneDiv.find('b').text(elem.curr_price);
            cloneDiv.find('s').text(elem.act_price);
            cloneDiv.attr('data-aos', 'fade-up');
            cloneDiv.attr('data-aos-duration', '1000');
            cloneDiv.attr('href', `Product.html?data=${elem.productId}`);
            cloneDiv.appendTo(products_container);
        })
    }
});