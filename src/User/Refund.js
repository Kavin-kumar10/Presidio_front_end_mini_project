$(document).ready(function(){
    let storage = JSON.parse(localStorage.getItem('RefundApp'));
    let memberId = storage.memberID;

    const createComponents = (elements) =>{
        let parent = $("#Refund_Container");
        let template = $("#Refund");
        $.each(elements,(index,elem)=>{
            let cloneDiv = template.clone();
            let dateObject = new Date(elem.createdDate);
            dateObject = dateObject.toDateString();
            cloneDiv.find('h1').text(elem.product.title);
            cloneDiv.find('h2').text(`Created at : ${dateObject}`)
            cloneDiv.find('h3').text(`Reason : ${elem.refund.reason}`)
            switch (elem.orderStatus) {
                case 1:
                    cloneDiv.find('span').text('Initiated').css("background", "grey");
                    cloneDiv.find('#Status').css("display","block");
                    cloneDiv.find('#Payment').css("display","none");
                    break;
                case 2:
                    cloneDiv.find('span').text('Rejected').css("background", "red");
                    cloneDiv.find('#Status').css("display","block");
                    cloneDiv.find('#Payment').css("display","none");
                    break;
                case 3:
                    cloneDiv.find('span').text('Accepted').css("background", "#303672");
                    cloneDiv.find('#Status').css("display","block");
                    cloneDiv.find('#Payment').css("display","none");
                    break;
                case 4:
                    cloneDiv.find('span').text('Completed');
                    cloneDiv.find('#Payment').click(async()=>{
                        try{
                            const response = await fetch(`http://localhost:5018/api/Payment?PaymentId=${elem.refund.paymentId}`,{
                                headers:{
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${storage.token}`
                                }
                            })
                            let result = await response.json();
                            console.log(result);
                            let dateObject = new Date(result.paymentDate);
                            dateObject = dateObject.toDateString();                            $('#transaction_id').text(`Transaction Id : ${result.transactionId}`)
                            $('#transaction_amount').text(`Amount : $${result.totalPayment}`)
                            $('#transaction_date').text(`Date : ${dateObject}`)
                            $('#transaction_type').text(`Type : ${result.type}`)

                        }
                        catch(err){
                            console.log(err);
                        }
                    })
                    break;                
                default:
                    break;
            }
            cloneDiv.appendTo(parent);    
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
        jsonData = jsonData.filter((elem)=>elem.orderStatus>0)
        jsonData = jsonData.reverse();
        console.log(jsonData);
        createComponents(jsonData);
        } catch (err) {
        console.error("Error fetching data:", err);
        }
    }

    fetchData();
})