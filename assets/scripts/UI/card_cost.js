var STATE = require("STATE");
cc.Class({
    extends: cc.Component,

    properties: {
        labelCost:{
            default:null,
            type:cc.Label
        },
        state:{
            set: function(state){
                this._state = state;
                var effector = this.node.getComponent("effect_number");
                if(effector){
                    switch(this._state){
                        case STATE.NORMAL:
                            if(this.haveEffect()){
                                effector.changeColor("cost","green");    
                            }else{
                                effector.changeColor("cost","white");    
                            }
                            break;
                        case STATE.DISABLE:
                            effector.changeColor("cost","red");
                            break;
                    }    
                }
            },
            get: function(){
                return this._state;
            }
        },
        initCost:10,
        cost:{
            set :function(val){
                this._cost = val;
                if(this.labelCost){
                    this.labelCost.string = this._cost;   
                }
            },
            get :function(){
                return this._cost;
            }
        },
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

    addEffect:function(effectName,tagObj){
        this._effects[effectName] = tagObj;
        this.state = this.state;
    },
    
    haveEffect:function(){
        for(var p in this._effects){
            if(this._effects[p]){
                return true;
            }    
        }
        return false;
    },
    
    removeEffect:function(effectName){
        this._effects[effectName] = null;
        this.state = this.state;
    },
    
    // use this for initialization
    onLoad: function () {
        this._effects = {};
    },
    
    start: function() {
        // this.labelCost.string = this.cost;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});