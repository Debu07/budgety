//BUDGET CONTROLLER
var budgetController = (function(){

    var Expense=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
        this.percentage=-1;
    };
    Expense.prototype.calcPercentage=function(totalIncome){
        if(totalIncome>0){
            this.percentage=Math.round((this.value/totalIncome)*100);
        }
        
        else{
            this.percentage=-1;
        }

    };

    Expense.prototype.getPercentage=function(){
        return this.percentage;
    };

    var Income=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    };

    var calculateTotal=function(type){
        var sum=0;
        data.allItems[type].forEach(function(current){
            sum=sum+current.value;
        });
        data.totals[type]=sum;

    };
    // this contains all the information about the expenses and income
    var data={
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
    };

    return{

        addItem: function(type,des,val){
            var newItem,ID;

           // [123456], next ID=7
           //[135689] , next ID=10
           //sp ID= last Id+1
           //Last Id= indexOf(no. of elements -1)
           //create new ID
           if(data.allItems[type].length>0){
            ID=data.allItems[type][data.allItems[type].length-1].id + 1;
           }
           else{
               ID=0;
           }
           

           //create new item based on 'exp' or 'inc'
            if(type==='exp'){
                newItem= new Expense(ID,des,val);
            }
            else if(type==='inc'){
                newItem= new Income(ID,des,val);
            }
            //push it into the data structure
            data.allItems[type].push(newItem);

            //return the new element
            return newItem;
           
        },

        deleteItem:function(type,id){
            var ids,index;
            ids=data.allItems[type].map(function(current){
                return current.id;
            });
            index=ids.indexOf(id);
            if(index !== -1){
                data.allItems[type].splice(index,1);
            }
        },

        calculateBudget:function(){
            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            //calculate the budget income-expenses
            data.budget=data.totals.inc-data.totals.exp;

            //calculate the percentage of income that we spent 
            if(data.totals.inc>0){
                data.percentage=Math.round((data.totals.exp/ data.totals.inc)*100);
            }
            else{
                data.percentage=-1;
            }
            // expenses 100 income 200

        },
        calculatePercentages:function(){

            data.allItems.exp.forEach(function(curr){
                curr.calcPercentage(data.totals.inc);
            });

        },
        getPercentages:function(){
            var allPercentages=data.allItems.exp.map(function(curr){
                return curr.getPercentage();
            });
            return allPercentages;
        },
        getBudget:function(){

            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp:data.totals.exp,
                percentage: data.percentage
            };
        }
    };

})();


