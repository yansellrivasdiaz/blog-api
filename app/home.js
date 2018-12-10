$(document).ready(function(){
    setTimeout(function(){
        verificarlogin();
    },100);
    $("body").on("click",".logout",function(e){
        e.preventDefault();
        if(confirm("¿Seguro que desea cerrar session?")){
            if(localStorage.getItem("blogapi")){
                var userdata = JSON.parse(localStorage.getItem("blogapi"));
                var url = 'http://68.183.27.173:8080/logout';
                if(userdata.id > 0 && userdata.token.length == 36){
                    var cabecera = new Headers();
                    cabecera.append("Authorization",'Bearer '+ userdata.token);                    
                    cabecera.append('Content-Type', 'application/json');
                    var init = {
                        method:'DELETE',
                        headers:cabecera
                    };
                    var myrequest = new Request(url,init);
                    fetch(myrequest).then(function(response){
                        if(response.ok){
                            return response.json();
                        }
                        throw new Error('La respuesta no es ok...');
                    }).then(function(data){
                        if(data.estatus == "ok"){
                            localStorage.removeItem("blogapi");
                            session("Cerrando session: "+userdata.name);
                            setTimeout(function(){
                                window.location.href = "login.html";
                            },1000);
                        }else{
                            localStorage.removeItem("blogapi");
                            session("Cerrado forzoso...");
                            setTimeout(function(){
                                window.location.href = "login.html";
                            },1000);
                        }
                    }).catch(function(error){
                        alertshow("Hubo problema con la peticion fetch "+error.message,"danger");
                        localStorage.removeItem("blogapi");
                        window.location.reload();
                    });
                }else{
                    localStorage.removeItem("blogapi");
                    window.location.href = 'login.html';
                }
            }
        }
    })
    
    setTimeout(function(){
        getstatus();
    },1000);
})
