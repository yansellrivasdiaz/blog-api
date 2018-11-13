$(document).ready(function(){
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
        alert(username + '-' + password);
    }else{
        alert('Campos obligatorios');
        $('#username').focus();
    }
}