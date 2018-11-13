$(document).ready(function(){
    // Evento click del formulario registrarse
    $("body").on("submit","#form-registrarse",function(e){
        e.preventDefault();
        registrarse();
    });
    // Validar contraseñas
    $("body").on("keyup","#re-password",function(e){
        var password = $("#password").val();
        var repassword = $(this).val();
        if(password === repassword){
            $(this).addClass("valid").removeClass("invalid").attr('title','Contrañas coinciden');
        }else{
            $(this).addClass("invalid").removeClass("valid").attr("title","Contrañas no coinciden");
        }
    })
});
function registrarse(){
    var name = $('#name').val();
    var email = $('#email').val();
    var password = $('#password').val();
    var repassword = $('#re-password').val();
    if(name != '' && email != '' && password != '' && repassword != ''){
        if(password === repassword){
    
        }else{
            alert('Contraseñas no coiciden!');
            $('#re-password').focus(); 
        }
    }else{
        alert('Campos obligatorios');
        $('#username').focus();
    }
}