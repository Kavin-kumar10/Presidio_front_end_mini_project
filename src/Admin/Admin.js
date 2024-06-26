$(document).ready(function(){
    let templateDiv = $("#accepted")
    let parentDiv = $("#parent")
    let storage = JSON.parse(localStorage.getItem('RefundApp'));
    let memberId = storage.memberID;
    
    //#region Navbar controller

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

    //#endregion Navbar

    // Api calls

    const fetchAcceptedData = async() =>{
        try{
            let response = await fetch("http://localhost:5018/api/Order/GetAcceptedRefund",{
                method:"GET",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${storage.token}`
                }
            })
            let result = await response.json();
            console.log(result);
            createComponents(result);
        }   
        catch(err){
            console.log(err);
        }
    }

    const handlePaymentSubmission = async (orderId,refundId) =>{
        try{
            let transactionId = $("#Transaction").val();
            console.log(transactionId);
            const data = {
                adminId: memberId,
                refundId: refundId,
                transactionId: transactionId
              }
            let response = await fetch("http://localhost:5018/api/Payment",{
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${storage.token}`
                },
                body: JSON.stringify(data),
            })
            let result = await response.json();
            console.log(result);
        }
        catch(err){
            console.log(err);
        }
        
    }
    
    //#region  Generate GUID
    //utilitis
    function generateGUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
    
    $("#Transaction").val(generateGUID());

    //#endregion
    
    const createComponents = (elements) =>{
        $.each(elements,(index,elem)=>{
            var cloneDiv = templateDiv.clone();
            cloneDiv.find('h1').text(elem.product.title)
            cloneDiv.find('h2').text(`Collect from ${elem.orderedBy.name}`)
            cloneDiv.find('p').text(`Product Price $${elem.refund.refundAmount}`)
            cloneDiv.find('span').text(elem.orderId);
            cloneDiv.find("#Btn").click(()=>handlePaymentPop(elem.orderId,elem.refundId))
            cloneDiv.appendTo(parentDiv);
        })
    }




    //#region Pophandlers

    const handlePaymentPop = (orderId,refundId) =>{
        let pop = document.getElementById('PaymentPop');
        pop.style.display = "flex";
        pop.querySelector('p').textContent = `Order Id : ${orderId}`;
        pop.querySelector('#cancel').addEventListener('click',()=>handleHidePop());
        pop.querySelector('#submission').addEventListener('click',()=>handlePaymentSubmission(orderId,refundId))
    }

    const handleHidePop = () =>{
        let pop = document.getElementById('PaymentPop');
        pop.querySelector('input').textContent = "";
        pop.style.display = "none";
    }

    //#endregion

    fetchAcceptedData();
})

