$(function(){
    /**
     * @author Wim Naudts
     */
    //synchroon ajax gebruiken
    $.ajaxSetup({
        async: false
    });

    //voor backbutton houden we telkens bij wat de laatste knop is waar we op gedrukt hebben
    var lastCall = [];
    var oldLenght = 0;

	document.addEventListener("deviceready", onDeviceReady, false);

    $('.sidenav').sidenav();

    //veranderen van tab (content die op de pagina wordt weergegven)
    function changeTab(dit){
        $('.spa').hide();
        $('#' + dit.data('show')).show();
        $('.sidenav').sidenav('close');
    }

    //naar de gekozen tab gaan
    $('.sidenav').find('.navigation').click(function(){
        //als we het overzicht van lijsten willen, moeten we een functie oproepen
        if($(this).attr('id') === 'navLists'){
            $('#listsCollection').find('li').not(':first').remove();
            Lists.showLists();

            //de standaardlijsten kunnen we niet deleten
            $('.deleteLijst').each(function(){
                if($(this).attr('data-id') === "0" || $(this).attr('data-id') === "1"){
                    $(this).hide();
                }else{
                    $(this).show();
                }
                console.log($(this).attr('data-id'));
            });
        }

        //Bij de hometab willen we een combinatie van twee andere tabs
        if($(this).attr('data-show') === "tabHome"){
            $('.spa').hide();
            showMoviesToday();
            $('#tabHome').show();
            $('.sidenav').sidenav('close');
        }else{
            //van tab veranderen
            changeTab($(this));
        }
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
                //console.log("lengte:" + lastCall.length);
                //console.log("bestaat:" + lastCall[lastCall.length-2].length);
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
        var buttonMoreSelector = $('.buttonMoreMovies');

        //movielijst leeg maken
        $('#collectionMovies').find('li').not(':first').remove();
        $('.deleteFromLijst').hide();
        $('.buttonMoreMovies').show();

        //vinden op wat er gefilterd moet worden
        var criteria = $(this).data('name');
        buttonMoreSelector.attr('data-name', criteria);

        if(criteria === "genre"){
            genreId = $(this).data('id');
            buttonMoreSelector.attr('data-id', genreId);
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

        buttonMoreSelector.attr('data-show', $(this).data('show'));
        buttonMoreSelector.attr('data-tellerpagina', tellers[1]);

        //veranderen van tab
        changeTab($(this));
        lastCall.push($(this));
    });

    //meer filmen in lijst weergeven
    $('.buttonMoreMovies').click(function(){
        //variabelen
        var tellersString;
        var tellers;
        var genreId = 0;
        var buttonMoreSelector = $('.buttonMoreMovies');

        //vinden op wat er gefilterd moet worden
        var criteria = $(this).attr('data-name');
        var tellerPagina = $(this).attr('data-tellerpagina');
        tellerPagina++;

        if(criteria === "genre"){
            genreId = $(this).data('id');
        }

        //filmen vinden
        tellersString = Movies.getDiscoverMovies(criteria, 1, tellerPagina, genreId);
        tellers = tellersString.split(" ");

        buttonMoreSelector.attr('data-tellerpagina', tellers[1]);

        //veranderen van tab
        changeTab($(this));
        lastCall.push($(this));
    });

    //zoeken op naam
    $('.buttonSearch').click(function(){
        var criteria = $(this).attr('data-name');
        var searchName = $('#searchName').val();
        var leeg = false;

        //Als er geen invoer is, wordt er niet gezocht
        if(searchName === ""){
            alert('No input!');
        }else {
            //filmen zoeken
            if(criteria === 'movies'){
                $('#collectionMovies').find('li').not(':first').remove();
                $('.buttonMoreMovies').hide();
                $('.deleteFromLijst').hide();

                leeg = Movies.searchMovie(searchName);
            }
            //mensen zoeken
            if(criteria === 'people'){
                $('#collectionPersonen').find('li').not(':first').remove();

                leeg = Movies.searchPeople(searchName);
            }

            //als er geen results zijn, laten we niks zien
            if(leeg){
                alert('Nothing found!');
            }else{
                //veranderen van tab
                changeTab($(this));
                lastCall.push($(this));
            }
        }
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

    //persoon pagina
    $('.buttonPersoonDetail').click(function(){
        //persoon id opvragen
        var person = $(this).attr('data-id');
        console.log(person);

        $('.spa').hide();

        //movielijst leeg maken
        $('#collectionMovies').find('li').not(':first').remove();
        $('.deleteFromLijst').hide();
        $('.buttonMoreMovies').hide();

        //persoon weergeven
        Movies.getPerson(person);

        //veranderen van tab
        $('#tabPeopleDetail').show();
        $('#tabMovieList').show();

        if(!$(this).hasClass('lijst')){
            lastCall.push($(this));
        }
    });

    //bedrijf pagina
    $('.buttonProductionDetail').click(function(){
        //movie id opvragen
        var company = $(this).attr('data-id');

        //film weergeven
        Movies.getCompany(company);

        //veranderen van tab
        changeTab($(this));
    });

    //bepaalde film laten zien
    function showMovie(movieId){
        //lijsten leeg maken
        $('#actorCollection').find('a').not(':first').remove();
        $('#crewCollection').find('a').not(':first').remove();
        $('#movieCollection').find('a').not(':first').remove();
        $('#productionCollection').find('a').not(':first').remove();

        //gegevens weergeven
        Movies.getMovie(movieId);
        Movies.getPeople(movieId);
    }

    //knop om film toe the voegen aan een lijst
    $('#buttonAddToList').click(function(){
        var movie = $('#tabMovieDetail').attr('data-id');
        Popup.addMoviePopup(movie);
    });

    //lijst met specifieke filmen ophalen
    $('.buttonSpecificMovieList').click(function(){
        //movielijst leeg maken
        $('#collectionMovies').find('li').not(':first').remove();
        $('.deleteFromLijst').show();
        $('.buttonMoreMovies').hide();

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

    //lijsten deleten
    $('.deleteLijst').click(function(){
        var controle = confirm("Delete list, are you sure?");

        if(controle){
            var listId = $(this).attr('data-id');
            Lists.deleteList(listId);
            $('#navLists').trigger('click');
        }
    });

    //film uit lijst deleten
    $('.deleteFromLijst').click(function(){
        var controle = confirm("Delete from list, are you sure?");

        if(controle){
            var movieId = $(this).attr('data-id');
            var listId = $(this).attr('data-listId');
            Lists.deleteListItem(parseInt(listId), movieId);

            //na een film uit de lijst te verwijderen willen we de films refreshen
            $('#collectionMovies').find('li').not(':first').remove();
            var controle = Movies.getMovieList(parseInt(listId));

            //als de lijst leeg is veranderen we niet van tab
            if(controle !== "fout"){
                //veranderen van tab
                changeTab($(this));
                $('.spa').hide();
                $('#tabMovieList').show();
            }else{
                //teruggaan
                $('#backButton').trigger('click');
            }
        }
    });

    //lijst toevoegen
    $('#buttonAddList').click(function(){
        var listName = $('#listName').val();
        Lists.setLists(listName);
        $('#navLists').trigger('click');
    });
});

//Lijst van filmen die vandaag uitkomen
function showMoviesToday(){
    //movielijst leeg maken
    $('#collectionMovies').find('li').not(':first').remove();
    $('.deleteFromLijst').hide();
    $('.buttonMoreMovies').hide();

    //filmen vinden
    Movies.getDiscoverMovies('today', 0, 1, 0);
    $('#tabMovieList').show();
}

function onDeviceReady() {
    console.log('Device is ready');
    //navigatie opendoen
    $('.spa').hide();
    $('#tabHome').show();
    showMoviesToday();
    //preloader op hide
    $('#tabLoader').hide();
    //lijst met genres al klaar zetten
    Movies.getGenres();
    //local storage oproepen
    Lists.init();
    //materialize components
    $('.tabs').tabs();
    //popup bij start
    if(!Lists.getFirstVisit()){
        Popup.firstVisitPopup();
    }
    //localStorage.clear();
};