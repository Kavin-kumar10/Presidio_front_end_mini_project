const RedirectToLogin = () =>{
    if(!localStorage.getItem("RefundApp")){
        window.location.href = "/src/Auth/Login.html"
    }
}

const getUserData = async () =>{
    try{
        if(localStorage.getItem("RefundApp")){
            let memberId = JSON.parse(localStorage.getItem("RefundApp")).memberID;
            console.log(memberId);
            let response = await fetch(`http://localhost:5018/api/Member/GetById?memberId=${memberId}`)
            let result = await response.json();
            localStorage.setItem("User",JSON.stringify(result));
        }
    }
    catch(err){
        console.log(err);
    }
}


RedirectToLogin();
getUserData();