// Budget Controller
//Implementing through Closure
var budgetController = (function() {
    //Expense function constructor
    var Expense = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };


    Expense.prototype.calcPercentage = function(totalIncome){

        if(totalIncome>0){
            this.percentage = Math.round((this.value / totalIncome)*100);
        }
        else{
            this.percentage = -1;
        }

    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
    }


     //Income function constructor
    var Income = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(curr){
            sum += curr.value;
        });
        data.totals[type] = sum;

    };


    var data = {
        allItems:{
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        },
        budget:0,
        percentage:-1
    }

    return{
        addItems:function(type,des,val){
            var newItem,ID;
            //create new ID
            if(data.allItems[type].length > 0)
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            else 
                ID = 0;
            //Create new item based on 'inc' or 'exp' type;
            if(type === 'exp'){
                newItem = new Expense(ID,des,val);
            }
            else if(type === 'inc'){
                newItem = new Income(ID,des,val);
            }
            //Push the item into our data structure
            data.allItems[type].push(newItem);
            // console.table("data after pushing>>>",data);
            //return the new element
            return newItem;
        },
        deleteItems:function(ID,type){

            var ids,index;

            ids = data.allItems[type].map(function(current){
                return current.id;
            });
            console.log("ids>>",ids);
            index = ids.indexOf(Number(ID));
            if(index !== -1)
            {
                data.allItems[type].splice(index,1);
            }
        },
        testing:function() {
            console.log(data);
        }
        ,
        calculateBudget:function(){

            //Calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            // Calculate the budget: income-expense
            data.budget = data.totals.inc - data.totals.exp;
            //Calculate the percentage of income that we spent
            if(data.totals.inc > 0){

                data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);
            }
            else{
                data.percentage = '-1';
            }
        },
        getBudget:function(){
            return {
                budget:data.budget,
                totalinc:data.totals.inc,
                totalexp:data.totals.exp,
                percentage:data.percentage
            }
        },
        calculatePercentages:function(){

            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            })

        },
        getPercentages:function(){

            var perc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            })
            return perc;
        }

    }

})();



//UI Controller

var UIController = (function(){

    //some code later
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
    var formatter = function(number,type){
        var numSplit, int, dec, type;
        /*  
            + or - before number
            exactly 2 decimal points
            comma separating the thousands
            2310.4567 -> + 2,310.46
            2000 -> + 2,000.00
            
        */
       number = Math.abs(number);
       number = number.toFixed(2);
       numSplit = number.split(".");
        int =  numSplit[0];
        dec = numSplit[1];
        if(int.length > 3){

            int = int.substring(0,int.length-3) + ',' + int.substring(int.length-3,3);
        }

       return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };
    var  nodeListForEach = function(list,callback){
        for(let i=0;i<list.length;i++)
            callback(list[i],i);
    };
    return {
        getInput:function(){
            return{
                type:document.querySelector(DOMstrings.inputType).value,
                description:document.querySelector(DOMstrings.inputDescription).value,
                value:parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        
        },
        addListItem:function(obj,type){

            var html,newHtml,element,itemPercentage;
            //Create HTML String with placeholder text

            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            else{
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            //Replace the placeholder text with actual data
                newHtml = html.replace('%id%',obj.id);
                newHtml = newHtml.replace('%description%',obj.description);
                newHtml = newHtml.replace('%value%',formatter(obj.value,type));
            //Insert the HTML into the DOM
                document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },
        deleteListItem:function(selectedID){

                    var el = document.getElementById(selectedID);
                    el.parentNode.removeChild(el);

        },
        clearFields:function(){ 
            var fields,fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + "," + DOMstrings.inputValue);
            // console.log("fields>>>",fields);

            fieldsArr =  Array.prototype.slice.call(fields);//Trick to convert the list into an array.

            fieldsArr.forEach(function(curr,index,array){
                curr.value = "";
            });

            fieldsArr[0].focus();
        },
        getDOMstrings:function(){
            return DOMstrings;
        },
        displayPercentages:function(percentageArr){

            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

           nodeListForEach(fields,function(current,index){
            //To do some stuff
            if(percentageArr[index] > 0){
                current.textContent = percentageArr[index] + '%';
            }
            else{
                current.textContent = '---'
            }

           })
        },
        displayBudget:function(obj){
            var type;
            obj.budget > 0 ? type='inc':type='dec';
           document.querySelector(DOMstrings.budgetLabel).textContent = formatter(obj.budget,type);
           document.querySelector(DOMstrings.incomeLabel).textContent = formatter(obj.totalinc,'inc');
           document.querySelector(DOMstrings.expensesLabel).textContent = formatter(obj.totalexp,'exp'); 
           if(obj.percentage > 0){
               document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%";
           }
           else{
                document.querySelector(DOMstrings.percentageLabel).textContent = '--';
           }
            
        }

    }
        
})();

//APP Controller

var controller = (function(budgetCtrl,UICtrl){
    var setEventListeners = function(){

        var DOM = UIController.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
        document.addEventListener('keypress',function($event) {
        
        if($event.keyCode == 13 || $event.which == 13){
            ctrlAddItem();
        }
    })
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
    };

    var updateBudget = function(){

        var budget;
            // 1. Calculate the budget.
            budgetController.calculateBudget();
            // 2. Return the budget.
            budget = budgetController.getBudget();
            //3. Display the budget on the UI.
            UIController.displayBudget(budget);

    };
    updatePercentages = function(){

        //Calculate percentages
        budgetController.calculatePercentages();
        // Read Percentages from the budget controller
        var percentages = budgetController.getPercentages();
        //update the UI with new controller
        UIController.displayPercentages(percentages);

    }
    
    var ctrlAddItem = function() {
        
        var input,newItem;
          //1. Get input data
          input  = UIController.getInput();

          if(input.description !=="" && !isNaN(input.value) && input.value > 0 )
          {
             // 2. Add the item to the budget controller
          newItem = budgetController.addItems(input.type,input.description,input.value)
          //3. Add new item to user interface.
          UIController.addListItem(newItem,input.type);
          //4. Clear fields
          UIController.clearFields();
          //Calculate and update budget
          updateBudget();

          // Calculate and update percentages.
          updatePercentages();

            

          }
        

    };

    var ctrlDeleteItem  = function($event){

        var itemID,splitID,type,index;
       itemID = $event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID){
            
            //item-1
            splitID = itemID.split("-")[1];
            type = itemID.split("-")[0];
            //To delete the data from the array.
            budgetController.deleteItems(splitID,type);
            //To remove the element from the DOM.
            UIController.deleteListItem(itemID);
            updateBudget();
             // Calculate and update percentages.
             updatePercentages();
        }   
        else{

        }

    };

    return {
        init:function(){
            console.log("Application has started");
            var obj = {
                budget:0,
                totalinc:0,
                totalexp:0,
                percentage:-1
            }
            UIController.displayBudget(obj);
            setEventListeners();
        }
    }

})(budgetController,UIController);

controller.init();