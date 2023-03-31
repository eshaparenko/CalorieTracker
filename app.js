//Storage Controller

//Item Controller
//IIFE
const ItemCtrl = (()=>{
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
            {id: 2, name: 'Eggs', calories: 300}

        ],
        currentItem: null,
        totalCalories: 0
    }

    //Public methods
    return {
        logData: () => data,
        totalCalories: 0
    }
})()

//UI Controller
const UiCtrl = (()=>{
    //Public methods
    return {

    }
})()


//App Controller
const App = ((item, ui)=>{
    //Public methods
    return {
        init: () => console.log(item.logData())
    }
})(ItemCtrl, UiCtrl)

App.init();

