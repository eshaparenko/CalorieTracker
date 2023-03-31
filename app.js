//Storage Controller

//Item Controller
//IIFE(Molule pattern)
const ItemCtrl = (() => {
    //Item Constructor
    const Item = (id, name, calories)=>{
        this.id = id;
        this.name = name;
        this.calories = calories; 
    }

    //Data Structure / State
    const data = {
        items: [
            {id: 0, name: 'Staek Dinner', calories: 1200},
            {id: 1, name: 'Cookie', calories: 300},
            {id: 2, name: 'Eggs', calories: 300},
            {id: 3, name: 'Apple', calories: 30}


        ],
        currentItem: null,
        totalCalories: 0
    }

    //Public methods
    return {
        getItems: () => data.items,
        logData: () => data,
        totalCalories: 0
    }
})()

//UI Controller
const UiCtrl = (()=>{
    const UISelectors = {
        itemList: '#item-list'
    }

    //Public methods
    return {
        populateItemList: items => {
            let html = '';
            items.forEach(item => {
                html += `
                    <li class="collection-item" id="item-0">
                    <strong>${item.name} </strong><em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="fa fa-pencil"></i>
                    </a>
                </li>`;

                const itemListElement = document.querySelector(UISelectors.itemList);
                itemListElement.innerHTML = html;
            });
        }
    }
})()

//App Controller
const App = (()=>{
    //Public methods
    return {
        init: () => {
            //Fetch Items
            const items = ItemCtrl.getItems()

            //Populate list with Items

            UiCtrl.populateItemList(items);
            
        }
    }
})(ItemCtrl, UiCtrl)

App.init();

