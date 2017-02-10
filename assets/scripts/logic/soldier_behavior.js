var CardSlot = require("card_slot");
var AttackShock = require("attack_shock");
cc.Class({
    extends: cc.Component,

    properties: {
        slots:{
            default:null,
            type:CardSlot
        },
        addTag:"",
        positionSets:{
            default:null,
            type:cc.Node
        },
        attackShock:{
            default:null,
            type:AttackShock
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
    },

    addInSoldierFromCard:function (cardPrefab,soldierPrefab){
        // var new_soldier = cc.instantiate(soldierPrefab);
        var new_soldier = soldierPrefab;
        var attacker = new_soldier.getComponent("attacker");
        var card_soldier = cardPrefab.getComponent("card_soldier");
        console.log("transform soldier,attack:"+card_soldier.attack+",life:"+card_soldier.life);
        attacker.tag = attacker.tag + this.addTag;
        // console.log("transform attacker._attack before:"+attacker._attack);
        // console.log("transform attacker._life before:"+attacker._attack);
        // console.log("transform attacker._effectAttack before:"+attacker._attack);
        // console.log("transform attacker._effectLife before:"+attacker._attack);
        
        attacker.setAttackValue(card_soldier.attack);
        attacker.setEffectAttack(card_soldier.attack);
        attacker.setLifeValue(card_soldier.life);
        attacker.setEffectLife(card_soldier.life);
        
        // console.log("transform attacker._attack after:"+attacker._attack);
        // console.log("transform attacker._life after:"+attacker._attack);
        // console.log("transform attacker._effectAttack after:"+attacker._attack);
        // console.log("transform attacker._effectLife after:"+attacker._attack);
        new_soldier.setPosition(cc.p(0,0));
        var returnId = this.slots.addCard(new_soldier);
        this.slots.refresh();
        return returnId;
    },
    
    actAttack:function(actorNode,targetNode,next){
        var self = this;
        var initPosition = cc.p(actorNode.position.x,actorNode.position.y);
        var targetPosition = cc.p(targetNode.position.x,targetNode.position.y);
        var action = cc.sequence(
            cc.moveTo(0.3,targetPosition).easing(cc.easeIn(3.0)),
            cc.callFunc(function(err){
                console.log("cc.callFunc err:",err);
                self.attackShock.shock(0.3);
                var nextAction = cc.sequence(
                    cc.moveTo(0.3, initPosition).easing(cc.easeOut(3.0)),
                    cc.callFunc(function(){
                        next();
                    })
                );
                actorNode.runAction(nextAction);
            })
        );
        actorNode.runAction(action);
    },
    
    getTargetSlotNodeData:function(nameId){
        if(nameId === "hero"){
            return this.positionSets.getChildByName(nameId);
        }else 
            return this.positionSets.getChildByName("slot"+nameId);
    },
    
    removeBackToCard:function() {
        
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
