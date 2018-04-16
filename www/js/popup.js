var Popup = function(){
    var movie = 0;

    //wat er gebeurt nadat op de knop geklikt is
    var callback = function(buttonIndex){
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
        window.plugins.actionsheet.show(options, callback);
    };

    //Popup om te confirmeren dat we

    return{
        addMoviePopup : addMoviePopup
    }
}();