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
            //door alle resultaten loopen
            $.each(results, function(index){
                //gegevens opvragen
                var id = results[index]['id'];
                var titel = results[index]['title'];
                var jaar = results[index]['release_date'].split('-')[0];
                var rating = results[index]['vote_average'];
                var image = "http://image.tmdb.org/t/p/w92/" + results[index]['poster_path'];

                if(criteria === "upcoming"){
                    var date = new Date(results[index]['release_date']);
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
                selector.find('a').attr('data-id', id);
            });
        });

        return tellerWeergave + " " + tellerPagina;
    };

    //films zoeken op naam
    var searchMovie = function(input){
        //variabelen
        var selector = $('#movieCollectionItem');

        //data ophalen
        $.getJSON('https://api.themoviedb.org/3/search/movie?api_key=' + omdbKey + '&language=en-US&query=' + input + '&page=1&include_adult=false', function(data) {
            var results = data["results"];
            //door alle resultaten loopen
            $.each(results, function(index){
                //gegevens opvragen
                var id = results[index]['id'];
                var titel = results[index]['title'];
                var jaar = results[index]['release_date'].split('-')[0];
                var rating = results[index]['vote_average'];
                var image = "http://image.tmdb.org/t/p/w92/" + results[index]['poster_path'];

                if (index !== 0){
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
                selector.find('a').attr('data-id', id);
            });
        });
    };

    //mensen zoeken op naam
    var searchPeople = function(input){
        //variabelen
        var selector = $('#personenCollectionItem');

        $.getJSON('https://api.themoviedb.org/3/search/person?api_key=' + omdbKey + '&language=en-US&query=' + input + '&page=1&include_adult=false', function(data) {
            var results = data["results"];
            //door alle resultaten loopen
            $.each(results, function(index){
               //gegevens opvragen
               var id = results[index]['id'];
               var name = results[index]['name'];
               var knownFor = results[index]['known_for'][0]['title'];
               var image = "http://image.tmdb.org/t/p/w92/" + results[index]['profile_path'];

                if (index !== 0){
                    //element clonen
                    var clone = selector.clone(true).prop('id', 'personenCollectionItem' + id);
                    clone.appendTo('#collectionPersonen');

                    //selector aanpassen
                    selector = $('#personenCollectionItem' + id);
                }

                //element vullen
                selector.find('.title').text(name);
                selector.find('img').attr('src', image);
                selector.find('p').html("Know for:<br>" + knownFor);
                selector.find('a').attr('data-id', id);
            });
        });
    };

    //genres ophalen
    var getGenres = function(){
        //data ophalen
        $.getJSON('https://api.themoviedb.org/3/genre/movie/list?api_key=' + omdbKey, function(data){
            var results = data["genres"];
            //door de genres loopen
            $.each(results, function (index){
                var id = results[index]["id"];
                if(index === 0){
                    //element vullen
                    $('#genreButton').text(results[index]["name"]).attr('data-id', id);
                }else{
                    //element clonen
                    var clone = $('#genreButton').clone(true).prop('id', 'genreButton' + id);
                    clone.appendTo('#tabGenreList');

                    //element vullen
                    $('#genreButton' + id).text(results[index]['name']).attr('data-id', id);
                }
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
            var id = data['id'];

            //basis gegevens
            selectorOverview.find('.titel').text(title);
            selectorOverview.find('img').attr('src', image);
            selectorOverview.find('.card-reveal').find('p').text(overview);
            selectorOverview.find('.card-content').find('p:first').text(releaseDate);
            selectorOverview.find('.card-content').find('p:last').find('span').text(rating);
            $('#tabMovieDetail').attr('data-id', id);

            //productie weergeven
            $.each(production, function(index){
                //gegevens opvragen
                var name = production[index]['name'];
                var id = production[index]['id'];

                //niet het eerste element --> eerste element klonen
                if(index !== 0){
                    //element clonen
                    var clone = selectorProduction.clone(true).prop('id', 'productionCollectionItem' + index);
                    clone.appendTo('#productionCollection');

                    //selector aanpassen
                    selectorProduction = $('#productionCollectionItem' + index);
                }

                //element opvullen
                selectorProduction.text(name);
                selectorProduction.attr('data-id', id);
            });

            //p element met genres leegmaken
            selectorOverview.find('.card-content').find('p:nth-child(2)').text("");

            //laatste genre bepalen
            var length = genres.length;

            //genres weergeven
            $.each(genres, function(index){
                var uitvoer;
                //achter het laatste genre geen komma
                if(index === (length - 1)){
                    uitvoer = genres[index]['name'];
                }else{
                    uitvoer = genres[index]['name'] + ", ";
                }
                selectorOverview.find('.card-content').find('p:nth-child(2)').append(uitvoer);
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
            $.each(crew, function (index) {
                //gegevens opvragen
                var job = crew[index]['job'];
                var department = crew[index]['department'];
                var name = crew[index]['name'];
                var id = crew[index]['id'];
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
            });
        });
    };

    //lijst maken van specifieke filmen
    var getMovieList = function(listId){
        //ohpalen movieIds
        var movieIds = Lists.getSpecificListItems(listId);
        var selector = $('#movieCollectionItem');

        //checken of er wel movieIds zijn
        if(movieIds !== "error"){
            //voor elke film de data ophalen
            $.each(movieIds, function(index){
                $.getJSON('https://api.themoviedb.org/3/movie/' + movieIds[index] + '?api_key=' + omdbKey, function(data){
                    //gegevens opvragen
                    var title = data['title'];
                    var image = "http://image.tmdb.org/t/p/w92/" + data['poster_path'];
                    var rating = data['vote_average'];
                    var id = data['id'];
                    var jaar = data['release_date'].split('-')[0];

                    if (index !== 0){
                        //element clonen
                        var clone = selector.clone(true).prop('id', 'movieCollectionItem' + id);
                        clone.appendTo('#collectionMovies');

                        //selector aanpassen
                        selector = $('#movieCollectionItem' + id);
                    }

                    //element vullen
                    selector.find('.title').text(title);
                    selector.find('img').attr('src', image);
                    selector.find('p').html(jaar + "<br>" + rating);
                    selector.find('a').attr('data-id', id);
                    selector.find('a').attr('data-listId', listId);
                });
            });
            return "ok";
        }else{ //foutmelding
            alert('List is empty!');
            return "fout";
        }
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
        searchMovie : searchMovie,
        searchPeople : searchPeople,
        getGenres : getGenres,
        getMovie : getMovie,
        getPeople: getPeople,
        getMovieList : getMovieList,
        omdbKey : omdbKey
    }
}();