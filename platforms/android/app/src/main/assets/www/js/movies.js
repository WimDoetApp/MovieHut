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
            console.log(results);
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
        var selectorProduction = $('#productionCollectionItem');
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
            var production = data['production_companies'];
            var genres = data['genres'];
            var teller = 0; //om door de productie en genres te lopen

            //basis gegevens
            selectorOverview.find('.titel').text(title);
            selectorOverview.find('img').attr('src', image);
            selectorOverview.find('.card-reveal').find('p').text(overview);
            selectorOverview.find('.card-content').find('p:first').text(releaseDate);
            selectorOverview.find('.card-content').find('p:last').find('span').text(rating);

            //productie weergeven
            $.each(production, function(){
                //gegevens opvragen
                var name = production[teller]['name'];
                var id = production[teller]['id'];

                //niet het eerste element --> eerste element klonen
                if(teller !== 0){
                    //element clonen
                    var clone = selectorProduction.clone(true).prop('id', 'productionCollectionItem' + teller);
                    clone.appendTo('#productionCollection');

                    //selector aanpassen
                    selectorProduction = $('#productionCollectionItem' + teller);
                }

                //element opvullen
                selectorProduction.text(name);
                selectorProduction.attr('data-id', id);

                teller++;
            });

            //teller resetten, p element met genres leegmaken
            teller = 0;
            selectorOverview.find('.card-content').find('p:nth-child(2)').text("");

            //laatste genre bepalen
            var length = genres.length;

            //genres weergeven
            $.each(genres, function(){
                var uitvoer;
                //achter het laatste genre geen komma
                if(teller === (length - 1)){
                    uitvoer = genres[teller]['name'];
                }else{
                    uitvoer = genres[teller]['name'] + ", ";
                }
                selectorOverview.find('.card-content').find('p:nth-child(2)').append(uitvoer);
                teller++;
            });
        });
    };

    //personen in de film ophalen
    var getPeople = function(movieId){
        var selectorActor = $('#actorCollectionItem');
        var selectorCrew = $('#crewCollectionItem0');
        //data ophalen
        $.getJSON('https://api.themoviedb.org/3/movie/' + movieId + '/credits' + '?api_key=' + omdbKey, function(data){
            var cast = data['cast'];
            var crew = data['crew'];
            var teller = 0; //om door de lijst met crewmembers te lopen
            var tellerWeergave = 0; //om bij te houden hoeveel crewmembers we al weergeven

            //we laten 5 acteurs en 5 crewmembers zien
            for (i = 0; i < 5; i++) {
                //gegevens opvragen
                var character = cast[i]['character'];
                var name = cast[i]['name'];
                var id = cast[i]['id'];

                //niet het eerste element --> eerste element klonen
                if (i !== 0){
                    //element clonen
                    var cloneActor = selectorActor.clone(true).prop('id', 'actorCollectionItem' + id);
                    cloneActor.appendTo('#actorCollection');

                    //selector aanpassen
                    selectorActor = $('#actorCollectionItem' + id);
                }

                //element opvullen
                selectorActor.text(name + ' as ' + character);
                selectorActor.attr('data-id', id);
            }

            //door de lijst met alle crewmembers lopen
            $.each(crew, function () {
                //gegevens opvragen
                var job = crew[teller]['job'];
                var department = crew[teller]['department'];
                var name = crew[teller]['name'];
                var id = crew[teller]['id'];
                var selectorHuidig;

                //we geven max. 5 crew weer
                if(tellerWeergave < 5) {
                    //De director(s) en een onbepaald aantal schrijvers of producers weergeven
                    switch(department){
                        case "Directing":
                        case "Writing":
                        case "Production":
                            if(tellerWeergave !== 0){
                                //element clonen
                                var cloneCrew = selectorCrew.clone(true).prop('id', 'crewCollectionItem' + tellerWeergave);
                                cloneCrew.appendTo('#crewCollection');
                            }
                            selectorHuidig = $('#crewCollectionItem' + tellerWeergave);
                            //element opvullen
                            selectorHuidig.text(job + ': ' + name);
                            selectorHuidig.attr('data-id', id);
                            tellerWeergave++;
                            break;
                    }
                }

                teller++;
            });
        });
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
        getPeople: getPeople,
        omdbKey : omdbKey
    }
}();