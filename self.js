var budgetController = (function(){

    var Expense = function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    };

    var Income = function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    };
    var calculateTotal = function(type){
        var sum=0;
        data.allItems[type].forEach(function(current){
            sum+=current.value;
        });
        data.totals[type]=sum;
    };

    // data structure for our data by the user, incomes,expenses and sum

    var data={
        allItems:{
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0,
        },
        budget:0,
        percentage:-1
    };

    return{

        addItem:function(type,desc,val){

            var newItem,ID,typeofData;
            typeofData=data.allItems[type];
            if(typeofData.length>0){
                ID=typeofData[typeofData.length-1].id +1;
            }
            else{
                ID=0;
            }
            if(type==='exp'){
                newItem= new Expense(ID,desc,val);
            }
            else if(type==='inc'){
                newItem= new Income(ID,desc,val);
            }

            typeofData.push(newItem);
            return newItem;
        },

        calculateBudget:function(){

            calculateTotal('exp');
            calculateTotal('inc');

            data.budget=data.totals.inc-data.totals.exp;

            if(data.totals.inc>0){           
                 data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
            }
            else{
                data.percentage=-1;
            }

        },
        getBudget:function(){
            return{
                budget:data.budget,
                totalInc: data.totals.inc,
                totalsExp:data.totals.exp,
                percentage: data.percentage

            };
        },

        testing:function(){
            console.log(data);
        }
    };


})();

var UIController=(function(){
    var DOMStrings={
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
    return{
        getInput:function(){

            return{
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)

            };
        },
        addListItem:function(obj,type){
            //1. add HTML with placeholder
            var html,newHtml,element;
            if(type==="inc"){
                element=DOMStrings.incomeContainer;
                html='<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>';
            }
            else if(type==='exp'){
                element=DOMStrings.expenseContainer;
    
               html='<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div><div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div>  </div> </div>';
            }
    
            //2. replace placeholder with actual text and input from user
            newHtml=html.replace('%id%',obj.id);
            newHtml=newHtml.replace('%description%',obj.description);
            newHtml=newHtml.replace('%value%',obj.value);
    
            //3. insert that HTML to DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
    
    
        },

        clearFields:function(){
            var fields,fieldsArray; 

          fields=document.querySelectorAll(DOMStrings.inputDescription +', '+ DOMStrings.inputValue);
          fieldsArray=Array.prototype.slice.call(fields);

          fieldsArray.forEach(function(current,index,array){
              current.value="";


          });

          fieldsArray[0].focus();
        },

        displayBudget:function(obj){

        },

        getDOMStrings:function(){
            return DOMStrings;
        }

    };

})();

var controller= (function(budgetCtrl,UICtrl){

    var setupEventListeners= function(){
        var DOM = UICtrl.getDOMStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click',function(){});
        document.addEventListener('keypress',function(event){
            if(event.keyCode===13||event.which===13){
                ctrlAddItem();
            }
        });

    };

    var updateBudget =function(){
        // calculate the budget
        budgetCtrl.calculateBudget();

        //return the budget
        var budget=budgetCtrl.getBudget();

        //update the UI
        console.log(budget);

    };

    var ctrlAddItem = function(){
        var input=UICtrl.getInput();
        if(input.description!==""&& input.value>0&& input.value!==NaN){
            var newItem=budgetCtrl.addItem(input.type,input.description,input.value);

            UICtrl.addListItem(newItem,input.type);

            UICtrl.clearFields();
        }
            
        updateBudget();

    };

    return{

        init:function(){
            console.log("appleicationjewfjwe jfwehfuewdw");
            setupEventListeners();

        }
    };

})(budgetController,UIController);
controller.init();