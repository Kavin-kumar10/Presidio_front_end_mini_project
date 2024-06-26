const handleRegister = async(e) =>{
    var notyf = new Notyf();
    try{
        e.preventDefault();
        let form = document.getElementById('register');
        const formData = new FormData(form);
        let data = {
            "Name":formData.get('Name'),
            "email":formData.get('email'),
            "password":formData.get('password')
        }
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };
        let response = await fetch('http://localhost:5018/api/User/Register',options)
        let result = await response.json();
        notyf.success("Registeration Successfull !! Please wait for activation.")
        setTimeout(()=>{
            window.location.reload();
        },1000)
        console.log(result);
    }
    catch(err){
        console.log(err);
    }
}

const register = document.getElementById('register');
register.addEventListener('submit',handleRegister);