$(document).ready(function(){
    let storage = JSON.parse(localStorage.getItem('RefundApp'));
    let memberId = storage.memberID;
    var parendDiv = $('#OrderedContainer');
    var templateDiv = $('#OrderedItem')


    const createComponents = (elements) =>{
        $.each(elements,(index,elem)=>{
            var cloneDiv = templateDiv.clone();
            let dateObject = new Date(elem.createdDate);
            dateObject = dateObject.toDateString();
            cloneDiv.find('h1').text(elem.product.title);
            cloneDiv.find('p').html(`Returnable upto ${elem.product.returnable} Days <span class="text-green-900 font-bold">(${elem.product.returnableForPrime} days exclusive for prime)</span> from ${dateObject} - Purchase Date`);
            if(elem.refundId){
                cloneDiv.find('#Requested').css("display","block");
                cloneDiv.find('button').css("display","none");
            }
            cloneDiv.find('button').click(()=>{
                handleReasonPop(elem.product.title,elem.orderId);
            })
            cloneDiv.appendTo(parendDiv);
        })
    }


    const fetchData = async()=>{
        try {
        const response = await fetch(`http://localhost:5018/api/Order/GetOrdersByMemberId?memberId=${memberId}`,{
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${storage.token}`
                }
            })
        let jsonData = await response.json();
        jsonData = jsonData.reverse();
        console.log(jsonData);
        createComponents(jsonData);
        } catch (err) {
        console.error("Error fetching data:", err);
        }
    }

    fetchData();
})

//Popup handlers

const handleReasonPop = (title,orderId) =>{
    let pop = document.getElementById('ReasonPop');
    pop.style.display = "flex";
    pop.querySelector('p').textContent = title;
    pop.querySelector('span').textContent = orderId;
    console.log(pop);
}

const handleHidePop = () =>{
    let pop = document.getElementById('ReasonPop');
    pop.querySelector('input').textContent = "";
    pop.style.display = "none";
}

const handleReasonSubmit = async () =>{
    try{
        let pop = document.getElementById('ReasonPop');
        let storage = JSON.parse(localStorage.getItem('RefundApp'));
        let orderId = pop.querySelector('span').textContent;
        let reason = pop.querySelector('input').value;
        const data = {
            OrderId:orderId,
            Reason:reason
        }
        console.log(orderId+" "+reason);
        const response = await fetch(`http://localhost:5018/api/Refund`,{
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${storage.token}`
            },
            method:'POST',
            body:JSON.stringify(data)
        })
        const result = await response.json();
        console.log(result);
        if(response.status != 200){
            alert(result.errorMessage);
        }
        handleHidePop();
    }
    catch(err){
        console.log(err);
    }
}