var posts = ``;
var comments = `<div class="card comments mb-1 comment-item" style="width: 98%;">
<div class="card-body posts py-2">
    <div class="card-title blockquote-footer text-truncate">
        <i class="fa fa-user"></i> 
        <b>By:</b>
        <a href="javacript:void(0)"> 
            <b class="post-owner">Yansell Rivas (yrd@gmail.com)</b>
        </a>
        <em class="postdate">05 febrero, 2018</em>
    </div>
    Hola como estan, me gusto mucho tu post 
    Hola como estan, me gusto mucho tu post 
    Hola como estan, me gusto mucho tu post 
    Hola como estan, me gusto mucho tu post 
    Hola como estan, me gusto mucho tu post 
    Hola como estan, me gusto mucho tu post 
</div>
</div>`;
$(document).ready(function(){
    getposts();
})
function getposts(){
    if(localStorage.getItem("blogapi")){
        var userdata = JSON.parse(localStorage.getItem("blogapi"));
        var url = 'http://68.183.27.173:8080/post';
        if(userdata.id > 0 && userdata.token.length == 36){
            var cabecera = new Headers();
            cabecera.append("Authorization",'Bearer '+ userdata.token);                    
            cabecera.append('Content-Type', 'application/json');
            var init = {
                method:'GET',
                headers:cabecera
            };
            var myrequest = new Request(url,init);
            fetch(myrequest).then(function(response){
                if(response.ok){
                    return response.json();
                }
                throw new Error('La respuesta no es ok...');
            }).then(function(data){
                for(var i=0; i<data.length; i++){
                    posts+=fillposts(data[i]);
                }
                $("#comment-container").html(posts);
            }).catch(function(error){
                alertshow("Hubo problema con la peticion fetch"+error.message,"danger");
            });
        }else{
            localStorage.removeItem("blogapi");
            window.location.href = 'login.html';
        }
    }
}
function fillposts(post){
    var htmlpost = `<div class="card mb-2" style="width: 100%;">
        <div class="card-body posts py-4">
            <h5 class="card-title"><a href="javascript:void(0)"><b class="post-title">${post.title}</b> <i class="fas fa-share-square ml-2"></i></a></h5>
            <div class="like py-0">
                <a class="btn btn-link text-info py-0 my-0" href="javascript:void(0);"><i class="far fa-star fa-lg"></i></a> 
                <p><span class="badge badge-pill badge-info count-like">25</span> Like</p>
            </div> 
            <hr class="mb-0 mt-1">
            <div class="text-line-3 mb-2">
                <p class="card-text text-justify post-body">
                    ${post.body}
                </p>
            </div>
            <div class="post-comment py-2">
                <hr class="my-1">
                <div class="comment-form  text-right">
                    <div class="form-group mb-1">
                        <textarea class="form-control text-comment" placeholder="Comentar aqui..." rows="3"></textarea>
                    </div>
                    <button class="btn btn-success btn-sm btn-send"><i class="fa fa-paper-plane fa-lg"></i> Comentar</button>
                    <p class="w-100 text-left m-0"><b>comentarios</b></p>
                    <div class="comment-content">

                        <!-- Aqui van los comentarios cargados  -->

                    </div>
                </div>
            </div>
            <hr class="my-1">
            <blockquote class="blockquote-title text-truncate">                                        
                <a class="btn btn-link text-info float-right seemore" href="javascript:void(0);" data-postid="${post.id}"><i class="far fa-eye"></i> Ver más...</a>  
                <a class="btn btn-link text-info float-right seecomment" href="javascript:void(0);" data-postid="${post.id}"><span class="badge badge-pill badge-dark count-comment">25</span> Comentarios</a> 
                <blockquote class="blockquote-footer">
                    <a class="text-success mb-2" href="javascript:void(0);" data-ownerid="${post.userId}">
                        <i class="fa fa-user"></i> 
                        <b>By:</b> 
                        <b class="post-owner">Yansell Rivas (yrd@gmail.com)</b>
                    </a> 
                    <!-- <em class="postdate">05 febrero, 2018</em> -->
                </blockquote>
            </blockquote>  
        </div>
    </div>`; 

    return htmlpost;
}