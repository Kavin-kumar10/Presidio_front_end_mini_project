$(document).ready(function(){

const handleLogin = async(e) =>{
    var notyf = new Notyf();
    try{
        e.preventDefault();
        let form = document.getElementById('login');
        const formData = new FormData(form);

        //Validation
        if(formData.get('password').length < 6){
            $('#passError').text('min 6 characters').css("visibility","visible");
            return;
        }


        let data = {
            "userId":formData.get('userId'),
            "password":formData.get('password')
        }
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };
        let response = await fetch('http://localhost:5018/api/User/Login',options)
        let result = await response.json();
        console.log(result);
        if(result.token){
            notyf.success('Login Successfull');
            localStorage.setItem('RefundApp',JSON.stringify(result));
            setTimeout(() => {
                if(result.role == 0)
                    window.location.href = "/src/User/index.html"
                else if(result.role == 2)
                    window.location.href = "/src/Admin/index.html"
                else if(result.role == 1)
                    window.location.href = "/src/Collector/index.html"
            }, 2000);
        }else{
            if(result.errorCode == 400){
                notyf.error(result.errorMessage);
            }
        }
    }
    catch(err){
        console.log(err);
    }
}

const login = document.getElementById('login');
login.addEventListener('submit',handleLogin);
});