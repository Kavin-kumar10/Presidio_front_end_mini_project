$(document).ready(function(){
    
    let storage = JSON.parse(localStorage.getItem('RefundApp'));
    let template = $('#Member_Template');
    let parent = $('#Member_Parent')
    var notyf = new Notyf();
    
    
    $('#cancel').click(()=>{
        $('#ActivatePop').css('display','none');
    })
    
    const createComponents = (elements) =>{
        $.each(elements,(index,elem)=>{
            let cloneDiv = template.clone();
            cloneDiv.find('h1').text(elem.member.name);
            cloneDiv.find('h2').text(`Member Id : ${elem.member.id}`)
            cloneDiv.css('display','block');
            if(elem.status == "Active"){
                switch (elem.member.role) {
                    case 0:
                        if(elem.member.membership == 1){
                            cloneDiv.find('#role').text('User - Prime').css('background','#0A3627');
                        }
                        else{
                            cloneDiv.find('#role').text('User - Free').css('background','Green');
                        }
                        break;
                    case 1:
                        cloneDiv.find('#role').text('Collector').css('background','darkblue');
                        break;
                    case 2:
                        cloneDiv.find('#role').text('Admin').css('background','brown');
                        break;
                    default:
                        break;
                }
            }
            cloneDiv.find('#Deactivate').click(()=>{
                deactivate(elem.member.id);
            })
            cloneDiv.find('#Activate').click(()=>{
                activatePop(elem);
            })
            cloneDiv.appendTo(parent);
        })
    }

    const activatePop = (elem) =>{
        let pop = $('#ActivatePop');
        pop.css('display','flex');
        pop.find('p').text(elem.member.name+" - "+elem.member.id);
        pop.find('#submission').click(()=>{
            let Role = $("select[name='Role']").val();
            let Membership = $("select[name='Membership']").val();
            let data = {
                MemberId : elem.member.id,
                role:Role-0,
                plan:Membership-0
            }
            activate(data);
        })
    }

    const activate = async (data) =>{
        try{
            let response = await fetch('http://localhost:5018/api/Activate/Activate',{
                method:"PUT",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${storage.token}`
                },
                body:JSON.stringify(data)
            })
            let result = await response.json();
            console.log(result);
            notyf.success(`${data.MemberId} is Activated Succssfully.`)
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
        catch(err){
            console.log(err);
        }
    }

    const deactivate = async (memberId) =>{
        try{
            let response = await fetch(`http://localhost:5018/api/Activate/Deactivate?MemberId=${memberId}`,{
                method:"PUT",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${storage.token}`
                }
            })
            let result = await response.json();
            console.log(result);
            notyf.success(`${memberId} is deactivated Succssfully.`)
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
        catch(err){
            console.log(err);
        }
    }

    const fetchUserData = async() =>{
        try{
            let response = await fetch("http://localhost:5018/api/User",{
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

    fetchUserData();
})