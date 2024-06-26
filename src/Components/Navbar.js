$(document).ready(function() {
    fetch("../Components/Navbar.html")
        .then(response => response.text())
        .then(data => {
            $("body").prepend(data);
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
        })
        .catch(error => {
            console.error("Error fetching navbar:", error);
        });

});
