$(function(){
    //Se almacena el tag de audio en una variable
    var audio=$('audio');
function cargarcanciones(){
    $.ajax({
        //Se toma por objetivo la carpeta canciones
        url: '/canciones'
    }).done(function(canciones){
        //Almacena el objeto del DOM en una variable
        var lista= $('.listacanciones');
        //Se vacia la lista
        lista.empty();
        //hace una carga de las canciones del archivo JSON
        canciones.forEach(function(cancion) {
            //General un nuevo elemento para cada cancion
            var nuevoElemento =$('<li class="canciones">'+cancion.nombre+'</li>');
            nuevoElemento
            .on('click',cancion,play)//->Genera un evento sobre la canción
            .appendTo(lista);//Añade la cancion a la lista
        });
    }).fail(function(){
        alert('No pude cargar canciones :(');
    })
}
//Evento de reproduccion de la música
function play(evento){
    audio[0].pause();
    audio.attr('src','/canciones/'+evento.data.nombre);
    audio[0].play();
}
//Llamado de la función de música
cargarcanciones();
});