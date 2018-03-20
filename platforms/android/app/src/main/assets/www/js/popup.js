var Popup = function(){
    var movie = 0;

    //wat er gebeurt nadat op de knop geklikt is
    var callback = function(buttonIndex){
        setTimeout(function(){
            Lists.setListItem(buttonIndex-1, movie);
            console.log(Lists.getLists());
            console.log(Lists.getListItem());
            console.log(buttonIndex);
        });
    };

    //Popup die vraagt in welke lijst je de film wilt toevoegen
    var addMoviePopup = function (movieId) {
        var options = {
            androidTheme: window.plugins.actionsheet.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT, // default is THEME_TRADITIONAL
            title: 'Choose a list:',
            buttonLabels: Lists.getLists(),
            androidEnableCancelButton : true, // default false
            winphoneEnableCancelButton : true, // default false
            addCancelButtonWithLabel: 'Cancel',
            position: [20, 40], // for iPad pass in the [x, y] position of the popover
            destructiveButtonLast: true // you can choose where the destructive button is shown
        };
        // Depending on the buttonIndex, you can now call shareViaFacebook or shareViaTwitter
        // of the SocialSharing plugin (https://github.com/Eddy
        movie = movieId;
        window.plugins.actionsheet.show(options, callback);
    };

    return{
        addMoviePopup : addMoviePopup
    }
}();