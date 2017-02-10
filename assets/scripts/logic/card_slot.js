cc.Class({
    extends: cc.Component,
    /**
     * 卡牌id从1开始，范围从1到7与slot编号和动画编号一致
     * */
    properties: {
        isShow:false,
        slots:{
            default:[],
            type:[cc.Node]
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
        console.log("card_slot onLoad");
        this.__cards = {1:null,2:null,3:null,4:null,5:null,6:null,7:null,
            forEach:function(it){
                for(var i=1;i<=7;i++){
                    if(this[i]){
                        it(this[i],i);
                    }
                }  
            },
            length:function(){
                var total = 0;
                for(var i=1;i<=7;i++){
                    if(this[i]){
                        total++;
                    }
                }
                return total;
            },
            reorder:function(){
                var fromId = this.getBlankId();  
                if(fromId<=6){
                    for(var i=fromId+1;i<=7;i++){
                        if(this[i]){
                            this[fromId] = this[i];
                            this[i] = null;
                            return this.reorder();
                        }
                    }
                }
            },
            getBlankId:function(){
                for(var i=1;i<=7;i++){
                    if(!this[i])
                        return i;
                }
                return 0;
            }
        }
    },
    start:function (){
    },
    getCount:function (){
        return this.__cards.length();  
    },
    getIdByCard:function (cardPrefab){
        for(var i=1;i<=7;i++){
            if(cardPrefab && this.__cards[i] === cardPrefab){
                return i;
            }
        }
        return -1;
    },
    getCardById: function (id){
        return this.__cards[id];
    },
    removeCard: function (id){
        // var card = this.getCardById(id);  
        // if(card){
        //     this.__cards.splice(id,1);
            // this.__cards = temp;
        // }
        var card = null;
        if(id>=1 && id<=7){
            card = this.__cards[id];
            this.__cards[id] = null;
        }
        return card;
    },
    addCardAndRefresh:function(card){
        var id = this.addCard(card);
        this.refresh();
    },
    addCard: function (card){
        // this.__cards.push(card);
        // return this.__cards.length;
        var id = this.__cards.getBlankId();
        if(id){
            this.__cards[id] = card;
        }
        return id;
    },
    refresh: function (){
        var cards = this.__cards;
        console.log("cards");
        for(var i=0;i<this.__cards.length;i++){
            console.log("index "+i+":",this.__cards[i]);
        }
        if(this.isShow){
            this.slots.forEach(
                function(node,i){
                    console.log("node "+i+":")
                    node.removeAllChildren();
                    var item = cards[i+1];
                    if(item){
                        node.addChild(item);
                    }
                    // if(i<cards.length){
                    //     node.addChild(cards[i]);
                    // }
                });
            console.log("slots:",this.slots);
            console.log("cards:",this.__cards);
            // for(var j=0;j<this.slots.length;j++){
            //     if(j<this.__cards.length){
            //         this.slots[j].addChild(this.__cards[j]);    
            //     }
                
            // }
            // for(var i=0;i<this.__cards.length;i++){
            //     this.slots[i].addChild(this.__cards[i]);
            // }
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
