var Twitter = function () {
    /**
     * @author Wim Naudts
     */
    var wachtwoord = 'wimnaudts';

    var movieFeed = function(movie){
        var isEmpty = false;

        $.getJSON('https://wt-b8d3bad832e9998cd77b194b1858005a-0.sandbox.auth0-extend.com/twitter-search?webtask_no_cache=1&q=' + movie + '&w=' + wachtwoord, function(data) {
            var statuses = data['statuses'];

            //als er geen statusen worden gevonden
            if(statuses.length === 0){
                isEmpty = true;
            }else { //pagina opvullen met tweets
                var selector = $('#tweet');

                //vorige pagina's verwijderen & titel
                $('#twitterFeed').find('.tweetKaart').not(':first').remove();
                $('#twitterFeed').find('h3').text('Tweets for: ' + movie);

                $.each(statuses, function(index){
                    var id = statuses[index]['id_str'];
                    var text = statuses[index]['full_text'];
                    var user = statuses[index]['user']['name'];
                    var userLink = statuses[index]['user']['screen_name'];
                    var date = statuses[index]['created_at'];
                    var image = statuses[index]['user']['profile_image_url'];
                    var media = statuses[index]['extended_entities'];
                    var retweeted = statuses[index]['retweeted_status'];
                    var url = "";

                    if(media !== undefined){
                        url = media['media']['media_url'];
                    }

                    if(retweeted !== undefined){
                        media = retweeted['extended_entities'];
                        if(media !== undefined){
                            url = media['media'][0]['media_url'];
                            console.log(url);
                        }
                    }

                    text = replaceHashtag(text);
                    text = replaceUser(text);
                    date = date.replace('+0000', '');

                    if(index !== 0){
                        //element clonen
                        var clone = selector.clone(true).prop('id', 'tweet' + index);
                        clone.appendTo('#twitterFeed');

                        //selector aanpassen
                        selector = $('#tweet' + index);
                    }

                    //elementen opvullen
                    selector.find('h5').find('a').text(user);
                    selector.find('h5').find('a').attr('href', 'https://twitter.com/' + userLink);
                    selector.find('.text').html(text);
                    selector.find('i:first').text('@' + userLink);
                    selector.find('i:last').text(date);
                    selector.find('.twitterFoto').attr('src', image);
                    selector.find('.card-action').find('a').attr('href', 'https://twitter.com/' + userLink + '/status/' + id);
                    selector.find('.media').attr('src', url);

                    selector.find('.text').linkify();
                });
            }
        });

        return isEmpty;
    };

    var replaceHashtag = function(text){
        var matches = text.match(/(^|)#[a-z'-_à-ÿ]+/gi);

        $.each(matches, function(index){
            var link = 'https://twitter.com/search?q=' + matches[index].replace('#', "%23");

            text = text.replace(matches[index], "<a href='" + link + "'>" + matches[index] + "</a>")
        });

        return text;
    };

    var replaceUser = function(text){
        var matches = text.match(/(^|)@[a-z'-_à-ÿ]+/gi);

        $.each(matches, function(index){
            console.log(matches[index]);
            var link = 'https://twitter.com/' + matches[index].replace(':', "");
            console.log(link);

            text = text.replace(matches[index], "<a href='" + link + "'>" + matches[index] + "</a>")
        });

        return text;
    };

    return{
        movieFeed : movieFeed
    }
}();
