var Movies = function(){
    //api keys
    var omdbKey = '4013b0dfff09afbc472286202cf6fb79';

    //films opzoeken
    var getDiscoverMovies = function(criteria, tellerWeergave, tellerPagina, genreId){
        //filter bepalen
        var filter = "";
        var huidigeDatum = new Date();
        var selector = $('#movieCollectionItem');

        //kijken op welke criteria we gaan filteren
        switch(criteria){
            case "upcoming":
                //variabelen
                var huidigeDatumPlus6Maanden = voegMaandenToe(new Date(), 6);
                //filter
                filter = "sort_by=popularity.desc&primary_release_date.gte=" + huidigeDatum.toISOString().slice(0,10) + '&primary_release_date.lte=' + huidigeDatumPlus6Maanden.toISOString().slice(0,10);
                break;
            case "new":
                //variabelen
                var huidigeDatumMin3Maanden = trekMaandenAf(new Date(), 3);
                //filter
                filter = "sort_by=popularity.desc&primary_release_date.gte=" + huidigeDatumMin3Maanden.toISOString().slice(0,10) + '&primary_release_date.lte=' + huidigeDatum.toISOString().slice(0,10);
                break;
             case "popular":
                 filter = "sort_by=popularity.desc";
                 break;
            case "genre":
                filter = "sort_by=popularity.desc&with_genres=" + genreId;
                break;
            }

        //data ophalen
        $.getJSON('https://api.themoviedb.org/3/discover/movie?api_key=' + omdbKey + '&' + filter + '&include_adult=false&include_video=false&page=' + tellerPagina, function(data) {
            var results = data["results"];
            var teller = 0;
            //door alle resultaten loopen
            $.each(results, function(){
                //gegevens opvragen
                var id = results[teller]['id'];
                var titel = results[teller]['title'];
                var jaar = results[teller]['release_date'].split('-')[0];
                var rating = results[teller]['vote_average'];
                var image = "http://image.tmdb.org/t/p/w92/" + results[teller]['poster_path'];

                if(criteria === "upcoming"){
                    var date = new Date(results[teller]['release_date']);
                    console.log(date);
                    var maand = maandNaam(date.getMonth());
                    rating = date.getDate() + " " + maand;
                }

                //teller weergaves omhoog (tellerWeergave geeft aan hoeveel films we op één pagina laten zien, we proberen dit altijd rond de 20 te houden)
                tellerWeergave++;
                if (tellerWeergave !== 1){
                    //element clonen
                    var clone = selector.clone(true).prop('id', 'movieCollectionItem' + id);
                    clone.appendTo('#collectionMovies');

                    //selector aanpassen
                    selector = $('#movieCollectionItem' + id);
                }

                //element vullen
                selector.find('.title').text(titel);
                selector.find('img').attr('src', image);
                selector.find('p').html(jaar + "<br>" + rating);
                selector.find('a').prop('id', id);

                //teller verhogen
                teller++;
            });
        });

        return tellerWeergave + " " + tellerPagina;
    };

    //genres ophalen
    var getGenres = function(){
        //data ophalen
        $.getJSON('https://api.themoviedb.org/3/genre/movie/list?api_key=' + omdbKey, function(data){
            var results = data["genres"];
            var teller = 0;
            //door de genres loopen
            $.each(results, function (){
                var id = results[teller]["id"];
                if(teller === 0){
                    //element vullen
                    $('#genreButton').text(results[teller]["name"]).attr('data-id', id);
                }else{
                    //element clonen
                    var clone = $('#genreButton').clone(true).prop('id', 'genreButton' + id);
                    clone.appendTo('#tabGenreList');

                    //element vullen
                    $('#genreButton' + id).text(results[teller]['name']).attr('data-id', id);
                }
                teller++;
            });
        });
    };

    //bepaalde film ophalen
    var getMovie = function(movieId){
        var selectorOverview = $('#detailOverview');
        //data ophalen
        $.getJSON('https://api.themoviedb.org/3/movie/' + movieId + '?api_key=' + omdbKey, function(data){
            //gegevens opvragen
            var title = data['original_title'];
            var image = "http://image.tmdb.org/t/p/w500/" + data['backdrop_path'];
            var overview = data['overview'];
            var date = new Date(data['release_date']);
            var maand = maandNaam(date.getMonth());
            var releaseDate = date.getDate() + " " + maand + " " + date.getFullYear();
            var rating = data['vote_average'];

            //basis gegevens
            selectorOverview.find('.titel').text(title);
            selectorOverview.find('img').attr('src', image);
            selectorOverview.find('.card-reveal').find('p').text(overview);
            selectorOverview.find('.card-content').find('p:first').text(releaseDate);
            selectorOverview.find('.card-content').find('p:last').find('span').text(rating);
        });
    };

    //personen in de film ophalen
    var getPersons = function(movieId){
      //data ophalen
      $.getJson()
    };

    //gegeven aantal maanden toevoegen aan een datum
    function voegMaandenToe(datum, maanden) {
        datum.setMonth(datum.getMonth() + maanden);
        return datum;
    }

    //gegeven aantal maanden aftrekken van een datum
    function trekMaandenAf(datum, maanden){
        datum.setMonth(datum.getMonth() - maanden);
        return datum;
    }

    //naam krijgen van een maand in cijfernotatie
    function maandNaam(maand) {
        var months = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        return months[maand];
    }

    return{
        getDiscoverMovies : getDiscoverMovies,
        getGenres : getGenres,
        getMovie : getMovie,
        omdbKey : omdbKey
    }
}();