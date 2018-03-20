var Lists = function(){
    //variabelen
    var listItems = [];
    var lists = [];

    //de variabelen in andere functies gebruiken
    var getLists = function(){
        return lists;
    };

    var setLists = function(item){
        lists.push(item);
    };

    var getListItems = function(){
        return listItems;
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

    return{
        getLists : getLists,
        setLists : setLists,
        getListItem : getListItems,
        setListItem : setListItems,
        init : init,
        setLocalStorage : setLocalStorage,
        lists : lists
    }
}();