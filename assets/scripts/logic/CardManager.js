var STATE = require("STATE");
var cards = require("CardStack");
var CrystalSystem = require("CrystalManager");
cc.Class({
    extends: cc.Component,
    
    properties: {
        crystalSystem:{
            default:null,
            type:CrystalSystem
        },
        enemyCardSlot:{
            default:null,
            type:cc.Node
        },
        myCardSlot:{
            default:null,
            type:cc.Node
        },
        drawCardAnimShower:{
            default:null,
            type:cc.Node
        },
        soldierPrefab:{
            default:null,
            type:cc.Prefab
        },
        magicPrefab:{
            default:null,
            type:cc.Prefab
        },
        cardBackPrefab:{
            default:null,
            type:cc.Prefab
        },
        toast:{
            default:null,
            type:cc.Node
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
    onLoad:function(){
        this.__cardSlots = {};
        this.__cardSlots.me = this.myCardSlot.getComponent("card_slot");
        this.__cardSlots.enemy = this.enemyCardSlot.getComponent("card_slot");
        this.toast = this.toast.getComponent("toast");
        this.toast.show("welcome to HeartStone!",1);
    },
    start:function (){
        // this.testCase3();
        var self = this;
        
        // this.crystalSystem.testCaseSetCrystal55(function(){
        //     self.testCase3();
        // });
    },
    testCase1:function(){
        var self = this;
        var slot = this.__cardSlots.me;
        this.drawCard(4, ["me","enemy"],0,function(err){
            if(err){
                self.toast.show(err.msg,1);
            }else{
                // setTimeout(function(){
                    self.releaseACard("me", 1, function(err){
                        if(err){
                            self.toast.show(err.msg,-1);
                        }else{
                            self.releaseACard("enemy", 2, function(err){
                                if(err){
                                    self.toast.show(err.msg,-1);
                                }else{
                                    self.drawCard(3, ["enemy","me"], 0, function(){
                                        console.log("all play end");            
                                    })    
                                }
                            });    
                        }
                    });    
                // },1000);    
            }
        });
    },
    testCase2:function(){
        var self = this;
        var slot = this.__cardSlots.me;
        this.drawCard(4, ["me","enemy"],0,function(err){
            self.releaseACard("me", 1, function(err){
                self.drawCard(4,["enemy","me"],0,function(err){
                    self.releaseACard("me", 2, function(err){
                        self.drawCard(1, ["me"], 0, function(err){
                            self.releaseACard("enemy", 3, function(err){
                                self.releaseACard("enemy", 2, function(err){
                                    self.releaseACard("enemy", 1, function(err){
                                        self.releaseACard("enemy", 4, function(err){
                                        });
                                    });
                                });
                            });
                        });
                    });
                }); 
            });
        });
    },
    testCase3:function(){
        var self = this;
        this.drawCard(8, ["enemy","me"],0,function(err){
        if(err){
          self.toast.show(err.msg,-1);
          return;
        }
        // setTimeout(function(){
             self.releaseACard("me", 3, function(err){
                    if(err){
                        self.toast.show(err.msg,-1);
                        return;
                    }
                    self.releaseACard("me", 2, function(err){
                        if(err){
                            self.toast.show(err.msg,-1);
                            return;
                        }
                        self.releaseACard("me", 1, function(err){
                            if(err){
                                self.toast.show(err.msg,-1);
                                return;
                            }
                            self.releaseACard("me", 4, function(err){
                                if(err){
                                    self.toast.show(err.msg,-1);
                                    return;
                                }
                            });
                        });
                    });     
                });
        // },100);
        });
    },
    drawCard:function(times,userTurn,fromUserIndex,next){
        var roles = userTurn;
        var isTakeTurn = roles.length>1;
        var index = fromUserIndex;
        var total = 0;
        //轮流发牌
        console.log("times:",++total);
        var slot = this.__cardSlots[roles[index]];
        var newCard = this.createCardPrefabFromStack();
        newCard.setPosition(cc.p(0,0));
        
        var cardID = slot.addCard(newCard);
        if(cardID === 0){
            //没有位置放置卡牌
            if(next){
                next({msg:"no more card slot!"});
            }
            return;
        }
        //此处关联水晶系统
        var cardCost = newCard.getComponent("card_cost");
        this.crystalSystem.registerCost(roles[index],cardCost);
        
        var self = this;
        //对方的牌需要翻面显示
        if(roles[index] === "enemy"){
            newCard = cc.instantiate(self.cardBackPrefab);
            newCard.setPosition(cc.p(0,0));
            cardID = 0;
        }
        this.drawCardAnimShower.getComponent("draw_a_card").playADrawingAnim(
            newCard,cardID,callBack);
       
          
        function callBack(){
            console.log("index:",index);
            if(roles[index] === "me"){
               self.__cardSlots.me.refresh();
            }else
            if(roles[index] === "enemy"){
                //与card_back_slot关联
                var back_comp = self.__cardSlots.enemy.node.getComponent("card_back_slot");
                if(back_comp){
                    back_comp.setCardNum(self.__cardSlots.enemy.getCount());
                }  
            }
            if(total<times){
                if(isTakeTurn){
                    index = (index + 1)%roles.length;    
                }
                console.log("times:",++total);
                slot = self.__cardSlots[roles[index]];
                newCard = self.createCardPrefabFromStack();
                newCard.setPosition(cc.p(0,0));
                cardID = slot.addCard(newCard);
                if(cardID === 0){
                    //没有位置放置卡牌
                    if(next){
                        next({msg:"no more card slot!"});
                    }
                    return;
                }
                //此处关联水晶系统
                var cardCost = newCard.getComponent("card_cost");
                self.crystalSystem.registerCost(roles[index],cardCost);
                //对方的牌需要翻面显示
                if(roles[index] === "enemy"){
                    newCard = cc.instantiate(self.cardBackPrefab);
                    newCard.setPosition(cc.p(0,0));
                    cardID = 0;
                }
                self.drawCardAnimShower.getComponent("draw_a_card").playADrawingAnim(newCard,cardID,callBack);
                // index = (index + 1)%2;
            }else{
                if(next)setTimeout(next,10);
            }
        }  
    },
    releaseACard:function(fromWhoId,cardId,next){
        console.log("release start");
        var self = this;
        var slot = this.__cardSlots[fromWhoId];
        var card = slot.getCardById(cardId);
        // var card = slot.removeCard(cardId);
        if(card === null){
            if(next){
                next({msg:"cardId:"+cardId+" don't exist!"});
            }
            return;
        }
        if(!self.crystalSystem.isCostable(fromWhoId,card.getComponent("card_cost"))){
            if(next){
                next({msg:"Not enough crystal!"});
            }
            return;
        }
        card = slot.removeCard(cardId);
        self.crystalSystem.cost(fromWhoId,card.getComponent("card_cost"));
        // console.log("slot left:",slot.__cards.length);
        // slot.refresh();
        // setTimeout(next,1000);
        
        var playingId = -1;
        if(fromWhoId === "me"){
            playingId = cardId;
        }else
        if(fromWhoId === 'enemy'){
            //与card_back_slot关联
            var back_comp = self.__cardSlots.enemy.node.getComponent("card_back_slot");
            if(back_comp){
                back_comp.setCardNum(self.__cardSlots.enemy.getCount());
            } 
            playingId = 0;
        }
        self.__cardSlots[fromWhoId].refresh();
        console.log("release begin");

        self.drawCardAnimShower.getComponent("draw_a_card").playAReleaseAnim(card,playingId,function(){
            //结束动画后再更新牌堆
            // self.__cardSlots[fromWhoId].refresh();  
            if(next)setTimeout(next,10);
        });
    },
    getACard:function(fromWhoId,cardId){
        var slot = this.__cardSlots[fromWhoId];
        return slot.getCardById(cardId);
    },
    drawACardOnce:function(){
        
    },
    // drawACardOnce:function(){
    //     //生成卡牌并添加到卡牌逻辑槽中
    //     var cardPrefab = this.createCardPrefabFromStack();
    //     this.temp_new_card = cc.instantiate(cardPrefab);
    //     this.slot_index = this.__cardSlots.me.addCard(cardPrefab);
    //     //添加动画角色并播放动画
    //     if(!this._player){
    //         this._player = this.drawCardAnimShower.getComponent(cc.Animation);    
    //     }
    //     console.log("anim:",this._player);
    //     this.temp_new_card.setPosition(cc.p(0,0));
    //     this.drawCardAnimShower.addChild(this.temp_new_card);
    //     this._player.play("draw_a_card");    
    // },
    createCardPrefabFromStack:function (){
        var cardIndex = Math.floor(cc.random0To1()*cards.length);
        var card = cards[cardIndex];
        var ret = null;
        if(card.type == "soldier"){
            ret = cc.instantiate(this.soldierPrefab);
            var component_card_base = ret.getComponent("card_base");
            component_card_base.description = "I am a soldier";
            
            var component_card_cost = ret.getComponent("card_cost");
            
            component_card_cost.initCost = card.cost;
            component_card_cost.cost = card.cost;
            component_card_cost.state = STATE.NORMAL;
            
            var component_card_soldier = ret.getComponent("card_soldier");
            component_card_soldier.attack = card.attack;
            component_card_soldier.life = card.life;
        }else
        if(card.type == "magic"){
            ret = cc.instantiate(this.magicPrefab);
            var component_card_base = ret.getComponent("card_base");
            component_card_base.title = "life:-"+card.attack;
            component_card_base.description = card.target;
            
            var component_card_cost = ret.getComponent("card_cost");
            component_card_cost.initCost = card.cost;
            component_card_cost.cost = card.cost;
            component_card_cost.state = STATE.NORMAL;
        }
        return ret;
    }
});