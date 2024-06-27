let template = $('#Pendings_template');
let parent = $('#Pendings_parent')

setTimeout(() => {
    
    $(document).ready(async function(){
        
        var elements;
        
        //Search bar
        let searchInput = $('#SearchOrder');
        searchInput.keyup(function() {
            const searchTerm = $(this).val().toLowerCase();
            console.log(searchTerm);
            var filtered = elements.filter((elem) => {
            return elem.orderId.toString().includes(searchTerm);
        });
        console.log(filtered);
        createComponents(filtered);
    });
    
    try{
        var notyf = new Notyf(); 
        NavbarControl();
        const retrievedDataString = localStorage.getItem("RefundApp");
        const retrievedDataObject = JSON.parse(retrievedDataString);
        let response = await fetch("http://localhost:5018/api/Order/GetPendingRefund",{
            method:"GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${retrievedDataObject.token}`
            },
        })
        elements = await response.json();
        elements = elements.reverse();
        console.log(elements);
        createComponents(elements);
    }
    catch(err){
        console.log(err);
        notyf.error('Server issue - please contact customer care');
    }
    
});


const createComponents = (elements) =>{
    parent.empty();
    $.each(elements, function (index, elem) { 
        let cloneDiv = template.clone();
        cloneDiv.find('h1').text(elem.product.title)
        cloneDiv.find('h2').text(`Collect from ${elem.orderedBy.name}`)
        cloneDiv.find('p').text(`Product Price $${elem.refund.refundAmount}`)
        cloneDiv.find('span').text(elem.orderId);
        cloneDiv.find('button').click(async function() {
            let val =  $(this).text();
            let decision = false;
            if(val == "Accept")
                decision = true;
            let body = {
                    orderId : elem.orderId,
                    decision : decision
                }
                console.log(body);
                let response = await fetch("http://localhost:5018/api/Order/RefundDecision",{
                    method:"POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${retrievedDataObject.token}`,
                    },
                    body:JSON.stringify(body)
                })
                let result = await response.json();
                if(result.orderStatus == 3){
                    notyf.success('Product Accepted');
                }
                else{
                    notyf.success('Product Declined');
                }
                window.location.reload();
                console.log(result);
            });
            cloneDiv.appendTo(parent);
        });
    }
    
    // NavbarControl
    
    const NavbarControl = () =>{
        let dropdown = $('#dropdown');
        let info = $('.info')
        
        // User Credentials
        let Credentials = JSON.parse(localStorage.getItem("User"));
        if(Credentials){
            console.log("Working");
            console.log(Credentials);
            $("#Account").text(Credentials.name);
            dropdown.find("h1").text(Credentials.name);
            switch (Credentials.role) {
            case 0:
                dropdown.find("h2").text("User");
                break;
                case 1:
                    dropdown.find("h2").text("Collector");
                    break;
                    case 2:
                        dropdown.find("h2").text("Admin");
                        break;
                        
                        default:
                            break;
                        }
                    }
                    
                    // Dropdown for sign out
                    info.click(() => {
                        if(dropdown.css("display") == "flex")   
                            dropdown.css("display", "none");
                        else if(dropdown.css("display") == "none")   
                            dropdown.css("display", "flex");
                    });
                    dropdown.find('button').click(()=>{
                        localStorage.removeItem("RefundApp");
                        localStorage.removeItem("User");
                        window.location.href = "/src/Auth/Login.html";
                    })
                }
}, 1000);