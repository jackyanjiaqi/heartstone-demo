cc.Class({
    extends: cc.Component,

    properties: {
        //攻击力防御力
        attack_val:10,
        life_val:10,
        tag:""
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
        if(this._attack === undefined){
            this.setAttackValue(this.attack_val);
        }
        if(this._effectAttack === undefined){
            this.setEffectAttack(this.attack_val);
        }
        if(this._life === undefined){
            this.setLifeValue(this.life_val);
        }
        if(this._effectLife === undefined){
            this.setEffectLife(this.life_val);
        }
    },
    setAttackValue:function(val){
        this._attack = val;
    },
    setLifeValue:function(val){
        this._life = val;
    },
    setEffectAttack:function(val){
        var effector = this.node.getComponent("effect_number");
        if(effector){
            console.log("setEffectAttack(val),attack,"+val+","+this._attack);
            effector.setValueByName("attack",val,this._attack);
        }
        this._effectAttack = val;
    },
    setEffectLife:function(val){
        var effector = this.node.getComponent("effect_number");
        if(effector){
            console.log("setEffectLife(val),life,"+val+","+this._life);
            effector.setValueByName("life",val,this._life);
        }
        this._effectLife = val;
    },
    getEffectAttack:function(){
        return this._effectAttack;
    },
    getEffectLife:function(){
        return this._effectLife;
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
