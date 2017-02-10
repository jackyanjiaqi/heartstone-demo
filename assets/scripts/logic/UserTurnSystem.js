var InstructionSystemInstance = require("InstructionSystem");
var Toast = require("toast");
cc.Class({
    extends: cc.Component,

    properties: {
        InstructionSystem:{
            default:null,
            type:InstructionSystemInstance
        },
        startButton:{
            default:null,
            type:cc.Button
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
    },
    
    start:function (){
        this._turnCounter = {
            _me:0,
            _enemy:0,
            me:{
                set function(val){
                    this._me = val;
                },
                get function(){
                    return this._me;
                }
            },
            enemy:{
                set function(val){
                    this._enemy = val;
                },
                get function(){
                    return this._enemy;
                }
            },
            total:{
                get function(){
                    return this.me + this.enemy;
                }
            }
        };
        this.startGame();
        // var plugin = this.node.getComponent("effect_plugin");
        // plugin.register("@onTurnBegin(@CrystalSystem@newTurn(@arg))");
        // plugin.register("@onTurnBegin(@soldier@add('action'))");
        // plugin.register("@onTurnEnd(@)");
        // 水晶+1
        // this._turnBeginActions["1_CrystalSystem"]={"invoke?newTurn":undefined};
        // //行动数+1
        // this._turnBeginActions["2_soldier"]={"add?action":{action:0}};
        // //行动值清0
        // this._turnEndActions["1_soldier"]={"set?action":{action:0}};
    },
    startGame:function(){
        var self = this;
        // this.__users = ["me","enemy"];
        var users = ["me","enemy"];
        // this.__currentUserIndex = 0;
        var currentUserIndex = 0;
        //初始化水晶
        this.InstructionSystem.CrystalSystem.init();
        //起始手牌 每人抓三张
        // this.InstructionSystem.CardSystem.drawCard(7,this.__users,1,function(){
        //     self.gameingTurn();
        // });
        // this.InstructionSystem.CardSystem.drawCard(7,users,1,userTurn);
        this.InstructionSystem.CardSystem.drawCard(7,users,1,function(){
            self.manuallyStart();
        });
        // this.InstructionSystem.informInstruction("");
        //开始游戏循环

        // this.gameingTurn();
        
        function userTurn(){
            var userId = users[currentUserIndex];
            //玩家回合开始
            self.userTurnBegin(userId,function(){
                //拿一张牌
                self.InstructionSystem.CardSystem.drawCard(1,[userId],0,function(){
                    //执行动作
                    self.InstructionSystem.autoPlay(userId,function(err){
                        //有错误暂停游戏
                        if(err){
                            self.toast.show(err.msg,3);
                        }else{
                            //玩家回合结束
                            self.userTurnEnd(userId);    
                            //下一个玩家回合准备
                            currentUserIndex = (currentUserIndex + 1)%users.length;
                            userTurn(); 
                        }
                    }); 
                });
            });
        //     // self.InstructionSystem.informInstruction(userId+",1",function(err){
        //     //     self.AI.handle(userId,function(err,gameEnd){
        //     //         if(gameEnd){
        //     //             //结束画面
                        
        //     //         }else{
        //     //             self.userTurnEnd(userId);
        //     //             currentUserIndex = (currentUserIndex + 1)%2;
        //     //             userTurn();
        //     //         }
        //     //     })              
        //     // });
        }
    },  //
    
    manuallyStart:function(){
        var self = this;
        self.userTurnBegin("me", function(){
            self.InstructionSystem.CardSystem.drawCard(1,['me'],0,function(){
                self.startButton.interactable = true;
            });
        });
    },
    
    postNewTurn:function(){
        var self = this;
        self.startButton.interactable = false;
         //执行动作
        self.InstructionSystem.autoPlay('me',function(err){
            //有错误暂停游戏
            if(err){
                self.toast.show(err.msg,3);
            }else{
                //玩家回合结束
                self.userTurnEnd('me');    
                //敌方回合准备
                self.userTurnBegin('enemy',function(){
                    self.InstructionSystem.CardSystem.drawCard(1,['enemy'],0,function(){
                        self.InstructionSystem.autoPlay('enemy',function(err){
                            //有错误暂停游戏
                            if(err){
                                self.toast.show(err.msg,3);
                            }else{
                                //敌方回合结束
                                self.userTurnEnd('enemy');
                                //玩家回合准备
                                self.userTurnBegin('me', function(){
                                    self.InstructionSystem.CardSystem.drawCard(1,['me'],0,function(){
                                        self.startButton.interactable = true;
                                    });
                                });                               
                            }
                        });
                    })
                });
            }
        });
    },
    // gameingTurn:function(){
    //     var self = this;
    //     this.__userId = this.__users[this.__currentUserIndex];
    //     this.userTurnBegin(this.__userId, function(){
    //         self.InstructionSystem.autoPlay(self.__userId,function(){
    //             // self.toast.show(self.__userId+" END!",1);
    //             console.log("userTurn END! self:",self);
    //             //玩家回合结束
    //             self.userTurnEnd(self.__userId);
    //             self.__currentUserIndex = (self.__currentUserIndex + 1)%self.__users.length;
    //             self.gameingTurn();
    //         });
    //     });
    //     // this.userTurnBegin(this.__userId, this.onUserTurnBegin,this);
    // },
    // onUserTurnBegin:function(){
    //     console.log("UserTurnBegin this:132",this);
    //     this.InstructionSystem.autoPlay(this.__userId,this.onAutoPlayEnd,this);
    // },
    // onAutoPlayEnd:function(){
    //     var self = this;
    //     console.log("UserTurnBegin this:136",this);
    //     this.userTurnEnd(this.__userId);
    //     self.__currentUserIndex = (self.__currentUserIndex + 1)%self.__users.length;
    //     this.gameingTurn();
    // },
    
    userTurnBegin: function(userId,next){
        this._turnCounter[userId] += 1;
        this.InstructionSystem.CrystalSystem.newTurn(userId);
        //为所有角色增加行动值
        var effect_plugin = this.node.getComponent("effect_plugin");
        var instructions = effect_plugin.filter("stepNormal",userId,"proxy","soldier");
        console.log("UserTurnSystem:150",instructions);
        instructions.forEach(function(key){
            console.log("action plugin system:",instructions);
            var nodePrefab = effect_plugin.getProxy(key);
            nodePrefab.setStep(nodePrefab.getStep()+1);
        });
        this.toast.show(userId+" Turn",1,next);
        //为所有living分配行动值
        //如果userId === "enemy"进入策略系统执行指令
        //如果user === "me"开放用户交互执行指令
        //指令系统有必要知道是否
    },
    
    userTurnEnd: function(userId){
        
        var effect_plugin = this.node.getComponent("effect_plugin");
        var instructions = effect_plugin.filter("stepNormal",userId,"proxy","soldier");
        instructions.forEach(function(key){
            effect_plugin.getProxy(key).setStep(0);
        });
    },
    /**
     * 
     * 一个范例
     * "me,soldier","proxy=.action.add&"
    */
    regUserTurnBeginDoAs: function (whoTag,instruction,proxy){
        this._turnBeginActions[whoTag] = {instructioin:proxy};
    },
    
    regUserTurnEndDoAs: function (whoTag,instruction,proxy){
        
    },
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
