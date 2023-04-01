//Storage Controller
const StorageCtrl = (() => {
    return {
        storeItem: item => {
            let items = []
            if (localStorage.getItem('items') === null) {
                items.push(item)
                localStorage.setItem('items', JSON.stringify(items))
            } else {
                items = JSON.parse(localStorage.getItem('items'))
                items.push(item)
                localStorage.setItem('items', JSON.stringify(items))
            }
        },
        getItemsFromStorage: () => {
            return localStorage.getItem('items') === null ?
                [] : JSON.parse(localStorage.getItem('items'))
        },
        updateItemStorage: (updatedItem) => {
            let items = JSON.parse(localStorage.getItem('items'))
            items.forEach((item, index) => {
                if (updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem)
                }
            })
            localStorage.setItem('items', JSON.stringify(items))
        },
        deleteItemFromStorage: id => {
            let items = JSON.parse(localStorage.getItem('items'))
            items.forEach((item, index) => {
                if (id === item.id) {
                    items.splice(index, 1)
                }
            })
            localStorage.setItem('items', JSON.stringify(items))
        },
        claerItemsFromStorage: () => localStorage.removeItem('items')
    }
})()

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
        items: StorageCtrl.getItemsFromStorage(),
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
        deletItem: id => {
            const ids = data.items.map(item => {
                return item.id
            })

            const index = ids.indexOf(id)
            //Remove item
            data.items.splice(index, 1)
        },
        deleteAll: () => {
            data.items = [];
            data.currentItem = null;
            data.totalCalories = 0;
        },
        logData: () => data,
        getCurrentItem: () => data.currentItem,
        getTotalCalories: () => {
            let total = 0;
            data.items.forEach(item => {
                total += parseInt(item.calories);
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
        clearBtn: '.clear-btn'
    }

    //Public methods
    return {
        renderItemList: items => {
            if (items.length !== 0) {
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
            } else {
                UiCtrl.hideList()
            }
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

        //Update button click Event
        document.querySelector(UISelectors.itemList)
            .addEventListener('click', itemUpdateClick);

        //Update Item Event
        document.querySelector(UISelectors.updateBtn)
            .addEventListener('click', itemUpdateSubmit);
        
        //Back button click Event
        document.querySelector(UISelectors.backBtn)
            .addEventListener('click', backButtonClick);

        //Delet button click Event
        document.querySelector(UISelectors.removeBtn)
            .addEventListener('click', itemDeleteSubmit);

        //Clear All button click Event
        document.querySelector(UISelectors.clearBtn)
            .addEventListener('click', clearAllSubmit);
    }

    const backButtonClick = (e) => {
        UiCtrl.clearEditState()
        e.preventDefault()
    }

    //Update item
    const itemUpdateClick = (e) => {
        if(e.target.classList.contains('edit-item')) {
            //Get list item id
            const listId = e.target.parentNode.parentNode.id;
            const id = parseInt(listId.split('-')[1]);
            
            //get Item to edit
            const itemToEdit = ItemCtrl.getItemById(id)
            
            //Set item
            ItemCtrl.setCurrentItem(itemToEdit)
            console.log(listId);
            //Add item form
            UiCtrl.setItemInput(ItemCtrl.getCurrentItem())

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
        UiCtrl.clearEditState();

        //Update local sotorage
        StorageCtrl.updateItemStorage(updatedItem)

        ItemCtrl.setCurrentItem(null);

        e.preventDefault()
    }

    const addItemSubmit = (e) => {
        //Get form input values
        const input = UiCtrl.getItemInput();
        //Check for name and calorie input
        if (input.name !== '' && input.calories !== '') {
            //Add Item
            const itemToStore = ItemCtrl.addItem(input.name, input.calories)

            //Store in local storage
            StorageCtrl.storeItem(itemToStore)
        }
        UiCtrl.renderItemList(ItemCtrl.getItems());
        UiCtrl.clearItemInputs();
        UiCtrl.showTotalCalories();

        e.preventDefault()
    } 

    const itemDeleteSubmit = (e) => {
        //Get current item
        const currentItem = ItemCtrl.getCurrentItem();

        //Delete item
        ItemCtrl.deletItem(currentItem.id)
        //Update UI
        UiCtrl.renderItemList(ItemCtrl.getItems())
        ItemCtrl.setCurrentItem(null);
        UiCtrl.showTotalCalories()

        //Delete from local ctorage
        StorageCtrl.deleteItemFromStorage(currentItem.id)

        UiCtrl.clearEditState();

        e.preventDefault();
    }

    const clearAllSubmit = (e) => {
        ItemCtrl.deleteAll();
        UiCtrl.renderItemList(ItemCtrl.getItems())
        UiCtrl.showTotalCalories()
        UiCtrl.clearEditState();

        //Clear from local storage
        StorageCtrl.claerItemsFromStorage()
        
        e.preventDefault();
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
})(ItemCtrl, StorageCtrl, UiCtrl)

App.init();

