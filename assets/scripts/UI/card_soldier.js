cc.Class({
    extends: cc.Component,

    properties: {
        labelLife:{
            default:null,
            type:cc.Label
        },
        labelAttack:{
            default:null,
            type:cc.Label
        },
        life:{
            set :function(val){
                this._life = val;
                if(this.labelLife){
                    this.labelLife.string = this._life;   
                }
            },
            get :function(){
                return this._life;
            }
        },
        attack:{
            set :function(val){
                this._attack = val;
                if(this.labelAttack){
                    this.labelAttack.string = this._attack;
                }
            },
            get :function(val){
                return this._attack;
            }
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
    start: function () {
        // this.labelAttack.string = this.attack;
        // this.labelLife.string = this.life;
    }
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
