$(function(){
    //synchroon ajax gebruiken
    $.ajaxSetup({
        async: false
    });

	document.addEventListener("deviceready", onDeviceReady, false);

    $(".button-collapse").sideNav();

    //veranderen van tab (content die op de pagina wordt weergegven)
    function changeTab(dit){
        $('.spa').hide();
        $('#' + dit.data('show')).show();
        $('.button-collapse').sideNav('hide');
    }

    function showMovie(movieId){
        //lijsten leeg maken
        $('#actorCollection').find('a').not(':first').remove();
        $('#crewCollection').find('a').not(':first').remove();
        $('#movieCollection').find('a').not(':first').remove();

        //gegevens weergeven
        Movies.getMovie(movieId);
        Movies.getPeople(movieId);
    }

    //naar de gekozen tab gaan
    $('.side-nav a').click(function(){
        changeTab($(this));
    });

    //Lijst van filmen weergeven
    $('.buttonMovieList').click(function(){
        //variabelen
        var tellersString;
        var tellers;
        var genreId = 0;
        console.log(Movies.omdbKey);

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

        //veranderen van tab
        changeTab($(this));
        console.log(tellers[0]);
        console.log(tellers[1]);
    });

    //lijst van genres weergeven
    $('.buttonGenre').click(function(){
        changeTab($(this));
    });

    //film pagina
    $('.buttonMovieDetail').click(function(){
        //movie id opvragen
        var movie = $(this).prop('id');

        //film weergeven
        showMovie(movie);

        //veranderen van tab
        changeTab($(this));
    });

    //knop om film toe the voegen aan een lijst
    $('#buttonAddToList').click(function(){
        var movie = $('#tabMovieDetail').attr('data-id');
        Popup.addMoviePopup(movie);
        Lists.setLocalStorage();
    });

    //Preloader laten zien wanneer we gegevens uit onze api laden -- werkt nog niet!
    $(document).ajaxStart(function(){
        $('.container').hide();
        $('#tabLoader').show();
        console.log("hoi");
    });

    $(document).ajaxComplete(function(){
        $('#tabLoader').hide();
        $('.container').show();
        console.log("hai");
    });
});

function onDeviceReady() {
    console.log('Device is ready');
    //navigatie opendoen
    $('.spa').hide();
    $('#tabHome').show();
    //preloader op hide
    $('#tabLoader').hide();
    //lijst met genres al klaar zetten
    Movies.getGenres();
    //local storage oproepen
    Lists.init();
};