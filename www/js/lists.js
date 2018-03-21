var Lists = function(){
    //variabelen
    var listItems = [];
    var lists = [];

    //de variabelen in andere functies gebruiken (getters en setters)
    var getLists = function(){
        return lists;
    };

    var setLists = function(item){
        lists.push(item);
    };

    var getListItems = function(){
        return listItems;
    };

    var getSpecificListItems = function(listId){
        var movieIds = []; //de ids van de films in de lijst

        console.log(listItems);
        //door de 2-dimensionale array lopen met een dubbele loop
        $.each(listItems, function(index, element){
            console.log(element[1]);
            if(element[0] === listId){
                movieIds.push(element[1])
            }
        });

        //returnvalues
        if(movieIds.length === 0){
            movieIds = "error";
        }

        console.log(movieIds);
        return movieIds;
    };

    var setListItems = function(listId, movieId){
        listItems.push([listId, movieId]);
    };

    //bij opstarten: local storage ophalen
    var init = function(){
        var listsInitial = ['want to see', 'favorites'];
        lists = [];

        var lists_str = localStorage.getItem('lists');
        if (lists_str !== null) {
            lists = JSON.parse(lists_str);
        }else{ //indien leeg --> local storage opbouwen
            localStorage.setItem('lists', JSON.stringify(listsInitial));
            lists = listsInitial;
        }

        var listItems_str = localStorage.getItem('listItems');
        if (listItems_str !== null){
            listItems = JSON.parse(listItems_str);
        }
    };

    //opslagen local storage data
    var setLocalStorage = function(){
        localStorage.setItem('lists', JSON.stringify(lists));
        localStorage.setItem('listItem', JSON.stringify(listItems));
    };

    //lists weergeven
    var showLists = function(){
        var selector = $('#listsCollectionItem0');

        $.each(lists, function(index) {
            if(index !== 0){
                //element clonen
                var clone = selector.clone(true).prop('id', 'listsCollectionItem' + index);
                clone.appendTo('#listsCollection');

                //selector aanpassen
                selector = $('#listsCollectionItem' + index);
            }

            //element opvullen
            selector.text(lists[index]);
            selector.attr('data-id', index);
        });
    };

    return{
        getLists : getLists,
        setLists : setLists,
        getListItem : getListItems,
        getSpecificListItems : getSpecificListItems,
        setListItem : setListItems,
        init : init,
        setLocalStorage : setLocalStorage,
        showLists : showLists,
        lists : lists
    }
}();