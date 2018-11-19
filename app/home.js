$(document).ready(function(){
    $("body").on("click",".logout",function(e){
        e.preventDefault();
        if(confirm("¿Seguro que desea cerrar session?")){
            if(localStorage.getItem("blogapi")){
                var userdata = JSON.parse(localStorage.getItem("blogapi"));
                var url = 'http://68.183.27.173:8080/logout';
                if(userdata.id > 0 && userdata.token.length == 36){
                    $.ajax({
                        url: url,
                        type: 'DELETE',
                        // Fetch the stored token from localStorage and set in the header
                        headers: {
                            "Authorization":'Bearer '+ userdata.token,
                            "Access-Control-Allow-Origin" : "*",
                            "Access-Control-Allow-Methods" : "GET,POST,PUT,DELETE,OPTIONS",
                            "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
                        },
                        success:function(data){
                            console.log(data);
                        }
                    });
                    // fetch(url, {
                    //     method: 'DELETE', // or 'PUT'
                    //     headers:{
                    //         'Content-Type': 'application/json',
                    //         'Authorization':`Token ${userdata.token}`
                    //     },
                    //     body:null
                    // }).then(res => res.json())
                    // .then(response => {
                    //     console.log(response);
                    // })
                    // .catch(error => alertshow('Error: '+error,'danger'));
                }else{
                    localStorage.removeItem("blogapi");
                    window.location.href = 'login.html';
                }
            }
        }
    })
})