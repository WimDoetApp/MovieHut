var Popup = function(){
    var movie = 0;

    //wat er gebeurt nadat op de knop geklikt is
    var callbackMovie = function(buttonIndex){
        setTimeout(function(){
            if(Lists.filmInLijst(buttonIndex-1,movie)){
                M.toast({html: 'Movie already in list!'});
            }else{
                Lists.setListItem(buttonIndex-1, movie);
                M.toast({html: 'Movie succesfully added!'});
            }
            console.log(Lists.getLists());
            console.log(Lists.getListItem());
            console.log(buttonIndex);
        });
    };

    var callBackFirstVisit = function(buttonIndex){
        setTimeout(function(){
           if(buttonIndex === 1){
               Lists.setFirstVisit();
           }
        });
    };

    //Popup die vraagt in welke lijst je de film wilt toevoegen
    var addMoviePopup = function (movieId) {
        var options = {
            androidTheme: window.plugins.actionsheet.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
            title: 'Choose a list:',
            buttonLabels: Lists.getLists(),
            androidEnableCancelButton : true, // default false
            winphoneEnableCancelButton : true, // default false
            addCancelButtonWithLabel: 'Cancel',
            position: [20, 40], // for iPad pass in the [x, y] position of the popover
            destructiveButtonLast: true // you can choose where the destructive button is shown
        };
        // buttonIndex = index van de knop waarop geklikt is
        movie = movieId;
        window.plugins.actionsheet.show(options, callbackMovie);
    };

    //First visit popup
    var firstVisitPopup = function () {
        var options = {
            androidTheme: window.plugins.actionsheet.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
            title: 'This app needs internet to function!',
            buttonLabels: ['Ok', "Don't show this again"],
            position: [20, 40], // for iPad pass in the [x, y] position of the popover
            destructiveButtonLast: true // you can choose where the destructive button is shown
        };
        // buttonIndex = index van de knop waarop geklikt is
        window.plugins.actionsheet.show(options, callBackFirstVisit);
    };

    return{
        addMoviePopup : addMoviePopup,
        firstVisitPopup : firstVisitPopup
    }
}();