var Lists = function(){
    /**
     * @author Wim Naudts
     */
    //de variabelen in andere functies gebruiken (getters en setters)
    var getLists = function(){
        var lists = JSON.parse(localStorage.getItem('lists'));
        return lists;
    };

    var setLists = function(item){
        var lists = JSON.parse(localStorage.getItem('lists'));
        lists.push(item);
        localStorage.setItem('lists', JSON.stringify(lists));
    };

    var getListItems = function(){
        var listItems = JSON.parse(localStorage.getItem('listItems'));
        return listItems;
    };

    var getSpecificListItems = function(listId){
        console.log(localStorage.getItem('listItems'));
        var listItems = JSON.parse(localStorage.getItem('listItems'));
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
        var listItems = JSON.parse(localStorage.getItem('listItems'));
        listItems.push([listId, movieId]);
        localStorage.setItem('listItems', JSON.stringify(listItems));
    };

    var deleteList = function(listId){
        var lists = JSON.parse(localStorage.getItem('lists'));
        lists.splice(listId, 1);
        localStorage.setItem('lists', JSON.stringify(lists));
    };

    var deleteListItem = function(listId, movieId){
        var listItems = JSON.parse(localStorage.getItem('listItems'));
        //door de 2-dimensionale array lopen met een dubbele loop
        $.each(listItems, function(index, element){
            if(element[0] === listId && element[1] === movieId){
                listItems.splice(index, 1);
            }
        });

        localStorage.setItem('listItems', JSON.stringify(listItems));
    };

    var setFirstVisit = function(){
        var firstVisit = false;
        localStorage.setItem('firstVisit', JSON.stringify(firstVisit));
    };

    var getFirstVisit = function(){
        console.log(localStorage.getItem('firstvisit'));
        var firstVisit = JSON.parse(localStorage.getItem('firstvisit'));
        return firstVisit;
    };

    //Checken of een film al in de lijst staat
    var filmInLijst = function(listId, movieId){
        var listItems = JSON.parse(localStorage.getItem('listItems'));
        var output = false;
        //door de 2-dimensionale array lopen met een dubbele loop
        $.each(listItems, function(index, element){
            if(element[0] === listId && element[1] === movieId){
                output = true;
            }
        });

        return output;
    };

    //bij opstarten: local storage ophalen
    var init = function(){
        var listsInitial = ['want to see', 'favorites'];
        var listItemsInitial = [[]];
        var firstVisitInitial = true;

        var lists_str = localStorage.getItem('lists');
        if (lists_str === null) {
            localStorage.setItem('lists', JSON.stringify(listsInitial));
        }

        var firstVisit_str = localStorage.getItem('firstvisit');
        if(firstVisit_str === null){
            localStorage.setItem('firstvisit', JSON.stringify(firstVisitInitial));
        }

        var listItems_str = localStorage.getItem('listItems');
        if(listItems_str === null){
            localStorage.setItem('listItems', JSON.stringify(listItemsInitial));
        }
    };

    //lists weergeven
    var showLists = function(){
        var selector = $('#listsCollectionItem0');
        var content;
        var deleteKnop;
        var lists = JSON.parse(localStorage.getItem('lists'));

        $.each(lists, function(index) {
            if(index !== 0){
                //element clonen
                var clone = selector.clone(true).prop('id', 'listsCollectionItem' + index);
                clone.appendTo('#listsCollection');

                //selector aanpassen
                selector = $('#listsCollectionItem' + index);
            }

            content = selector.find('a:first');
            deleteKnop = selector.find('a:last');

            //element opvullen
            content.text(lists[index]);
            content.attr('data-id', index);
            deleteKnop.attr('data-id', index);
        });
    };

    return{
        getLists : getLists,
        setLists : setLists,
        getListItem : getListItems,
        getSpecificListItems : getSpecificListItems,
        setListItem : setListItems,
        deleteList : deleteList,
        deleteListItem : deleteListItem,
        setFirstVisit : setFirstVisit,
        getFirstVisit : getFirstVisit,
        filmInLijst : filmInLijst,
        init : init,
        showLists : showLists,
    }
}();