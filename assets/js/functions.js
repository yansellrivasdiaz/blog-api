$(document).ready(function(){
    $(".content-center .nav-item").click(function(){
        $("#form-registrarse")[0].reset();
        $("#form-login")[0].reset();
    });
});

function alertshow(message,type){
    var alert_icon = `<i class="fas text-${type} fa-exclamation-triangle"></i>`;
    var alert = `<div id="alert-message" style="display:none; position: absolute; bottom:47px; right:0; z-index:2000; width:29em;" class="alert alert-${type} alert-dismissible fade show" role="alert">
    ${alert_icon} ${message}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
    </button>
    </div>`;
  if($("#content #alert-message").length > 0){
    $("#alert-message").remove();
    $("#content").append(alert);
    $("#content #alert-message").show('slow').delay(5000).hide('slow');
  }else{
      $("#content").append(alert);
      $("#content #alert-message").show('slow').delay(5000).hide('slow');
  }
}

function session(message){
    var alert_icon = `<i class="fas fa-spinner fa-spin fa-lg mr-2"></i>`;
    var alert = `<div id="alert-message" style="display:none; position: absolute; bottom:47px; right:0; z-index:2000; width:29em;" class="alert alert-success alert-dismissible fade show" role="alert">
    ${alert_icon} ${message}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
    </button>
    </div>`;
  if($("#content #alert-message").length > 0){
    $("#alert-message").remove();
    $("#content").append(alert);
    $("#content #alert-message").show('slow').delay(5000).hide('slow');
  }else{
      $("#content").append(alert);
      $("#content #alert-message").show('slow').delay(5000).hide('slow');
  }
}

function verificarlogin(){
    if(localStorage.getItem("blogapi")){
        var userdata = JSON.parse(localStorage.getItem("blogapi"));
        $("body #usernamedisplay").html(userdata.name);
    }else{
        window.location.href = "login.html";
    }
}