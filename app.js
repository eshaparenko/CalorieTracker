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
        getItemById: id => data.items.find( item => item.id === id ),
        setCurrentItem: item => data.currentItem = item,
        updateItem: (name, calories) => {
            calories = parseInt(calories)
            let updated = null;
            data.items.map(item => {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    updated = item;
                }
            })
            return updated;
        },
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
        updateBtn: '.update-button',
        removeBtn: '.remove-button',
        backBtn: '.back-button',
        itemName: '#item-name',
        itemCalories: '#item-calories',
        totalCalories: '.total-calories',
        updateIcon: 'edit-item'
    }

    //Public methods
    return {
        renderItemList: items => {
            //Display list
            document.querySelector(UISelectors.itemList).style.display = 'block'
            let html = '';
            items.forEach(item => {
                html += `
                    <li class="collection-item" id="item-${item.id}">
                    <strong>${item.name} </strong><em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
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
        setItemInput: (input) => {
            document.querySelector(UISelectors.itemName).value = input.name
            document.querySelector(UISelectors.itemCalories).value = input.calories
        },
        clearItemInputs: () => {
            document.querySelector(UISelectors.itemName).value = '';
            document.querySelector(UISelectors.itemCalories).value = '';
        },
        getSelectors: () => UISelectors,
        hideList: () => {
            document.querySelector(UISelectors.itemList).style.display = 'none'
        },
        showTotalCalories: () => {
            document.querySelector(UISelectors.totalCalories).textContent = ItemCtrl.getTotalCalories();
        },
        clearEditState: () => {
            UiCtrl.clearItemInputs();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.removeBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: () => {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.removeBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        }
    }
})()

//App Controller
const App = (()=>{
    //Load event listeners
    const loadEventListeners = () => {
        //Get UI Selectors
        const UISelectors = UiCtrl.getSelectors();
        //Set global evetn listener

        //Disable press enter
        document.addEventListener('keypress', (e) => {
            if (e.key === 13 || e.which === 13) {
                e.preventDefault()
                return false;
            }
        })
        //Add Item Event
        document.querySelector(UISelectors.addBtn)
            .addEventListener('click', addItemSubmit);

        //Add Edit Item Event
        document.querySelector(UISelectors.itemList)
            .addEventListener('click', itemUpdateClick);

        //Update Item Event
        document.querySelector(UISelectors.updateBtn)
            .addEventListener('click', itemUpdateSubmit);
    }

    //Update item
    const itemUpdateClick = (e) => {
        if(e.target.classList.contains(UiCtrl.getSelectors().updateIcon)) {
            //Get list item id
            const listId = e.target.parentNode.parentNode.id;
            const id = parseInt(listId.split('-')[1]);
            
            //get Item to edit
            const itemToEdit = ItemCtrl.getItemById(id)
            
            //Set item
            ItemCtrl.setCurrentItem(itemToEdit)
            
            //Add item form
            UiCtrl.setItemInput(ItemCtrl.logData().currentItem)

            UiCtrl.showEditState()
        }
    
        e.preventDefault()
    }

    const itemUpdateSubmit = (e) => {
        //Get Item input
        const item = UiCtrl.getItemInput()

        //Update item
        const updatedItem = ItemCtrl.updateItem(item.name, item.calories);
        
        //Update UI
        UiCtrl.renderItemList(ItemCtrl.getItems())
        UiCtrl.showTotalCalories()

        e.preventDefault()
    }

    const addItemSubmit = (e) => {
        //Get form input values
        const input = UiCtrl.getItemInput();
        //Check for name and calorie input
        if (input.name !== '' && input.calories !== '') {
            //Add Item
            ItemCtrl.addItem(input.name, input.calories)
        }
        UiCtrl.renderItemList(ItemCtrl.getItems());
        UiCtrl.clearItemInputs();
        UiCtrl.showTotalCalories();

        e.preventDefault()
    } 

    //Public methods
    return {
        init: () => {
            //Show initial state
            UiCtrl.clearEditState();
            //Fetch Items
            const items = ItemCtrl.getItems()
            //Check if any items
            if (items.length === 0) {
                //Hide list
                UiCtrl.hideList()
            } else {
                //Populate list with Items
                UiCtrl.renderItemList(items);
                //Show Total calories
                UiCtrl.showTotalCalories();
            }
            //Load event listeners
            loadEventListeners();
        }
    }
})(ItemCtrl, UiCtrl)

App.init();

