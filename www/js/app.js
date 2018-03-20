$(function(){
    //synchroon ajax gebruiken
    $.ajaxSetup({
        async: false
    });

	document.addEventListener("deviceready", onDeviceReady, false);

    $(".button-collapse").sideNav();

    //veranderen van tab (content die op de pagina wordt weergegven)
    function veranderVanTab(dit){
        $('.spa').hide();
        $('#' + dit.data('show')).show();
        $('.button-collapse').sideNav('hide');
    }

    //naar de gekozen tab gaan
    $('.side-nav a').click(function(){
        veranderVanTab($(this));
    });

    //Lijst van filmen weergeven
    $('.buttonMovieList').click(function(){
        //variabelen
        var tellersString;
        var tellers;
        var genreId = 0;

        //movielijst leeg maken
        $('#collectionMovies').find('li').not(':first').remove();

        //vinden op wat er gefilterd moet worden
        var criteria = $(this).data('name');

        if(criteria === "genre"){
            genreId = $(this).data('id');
            console.log(genreId);
        }

        //filmen vinden
        tellersString = Movies.getDiscoverMovies(criteria, 0, 1, genreId);
        tellers = tellersString.split(" ");

        //zolang er geen 20 items in mijn lijst staan, blijf ik naar films zoeken
        while(!(tellers[0] >= 20)){
             tellers[1]++;
             tellersString = Movies.getDiscoverMovies(criteria, tellers[0], tellers[1], genreId);
             tellers = tellersString.split(" ");
        }

        veranderVanTab($(this));
        console.log(tellers[0]);
        console.log(tellers[1]);
    });

    //lijst van genres weergeven
    $('.buttonGenre').click(function(){
       veranderVanTab($(this));
    });

    //film pagina
    $('.buttonMovieDetail').click(function(){
        var movie = $(this).prop('id');
        Movies.getMovie(movie);
        veranderVanTab($(this));
    });
});

function onDeviceReady() {
    console.log('Device is ready');
    //navigatie opendoen
    $('.spa').hide();
    $('#tabHome').show();
    //lijst met genres al klaar zetten
    Movies.getGenres();
};