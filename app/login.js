$(document).ready(function(){
    // Se verifica si existe un token y se envia hacia la pagina home
    checkToken();
    // Evento click del formulario login
    $("body").on("submit","#form-login",function(e){
        e.preventDefault();
        login();
    });
});
function login(){
    var username = $('#username').val();
    var password = $('#password').val();
    if(username != '' && password != ''){
        var url = 'http://68.183.27.173:8080/login';
        var data = {
            "email":username,
            "password":password
        };        
        fetch(url, {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers:{
            'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .then(response => {
            if(response.estatus && response.estatus == "error"){
                alertshow("Credenciales incorrectas.",'danger');
                $("#username").focus();
            }else{
                var UserData = {
                    "id":response.id,
                    "name":response.name,
                    "email":response.email,
                    "token":response.token
                };
                localStorageSaver(JSON.stringify(UserData));
                $("#form-login")[0].reset();
                alert("Session iniciada ",response.token);
            }
        })
        .catch(error => alertshow('Error: '+error,'danger'));
    }else{
        alertshow("Campos obligatorios","danger");
        $('#username').focus();
    }
}
function localStorageSaver(data){
    if(localStorage.getItem("blogapi")){
        localStorage.setItem("blogapi",data);
    }else{
        localStorage.setItem("blogapi",data);
    }
}
function checkToken(){
    if(localStorage.getItem("blogapi")){
        var userdata = JSON.parse(localStorage.getItem("blogapi"));
        if(userdata.id > 0 && userdata.token.length == 36){
            window.location.href = 'home.html';
        }else{
            localStorage.removeItem("blogapi");
        }
    }
}