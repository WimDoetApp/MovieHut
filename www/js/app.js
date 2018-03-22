$(function(){
    //synchroon ajax gebruiken
    $.ajaxSetup({
        async: false
    });

    //voor backbutton houden we telkens bij wat de laatste knop is waar we op gedrukt hebben
    var lastCall = [];
    var oldLenght = 0;

	document.addEventListener("deviceready", onDeviceReady, false);

    $(".button-collapse").sideNav();

    //veranderen van tab (content die op de pagina wordt weergegven)
    function changeTab(dit){
        $('.spa').hide();
        $('#' + dit.data('show')).show();
        $('.button-collapse').sideNav('hide');
        console.log(lastCall);
        console.log(dit);
    }

    //naar de gekozen tab gaan
    $('.side-nav').find('.navigation').click(function(){
        //als we op de navigatie knop voor lijsten klikken, moeten we een functie oproepen
        if($(this).attr('id') === 'navLists'){
            $('#listsCollection').find('a').not(':first').remove();
            Lists.showLists();
        }

        //van tab veranderen
        changeTab($(this));
        lastCall.push($(this));
    });

    //Teruggaan naar de laatst bezochte tab
    $('#backButton').click(function(){
        //Als we niet naar de laatst bezochte tab terug kunnen gaan we er 2 terug
        if(oldLenght === lastCall.length){
            //Als we bij start meteen op de terugknop klikken krijgen we een error message
            if(oldLenght === 0) {
                alert('Nothing to go back to!');
            }else{
                lastCall[lastCall.length-4].trigger("click");
            }
        }else{
            //Als er een al een tab bezocht is, gaan we terug naar deze tab gaan.
            if(lastCall.length > 1){
                console.log("lengte:" + lastCall.length);
                console.log("bestaat:" + lastCall[lastCall.length-2].length);
                oldLenght = lastCall.length+1;
                lastCall[lastCall.length-2].trigger("click");
            }else{ //als er nog geen tab bezocht is, gaan we terug naar de hometab
                changeTab($('#buttonHome'));
            }
        }
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

        //veranderen van tab
        changeTab($(this));
        lastCall.push($(this));
        console.log(tellers[0]);
        console.log(tellers[1]);
    });

    //lijst van genres weergeven
    $('.buttonGenre').click(function(){
        changeTab($(this));
        lastCall.push($(this));
    });

    //film pagina
    $('.buttonMovieDetail').click(function(){
        //movie id opvragen
        var movie = $(this).attr('data-id');

        //film weergeven
        showMovie(movie);

        //veranderen van tab
        changeTab($(this));
        lastCall.push($(this));
    });

    //bepaalde film laten zien
    function showMovie(movieId){
        //lijsten leeg maken
        $('#actorCollection').find('a').not(':first').remove();
        $('#crewCollection').find('a').not(':first').remove();
        $('#movieCollection').find('a').not(':first').remove();

        //gegevens weergeven
        Movies.getMovie(movieId);
        Movies.getPeople(movieId);
    }

    //knop om film toe the voegen aan een lijst
    $('#buttonAddToList').click(function(){
        var movie = $('#tabMovieDetail').attr('data-id');
        Popup.addMoviePopup(movie);
        Lists.setLocalStorage();
    });

    //lijst met specifieke filmen ophalen
    $('.buttonSpecificMovieList').click(function(){
        //movielijst leeg maken
        $('#collectionMovies').find('li').not(':first').remove();

        //filmlijst maken
        var id = $(this).attr('data-id');
        var controle = Movies.getMovieList(parseInt(id));

        //als de lijst leeg is veranderen we niet van tab
        if(controle !== "fout"){
            //veranderen van tab
            changeTab($(this));
            lastCall.push($(this));
        }
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