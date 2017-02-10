var CardSystemInstance = require("CardManager");
var LifeSystemInstance = require("LifeManager");
var CrystalSystemInstance = require("CrystalManager");

var effect_plugin = require("effect_plugin");
var SoldierBehaviorTransfer = require("soldier_behavior");
var Toast = require("toast");
var STATE = require("STATE");
cc.Class({
    extends: cc.Component,

    properties: {
        //水晶系统
        CrystalSystem:{
            default:null,
            type:CrystalSystemInstance
        },
        //卡牌系统
        CardSystem:{
            default:null,
            type:CardSystemInstance
        },
        //生命值系统
        LifeSystem:{
            default:null,
            type:LifeSystemInstance
        },
        //具有士兵行为的卡牌转换系统
        meTransfer:{
            default:null,
            type:SoldierBehaviorTransfer
        },
        enemyTransfer:{
            default:null,
            type:SoldierBehaviorTransfer
        },
        //插件系统
        PluginSystem:{
            default:[],
            type:[effect_plugin]
        },
        // //回合制系统
        // UserTurnSystem:{
        //     default:null,
        //     type:cc.Node
        // },
        UserTurnPlugin:{
            default:null,
            type:effect_plugin
        },
        toast:{
            default:null,
            type:Toast
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
        // console.log("InstructionSystem:63 this.UserTurnSystem",this.UserTurnSystem);
        // this.UserTurnSystem = this.UserTurnSystem.getComponent("UserTurnSystem");
        // console.log("InstructionSystem:65 this.UserTurnSystem",this.UserTurnSystem);
        this._transfer = {};
        this._transfer.me = this.meTransfer;
        this._transfer.enemy = this.enemyTransfer;
        //任务队列
        this._taskList = {};
    },
    start: function(){
        var self = this;
        // this.testCaseDrawCardAndPlayThemAll(function(){
        //     self.testCaseCombat(function(){
        //         console.log("combat end");
        //     })
        // })
        
        // this.testCaseDrawCardAndPlayThemAll(function(){
        //     self.testCaseDrawCardAndPlayThemAll();
        // });
        // this.CrystalSystem.testCaseSetCrystal55();
        // this.testCaseDrawCardAndPlayThemAll();
        // this.CrystalSystem.testCaseSetCrystal55(function(){
        //     self.testCaseDrawCardAndPlayThemAll.bind(self);   
        // });
    },
    removeFromTaskList:function(){
        
    },
    autoPlay:function(userId,next){
        var self = this;
        var enemyId = userId === 'me'?'enemy':'me';
        //检查是否有可用的行动值
        var isAttackable = false;
        var attackableMans = this.LifeSystem.getAttackersByTagForEach([userId,'soldier']).filter(function(attackerArr){
            var attacker = attackerArr[0].node;
            return attacker.getStep() > 0;
        });
        console.log("autoPlay attackableMans:",attackableMans);
        if(attackableMans.length > 0){
            //执行combat命令
            var fromSoldierId = randomSelect(attackableMans)[1].whoId;
            var toSoldierId = randomSelect(this.LifeSystem.getAttackersByTagForEach([enemyId]))[1].whoId;
            this.combat(userId, fromSoldierId, enemyId, toSoldierId, function(err){
                if(err){
                    next(err);
                }else{
                    self.autoPlay(userId,next);    
                }
            });
        }else{
            //检查是否有可用的卡牌
            var isRunnalbe = false;
            var runnalbeCostWithRoutes = this.CrystalSystem.getEnabledCosts(userId);
            if(runnalbeCostWithRoutes.length > 0){
                //执行runACard指令
                var pair = randomSelect(runnalbeCostWithRoutes);
                var playCardId = this.CardSystem.__cardSlots[userId].getIdByCard(pair[0].node);
                this.runACard(userId, playCardId, function(err){
                    console.log("autoPlay runACard End!");
                    if(err){
                        next(err);
                    }else{
                        self.autoPlay(userId,next);
                    }
                });
            }
            else{
                console.log("autoPlay end! next:",next);
                // if(next){
                    next();
                // }
            }
        }
        
        function randomSelect(arr){
            return arr[Math.floor(cc.random0To1()*arr.length)];
        }
    },
    cancelInstruction:function(filterStr){
        
    },
    informInstruction:function(instruction){
        
    },
    testCaseCombat:function(next){
        var self = this;
        this.combat("me", 1, "enmey", "hero", function(err){
            self.combat("enemy", 1, "me", 1,next);
        });
    },
    testCaseDrawCardAndPlayThemAll:function(next){
        var self = this;
        console.log("self:",self);
        self.toast.show("Game Begin!");
        var total = 0;
        var userTurns = ["me","enemy"];
        var i = 0;
        self.CardSystem.drawCard(8,userTurns,i,
        showErrorToast
        //     function(err){
        //         self.runACard("me",1,function(err){
        //             self.runACard("me",2,function(err){
        //                  self.runACard("me",3,function(err){
        //                      self.runACard("me",4,function(err){
        //                         self.runACard("enemy",1,function(err){
        //                           self.runACard("enemy",2,function(err){
        //                               self.runACard("enemy",3,function(err){
        //                                     self.runACard("enemy",4,function(err){
        //                                         console.log("play card end");
        //                                         // next.bind(self);
        //                                         self.combat("me", 1, "enemy", "hero",function(err){
        //                                             self.combat("enemy", 1, "me", 1,function(err){
        //                                                 console.log("combat end");
        //                                                 if(next)next();
        //                                             });
        //                                         });
        //                                     });
        //                                 });
        //                           });
        //                       }); 
        //                     });
        //                 });
        //             }); 
        //         });
        //     }
        );
        function showErrorToast(err){
            if(err){
                self.toast.show(err.msg,1);    
            }
            i=(i+1)%userTurns.length;
            if((++total)<=4){
                self.runACard(userTurns[i],Math.ceil(total/2),showErrorToast); 
            }else
            if(next){
                next();
            }else{
                self.testCaseDrawCardAndPlayThemAll(function(){
                    self.toast.show("All END!");
                });
            }
        }
    },
    analyseInstruction:function(instruction){
        var instructs = instruction.split("?");
        var order = instructs[0];
        if(order === "attack"){
            var params = instructs[1].split(",");
            var fromWhoId = params[0];
            var fromSoldierId = params[1];
            var toWhoId = params[2];
            var toSoldierId = params[3];
            
        }
    },
    magicEffect:function(toWhoId,toSoldierId,effectWrapper,next){
        
    },
    combat:function(fromWhoId,fromSoldierId,toWhoId,toSoldierId,next){
        var self = this;
        var attacker1 = this.LifeSystem.getAttacker(fromWhoId,fromSoldierId);  
        var attacker2 = this.LifeSystem.getAttacker(toWhoId,toSoldierId);
        console.log("attacker1:",attacker1);
        console.log("attacker2:",attacker2);
        if(attacker1 && attacker2){
            //消耗行动值
            attacker1.node.setStep(attacker1.node.getStep()-1);
            //播放动画
            var transfer = this._transfer[fromWhoId];
            transfer.actAttack(
                transfer.getTargetSlotNodeData(fromSoldierId),
                this._transfer[toWhoId].getTargetSlotNodeData(toSoldierId),
                function(err){
                    if(err){
                        next(err);
                    }else{
                        var attacker1Life = attacker1.getEffectLife() - attacker2.getEffectAttack();
                        var attacker2Life = attacker2.getEffectLife() - attacker1.getEffectAttack();
                        // updateLife
                        attacker1.setEffectLife(attacker1Life);
                        attacker2.setEffectLife(attacker2Life);
                        if(attacker1Life <= 0){
                            //通知生命系统
                            self.LifeSystem.informDead(fromWhoId,fromSoldierId);
                            //失去插件效果
                            self.PluginSystem.forEach(function(effect_plugin){
                                effect_plugin.removeByFilter(fromWhoId,"id",fromSoldierId+"");
                            })
                            //更新任务队列
                            self.removeFromTaskList(fromWhoId,fromSoldierId);
                        }
                        if(attacker2Life <= 0){
                            //通知生命系统
                            self.LifeSystem.informDead(toWhoId,toSoldierId);
                            //失去插件效果
                            self.PluginSystem.forEach(function(effect_plugin){
                                effect_plugin.removeByFilter(toWhoId,"id",toSoldierId+"");
                            })
                            //更新任务队列
                            self.removeFromTaskList(toWhoId,toSoldierId);
                        }
                        self.LifeSystem.updateAll(next);
                        // next();
                    }
                }
            );
        }else{
            next({msg:"Cannot find attacker!"}); 
        }
    },
    runACard: function(fromWhoId,cardId,next){
        var self = this;
        var cardPrefab = this.CardSystem.getACard(fromWhoId,cardId);
        var cost = cardPrefab.getComponent("card_cost");
        var soldier = cardPrefab.getComponent("card_soldier");
        
        this.CardSystem.releaseACard(fromWhoId,cardId,function(err){
            console.log("releaseEnd");
            if(err){
                console.log("runACard err:",err.msg);
                next(err);
            }else{
                //随从牌
                if(soldier){
                    var soldierPrefab = cc.instantiate(self.LifeSystem.soldierPrefab);
                    var soldierId = self._transfer[fromWhoId].addInSoldierFromCard(cardPrefab,soldierPrefab);
                    //以下为测试 添加行动系统
                    soldierPrefab._step = 0;
                    soldierPrefab.setStep = function(step){
                        this._step = step;
                        if(step > 0){
                            this.getComponent("effect_glow").showGlow();
                        }else{
                            this.getComponent("effect_glow").offGlow();
                        }
                    };
                    soldierPrefab.getStep = function(){
                        return this._step;
                    }
                    // soldierPrefab.step = {
                    //     set function(step){
                    //         this._step = step;
                    //         if(step > 0){
                    //             this.getComponent("effect_glow").showGlow();
                    //         }else{
                    //             this.getComponent("effect_glow").offGlow();
                    //         }
                    //     },
                    //     get function(){
                    //         return this._step;
                    //     }
                    // };
                    console.log("soldierPrefab",soldierPrefab);
                    //向回合系统注册行动值为每回合+1,回合结束后清0
                    //filter words "stepNormal","proxy","soldier"
                    self.UserTurnPlugin.register(
                        "@"+fromWhoId+"@soldier[@id=="+soldierId+"]@proxy=@stepNormal",soldierPrefab
                    )
                }
                next();
            }
        });
        
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
