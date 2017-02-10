var STATE = require("STATE");
var CrystalSlot = cc.Class({
    name:"CrystalSlot",
    properties: {
        currentCrystal:0,
        currentCrystalMax:0,
        CrystalMax:10,
        currentCrystalLabel:{
            default:null,
            type:cc.Label
        },
        currentCrystalMaxLabel:{
            default:null,
            type:cc.Label
        }
    } 
});
cc.Class({
    extends: cc.Component,

    properties: {
        crystalNames:{
            default:[],
            type:["String"]
        },
        crystalSlots:{
            default:[],
            type:[CrystalSlot]
        }
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        this._registers = {};
        this.crystalNames.forEach(function(tagName){
            self._registers[tagName]=[];
        });
    },
    
    getEnabledCosts:function(tag){
        return this._registers[tag].filter(function(cardCost){
            return cardCost.state === STATE.NORMAL;
        }).map(function(cost,index){
            return [cost,index];
        });
    },
    
    filterCostablesByFilter:function(){
          
    },
    
    start:function (){
        
    },

    testCaseSetCrystal55:function(next){
        this.init();
        var self = this;
        var users = ["me","enemy"];
        var total = 0;
        var i = 1;
        repeatNewTurn();
        
        function repeatNewTurn(){
            total ++;
            i = (i+1)%users.length;
            if(total <=10){
                self.newTurn(users[i]);
                setTimeout(repeatNewTurn,1000);
            }else{
                if(next){
                    next();
                }
            }
        }
    },
    
    init:function (){
        var self = this;
        this.crystalNames.forEach(function(crystalName){
            self.newTurn(crystalName);
        });
    },
    
    getCrystalSlotById:function(userId){
        var id = -1;
        this.crystalNames.forEach(function(name,i){
            if(name === userId){
                id = i;
            } 
        });
        if(id !== -1){
            return this.crystalSlots[id];
        }
        return null;
    },
    
    isCostable:function(tag,cardCost){
        var id = this.routeCost(tag, cardCost);
        //是注册的卡牌
        if(id !== -1){
            //比较当前卡牌消耗值和水晶值
            var slot = this.getCrystalSlotById(tag);
            console.log("CrystalManager:isCostable:102",cardCost.cost,slot.currentCrystal);
            return cardCost.cost <= slot.currentCrystal; 
        }
        return false;
    },
    
    cost:function(tag,cardCost){
        var id = this.routeCost(tag, cardCost);
        //是注册的卡牌
        if(id !== -1){
            //从当前水晶值减去卡牌消耗值
            var slot = this.getCrystalSlotById(tag);
            slot.currentCrystal -= cardCost.cost;
            slot.currentCrystalLabel.string = slot.currentCrystal;
            //移除卡牌引用 还原STATE值到NORMAL
            cardCost.cost = cardCost.initCost;
            cardCost.state = STATE.NORMAL;
            this._registers[tag].splice(id,1);
            this.filterAllRegisterCosts(tag);
            return true;
        }
        return false;
    },
    
    filterAllRegisterCosts:function(userId){
        var self = this;
        var slot = this.getCrystalSlotById(userId);
        if(slot){
            this._registers[userId].forEach(function(cardCost){
                if(cardCost.cost <= slot.currentCrystal){
                    cardCost.state = STATE.NORMAL;   
                }else{
                    cardCost.state = STATE.DISABLE;
                }
            });
        }
    },
    
    getCostableList:function(){
        
    },
    
    routeCost:function(tag,cardCost){
        var regSets = this._registers[tag];
        if(regSets){
            for(var i=0;i<regSets.length;i++){
                if(cardCost === regSets[i]){
                    return i;   
                }
            }
        }
        return -1;
    },
    
    registerCost:function(tag,cardCost){
        var regSets = this._registers[tag];
        if(regSets){
            //
            this._registers[tag].push(cardCost);
            var slot = this.getCrystalSlotById(tag);
            if(cardCost.cost <= slot.currentCrystal){
                cardCost.state = STATE.NORMAL;   
            }else{
                cardCost.state = STATE.DISABLE;
            }
            return this._registers[tag].length - 1;
        }
        return -1;
    },
    
    newTurn: function(userId){
        var crystalSlot = this.getCrystalSlotById(userId);
        if(crystalSlot){
            console.log("CrystalManager 174:cCrystalMax:" +
                crystalSlot.currentCrystalMax + " cCrystal:" +
                crystalSlot.currentCrystal + " CrystalMax:" + 
                crystalSlot.CrystalMax
            );
            //修改当前最大值
            if(crystalSlot.currentCrystalMax + 1<=crystalSlot.CrystalMax){
                crystalSlot.currentCrystalMax ++;
                crystalSlot.currentCrystalMaxLabel.string = crystalSlot.currentCrystalMax;
            }
            //修改当前值
            crystalSlot.currentCrystal = crystalSlot.currentCrystalMax;
            crystalSlot.currentCrystalLabel.string = crystalSlot.currentCrystal;
            //
            this.filterAllRegisterCosts(userId);
        }
    },
    
    updateCurrentCrystalValue:function(userId,newValue){
        var crystalSlot = this.getCrystalSlotById(userId);
        if(crystalSlot){
            crystalSlot.currentCrystal = newValue;
            crystalSlot.currentCrystalLabel.string = newValue;
            //
            this.filterAllRegisterCosts(userId);
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
