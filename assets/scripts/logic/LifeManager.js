var CardSlot = require("card_slot");
/**
 * 
 * 
 * 
 * 负责管理有血量的单位，
 * 在攻击和法术之后默认调用checking，
 * 发现有人等于或低于0血量则触发死亡(动画并更新的数据)
 * 判断是否游戏结束(玩家死亡并转场)
**/
cc.Class({
    extends: cc.Component,
    
    properties: {
        soldierPrefab:{
            default:null,
            type:cc.Prefab
        },
        enemySlots:{
            default:null,
            type:CardSlot
        },
        meSlots:{
            default:null,
            type:CardSlot
        },
        meLifeNode:{
            default:null,
            type:cc.Node
        },
        meLife:30,
        enemyLifeNode:{
            default:null,
            type:cc.Node
        },
        enemyLife:30
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
    getAttackerByTag:function(tag){
        return this.getAttacker(tag.userId, tag.whoId);  
    },
    playDeadAnim:function(userId,whoId,next){
        var node = this.getLivingNode(userId,whoId);
        if(node){
            var player = node.getComponent("attack_shock");
            if(player){
                player.shockAndFadeOut(5,next);
                return;
            }
        }
        console.log("Dead player don't Exist!");
        next({msg:"Dead player don't Exist!"});
    },
    getLivingNode:function(userId,whoId){
        var node = null;
        if(userId === "me"){
            if(whoId === "hero"){
                node = this.meLifeNode;
            }else{
                node = this.meSlots.getCardById(whoId);
            }
        }else
        if(userId === "enemy"){
            if(whoId === "hero"){
                node = this.enemyLifeNode;
            }else{
                node = this.enemySlots.getCardById(whoId);
            }
        }
        return node;
    },
    getAttacker:function(userId,whoId){
        var node = this.getLivingNode(userId,whoId);
        if(node){
            return node.getComponent("attacker");
        }else{
            return null;
        }
    },
    // updateLifeByTag:function(tag,newLifeValue){
    //     this.updateLife(tag.userId,tag.whoId,newLifeValue);
    // },
    // updateLife:function(userId,whoId,newLifeValue){
    //     var attacker = this.getAttacker(userId,whoId);
    //     if(attacker){
    //         setEffectLife(newLifeValue);
    //     }
    // },
    //通过标签搜索分类
    getAttackersByTagForEach:function(tags,it){
        var self = this;
        var ret = [];
        console.log("attacker list by tags:");
        ["me","enemy"].forEach(function(name){
            var slots = self._soldierSlots[name];
            slots.__cards.forEach(function(prefab,index){
                var tagRet = {userId:name,whoId:index}
                var attacker = prefab.getComponent("attacker");
                console.log(attacker.tag+" index:"+index);
                if(tags.every(function(tag){
                    return attacker.tag.indexOf(tag) !== -1;
                })){
                    console.log("userId:"+name+" whoId:"+index,attacker);
                    ret.push([attacker,tagRet]);
                    if(it){
                        it(attacker,tagRet);
                    }
                }
            })
            var heroAttacker = self._heroNodes[name].getComponent("attacker");
            console.log(heroAttacker.tag);
            if(tags.every(function(tag){
                return heroAttacker.tag.indexOf(tag) !== -1;
            })){
                console.log("userId:"+name+" whoId:hero",heroAttacker);
                ret.push([heroAttacker,{userId:name,whoId:"hero"}]);
                if(it){
                    it(heroAttacker,{userId:name,whoId:"hero"});   
                }
            }
        });
        return ret;
    },
    getIterationByString:function(string,it){
        var iterator = {
                current:{
                    val:null,
                    next:null
                },
                link:function(linker){
                    var lastValue = null;
                    if(this.__temp_current){
                        lastValue = this.__temp_current;
                    }else{
                        lastValue = this.current.next;
                    }
                    lastValue.next = linker.current;
                },
                next:function(){
                    //首针
                    if(!this.__temp_current){
                        this.__temp_current = this.current;
                    }
                    var tempVal = this.__temp_current.next?this.__temp_current.next.val:null;
                    this.__temp_current = this.__temp_current.next;
                    return tempVal;
                }
            };
        var enemyIndex = string.indexOf("enemy");
        var meIndex = string.indexOf("me");
        var soldier = string.indexOf("soldier");
        var hero = string.indexOf("hero");
        var allIndex = string.indexOf("all");
        
        var self = this;
        //所有角色
        if(allIndex != -1){
            var it1 = this.getIterationByString("me");
            return this.getiterationByString("enemy",it1);            
        }
        
        if(enemyIndex != -1){
            //全部敌人角色
            if(soldierIndex === -1 && heroIndex === -1){
                var it2 = this.getIterationByString("enemy,soldier");
                return this.getIterationByString("enemy,hero", it2);
            }else
            //全部敌人士兵
            if(soldierIndex > enemyIndex){
                var p = {next:self.iterator.current}
                this.enemySlots.__cards.forEach(function(soldierPrefab){
                    if(!p.next){
                        p.next = {val:null,next:null};
                    }
                    p = p.next;
                    p.val = soldierPrefab.getComponent("attacker");
                });
                return iterator;
            }else
            //敌人英雄
            if(heroIndex > enemyIndex){
                iterator.current.val = this.enemyLifeNode.getComponet("attacker");
                return iterator;
            }
        }
        
        if(meIndex != -1){
            //全部我方角色
            if(soldierIndex === -1 && heroIndex === -1){
                var it3 = this.getIterationByString("me,soldier");
                return this.getIterationByString("me,hero", it3);
            }else
            //全部我方士兵
            if(soldierIndex > meIndex){
                var p = {next:self.iterator.current}
                this.meSlots.__cards.forEach(function(soldierPrefab){
                    if(!p.next){
                        p.next = {val:null,next:null};
                    }
                    p = p.next;
                    p.val = soldierPrefab.getComponent("attacker");
                });
                return iterator;
            }else
            //我方英雄
            if(heroIndex > meIndex){
                iterator.current.val = this.meLifeNode.getComponet("attacker");
                return iterator;
            }
        }
        if(soldierIndex != -1){
            //全部士兵
            if(meIndex === -1 && enemyIndex === -1){
                var it4 = this.getIterationByString("me,soldier");
                return this.getIterationByString("enemy,soldier", it4);
            }else
            if(meIndex > soldierIndex){
                return this.getIterationByString("me,soldier");
            }else
            if(enemyIndex > soldierIndex){
                return this.getIterationByString("enemy,soldier");
            }
        }
        if(heroIndex != -1){
            //全部英雄
            // if(meIndex)
        }
        if(string.indexOf("me")!=-1){
            
        }
        if(it){
            it.link(iterator);
        }else{
            iterator.__temp_current = null;
            return iterator;  
        }
        
    },
    attackingByAttacker:function (attackerWrapper,attackedWrapper){
        
    },
    addNew:function (vec2){
        
    },
    updateSingle:function (vec2){
          
    },
    informDeadsAndUpdateAll:function(deadWrapperList,next){
        var self = this;
        if(deadWrapperList){
            deadWrapperList.forEach(function(wrapper){
                 self.informDeadByWrapper(wrapper);
            })
        }
        this.updateAll(next);
    },
    informDeadByWrapper:function(wrapper){
        if(wrapper && wrapper.userId !== undefined && wrapper.whoTag !== undefined){
            this._cleanTask.push(wrapper);
            return true;
        }
        return false;
    },
    informDead:function(userId,whoTag){
        this._cleanTask.push({userId:userId,whoTag:whoTag});
    },
    updateAll:function (next){
        var finishTotal = 0;
        var self = this;
        var gameEndWrapper;
        if(this._cleanTask.length!==0){
            if(this._cleanTask.some(function(taskWrapper){
                if(taskWrapper.whoTag === 'hero'){
                    gameEndWrapper = taskWrapper;
                    return true;
                }else
                    return false;
            })){
                if(gameEndWrapper.userId === "me"){
                    next({msg:"Sorry,You Lost!"});
                }else{
                    next({msg:"Yeah,You Win!"});
                }
                return;
            }
            this._cleanTask.forEach(function(taskWrapper){
                var cardPrefab = self._soldierSlots[taskWrapper.userId].getCardById(taskWrapper.whoTag);
                cardPrefab.runAction(
                    cc.sequence(
                        cc.fadeOut(2),
                        cc.callFunc(function(){
                            finishTotal = finishTotal+1;
                            if(finishTotal === self._cleanTask.length){
                                //全部动画执行完执行清除操作
                                //清除实体
                                console.log("LifeManager:270 self._soldierSlots:",self._soldierSlots);
                                self._cleanTask.forEach(function(wrapper){
                                    console.log("LifeManager:272 wrapper.userId:",wrapper.userId);
                                    self._soldierSlots[wrapper.userId].removeCard(wrapper.whoTag);
                                });
                                //清除_cleanTask
                                self._cleanTask.length = 0;
                                self._soldierSlots.me.refresh();
                                self._soldierSlots.enemy.refresh();
                                next();
                            }
                        })
                    )
                );
                // self.playDeadAnim(taskWrapper.userId,taskWrapper.whoId,function(){
                    // finishTotal = finishTotal+1;
                    // if(finishTotal === self._cleanTask.length){
                    //     //全部动画执行完执行清除操作
                    //     //清除实体
                    //     console.log("LifeManager:270 self._soldierSlots:",self._soldierSlots);
                    //     self._cleanTask.forEach(function(wrapper){
                    //         console.log("LifeManager:272 wrapper.userId:",wrapper.userId);
                    //         self._soldierSlots[wrapper.userId].removeCard(wrapper.whoTag);
                    //     });
                    //     //清除_cleanTask
                    //     self._cleanTask.length = 0;
                    //     self._soldierSlots.me.refresh();
                    //     self._soldierSlots.enemy.refresh();
                    //     next();
                    // }
                // })
            });
        }else{
            next();
        }
    },
    // use this for initialization
    onLoad: function () {
        this._soldierSlots = {};
        this._soldierSlots.me = this.meSlots;
        this._soldierSlots.enemy = this.enemySlots;
        console.log("LifeManager:290 self._soldierSlots:",this._soldierSlots);
        this._heroNodes = {};
        this._heroNodes.me = this.meLifeNode;
        this._heroNodes.enemy = this.enemyLifeNode;
        this._cleanTask = [];
    },
    start:function(){
    }
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
