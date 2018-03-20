var Popup = function(){
    var _callback = function(buttonIndex) {
        setTimeout(function() {
            // like other Cordova plugins (prompt, confirm) the buttonIndex is 1-based (first button is index 1)
            alert('button index clicked: ' + buttonIndex);
        });
    };

    var testShareSheet = function () {
        var options = {
            androidTheme: window.plugins.actionsheet.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT, // default is THEME_TRADITIONAL
            title: 'What do you want with this image?',
            buttonLabels: ['Share via Facebook', 'Share via Twitter'],
            androidEnableCancelButton : true, // default false
            winphoneEnableCancelButton : true, // default false
            addCancelButtonWithLabel: 'Cancel',
            addDestructiveButtonWithLabel : 'Delete it',
            position: [20, 40], // for iPad pass in the [x, y] position of the popover
            destructiveButtonLast: true // you can choose where the destructive button is shown
        };
        // Depending on the buttonIndex, you can now call shareViaFacebook or shareViaTwitter
        // of the SocialSharing plugin (https://github.com/Eddy
        window.plugins.actionsheet.show(options, _callback);
    };

    return{
        testShareSheet : testShareSheet,
    }
}();