//Storage Controller

//Item Controller
//IIFE(Molule pattern)
const ItemCtrl = (() => {
    //Item Constructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories; 
    }

    //Data Structure / State
    const data = {
        items: [
            // {id: 0, name: 'Staek Dinner', calories: 1200},
            // {id: 1, name: 'Cookie', calories: 300},
            // {id: 2, name: 'Eggs', calories: 300},
            // {id: 3, name: 'Apple', calories: 30}
        ],
        currentItem: null,
        totalCalories: 0
    }

    //Public methods
    return {
        getItems: () => data.items,
        addItem: (name, calories) => {
            //Create ID
            let ID;
            if(data.items.length > 0) {
                ID = data.items[data.items.length-1].id + 1;
            } else {
                ID = 0;
            }
            //Add new Item
            const item = new Item(ID, name, parseInt(calories))
            data.items.push(item);
            return item;
        },
        logData: () => data,
        getTotalCalories: () => {
            let total = 0;
            data.items.forEach(item => {
                total += item.calories;
            })
            data.totalCalories = total;
            return data.totalCalories;
        }
    }
})()

//UI Controller
const UiCtrl = (()=>{
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-button',
        itemName: '#item-name',
        itemCalories: '#item-calories',
        totalCalories: '.total-calories'
    }

    //Public methods
    return {
        populateItemList: items => {
            //Display list
            document.querySelector(UISelectors.itemList).style.display = 'block'
            let html = '';
            items.forEach(item => {
                html += `
                    <li class="collection-item" id="item-${item.id}">
                    <strong>${item.name} </strong><em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="fa fa-pencil"></i>
                    </a>
                </li>`;

                const itemListElement = document.querySelector(UISelectors.itemList);
                itemListElement.innerHTML = html;
            });
        },
        getItemInput: () => {
            return {
                name: document.querySelector(UISelectors.itemName).value,
                calories: document.querySelector(UISelectors.itemCalories).value
            }
        },
        clearItemInputs: () => {
            document.querySelector(UISelectors.itemName).value = '';
            document.querySelector(UISelectors.itemCalories).value = '';
        },
        getSelectors: () => UISelectors,
        hideList: () => {
            document.querySelector(UISelectors.itemList).style.display = 'none'
        },
        updateToralCalories: () => {
            document.querySelector(UISelectors.totalCalories).textContent = ItemCtrl.getTotalCalories();
        }
    }
})()

//App Controller
const App = (()=>{
    //Load event listeners
    const loadEventListeners = () => {
        //Get UI Selectors
        const UISelectors = UiCtrl.getSelectors();
        //Add Item Event
        document.querySelector(UISelectors.addBtn)
            .addEventListener('click', addItemSubmit)
    }

    const addItemSubmit = (e) => {
        //Get form input values
        const input = UiCtrl.getItemInput();
        //Check for name and calorie input
        if (input.name !== '' && input.calories !== '') {
            //Add Item
            ItemCtrl.addItem(input.name, input.calories)
        }
        UiCtrl.populateItemList(ItemCtrl.getItems());
        UiCtrl.clearItemInputs();
        UiCtrl.updateToralCalories();
        e.preventDefault()
    } 

    //Public methods
    return {
        init: () => {
            //Fetch Items
            const items = ItemCtrl.getItems()
            //Check if any items
            if (items.length === 0) {
                //Hide list
                UiCtrl.hideList()
            } else {
                //Populate list with Items
                UiCtrl.populateItemList(items);
                //Show Total calories
                UiCtrl.updateToralCalories();
            }
            //Load event listeners
            loadEventListeners();
        }
    }
})(ItemCtrl, UiCtrl)

App.init();