//UI CONTROLLER
var UIController = (function(){
    var DOMstrings={

        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn',
        incomeContainer: '.income__list',
        expenseContainer:'.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expensesLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage'
    };
    formatnumber=function(num,type){
        var numSplit,int,dec;
        num=Math.abs(num);
        num=num.toFixed(2);
        numSplit=num.split('.');
        int=numSplit[0];
        if(int.length>3){
            int=int.substr(0,int.length-3)+','+int.substr(int.length-3,int.length);
        }
        dec=numSplit[1];
        
        return(type==='exp'?sign='-':sign='+') +' ' + int +'.'+ dec;

    };
    var nodeListForEach =function(list,callback){
        for(var i =0;i<list.length;i++){
            callback(list[i],i);
        }
    };

    return {

        getinput: function(){
            return {
            type: document.querySelector(DOMstrings.inputType).value, //will be either inc or dec
            description: document.querySelector(DOMstrings.inputDescription).value,
            value: parseFloat(document.querySelector(DOMstrings.inputValue).value)


            };
        },

        addListItem: function(obj,type){
            var html,newHtml,element;

            if(type==='inc'){
                element=DOMstrings.incomeContainer;
                html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            else if(type==='exp'){
                element=DOMstrings.expenseContainer;
                html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            newHtml=html.replace('%id%',obj.id);
            newHtml=newHtml.replace('%description%',obj.description);
            newHtml=newHtml.replace('%value%',formatnumber(obj.value,type));

            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

        },

        deleteListItems:function(selectorID){

            var el=document.getElementById(selectorID);
            el.parentNode.removeChild(el);


        },


        clearFields:function(){
            var fields,fieldsArray; 

          fields=  document.querySelectorAll(DOMstrings.inputDescription +', '+ DOMstrings.inputValue);
          fieldsArray=Array.prototype.slice.call(fields);

          fieldsArray.forEach(function(current,index,array){
              current.value="";


          });

          fieldsArray[0].focus();
        },
        displayBudget:function(obj){
            obj.budget>0?type='inc':type='exp';

            document.querySelector(DOMstrings.budgetLabel).textContent=formatnumber(obj.budget,type);
            document.querySelector(DOMstrings.incomeLabel).textContent=formatnumber(obj.totalInc,'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent=formatnumber(obj.totalExp,'exp');

            if(obj.percentage>0){
                document.querySelector(DOMstrings.percentageLabel).textContent=obj.percentage +'%';

            }
            else{
                document.querySelector(DOMstrings.percentageLabel).textContent='---';

            }

        },
        displayPercentages:function(percentages){

            var fields= document.querySelectorAll('.item__percentage');
           
            nodeListForEach(fields,function(current,index){
                //do stuff
                if(percentages[index]>0){
                    current.textContent=percentages[index]+'%';
                }
                else{
                    current.percentages='---';
                }
                

            });


        },
        displayMonth: function(){
            var now,month,year;
            now = new Date();
            //var chrisstmas = new Date(2020, 12, 25);
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
          'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();

            year= now.getFullYear();
            document.querySelector('.budget__title--month').textContent=months[month] + " "+year;
        
        },
        changeType:function(){
            var fields=document.querySelectorAll(DOMstrings.inputType+','+
            DOMstrings.inputDescription+','+  DOMstrings.inputValue);

            nodeListForEach(fields,function(curr){
                curr.classList.toggle('red-focus');
            });
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
            
        },

        getDOMstrings: function(){
            return DOMstrings;

        }


    };
})();


// GLOBAL APP CONTROLLER
var controller = (function(budgetctrl,uictrl){

    var setupEventListener=function(){
        var DOM=uictrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
        document.addEventListener('keypress',function(event){
        
            if(event.keyCode===13||event.which===13){  
                ctrlAddItem();
            }
        });

        document.querySelector('.container').addEventListener('click',ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change',uictrl.changeType);
    };
    var updateBudget= function(){

      //4. calculate the budget
      budgetctrl.calculateBudget();

      var budget = budgetctrl.getBudget();

      //5. display the budget on ui
      uictrl.displayBudget(budget); 
    };
    
    var updatePercentage = function(){
        //calculate percentage
        budgetctrl.calculatePercentages();
        
        //read percentage from the budget controller
        var percentages=budgetctrl.getPercentages();
        //update ui with new percentages

        uictrl.displayPercentages(percentages);

    };

    var ctrlAddItem=function(){

        var input, newItem;
        //1. get the input data
        input =uictrl.getinput();

        if(input.description!=="" &&  !isNaN(input.value)&& input.value>0){
            //2. add the item to the budget controller
        newItem=budgetctrl.addItem(input.type,input.description,input.value);
         
        //3. add the item to the ui also
        uictrl.addListItem(newItem,input.type);
  
        //clearing the fields
        uictrl.clearFields();
  
        //calculate and update budget
        updateBudget();
        updatePercentage();

        }

    };

    var ctrlDeleteItem = function(event){
        var itemId,splitId,type,ID;
        itemId=event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemId){

            splitId=itemId.split('-');
            type=splitId[0];
            ID=parseInt(splitId[1]);

            budgetctrl.deleteItem(type,ID); 

            uictrl.deleteListItems(itemId);
            updateBudget();
            updatePercentage();
        }
    };

    return {
        init:function(){

            //console.log('application has started');
            uictrl.displayMonth();
            uictrl.displayBudget({

                budget:0,
                totalInc:0,
                totalExp:0,
                percentage:-1
            }); 
            setupEventListener();
        }
    };


})(budgetController,UIController) ;

controller.init();