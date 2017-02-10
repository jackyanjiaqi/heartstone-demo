cc.Class({
    extends: cc.Component,

    properties: {
        //卡牌原型
        cardPrefab:{
            default:null,
            type:cc.Prefab
        },
        placeTo:3
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
    start: function(){
        // if(this.cardPrefab){
        //     this.playADrawingAnim(this.cardPrefab, this.placeTo, null);
        // }
    },
    playAReleaseAnim:function (cardPrefab,fromPlace,callBack){
        this.__playingId = 2;
        this.__temp_prefab = cardPrefab;
        this.__temp_callback = callBack;

        var preview_fab = cc.instantiate(cardPrefab);
        preview_fab.setPosition(cc.p(0,0));
        this.node.addChild(preview_fab);
        var controller = this.player.play("place_to_slot"+fromPlace);
        controller.wrapMode = cc.WrapMode.Reverse;
        // this.node.opacity = 0;
        // controller.speed = -1;
    },
    onAnimStart:function (){
        if(this.__playingId === 2){
            console.log("anim release end");
            
            this.__playingId = 0;
             this.node.removeAllChildren();
            if(this.__temp_callback){
                this.__temp_callback(null,this.__temp_prefab);
            }   
            
        }else
        if(this.__playingId === 1){
            console.log("anim draw start");
        }
    },
    playADrawingAnim:function (cardPrefab,placeTo,callBack){
        this.__playingId = 1;
        this.__temp_prefab = cardPrefab;
        var preview_fab = cc.instantiate(cardPrefab);
        preview_fab.setPosition(cc.p(0,0));
        this.node.addChild(preview_fab);
        var controller = this.player.play("draw_a_card");
        this.__temp_index = placeTo;
        this.__temp_callback = callBack;
    },
    onDrawEnd: function(){
        if(this.__playingId === 1){
            this.player.play("place_to_slot"+this.__temp_index);    
        }
    },
    onPlaceEnd: function(){
        if(this.__playingId === 1){
            console.log("anim draw end");
            this.__playingId = 0;
            this.node.removeAllChildren();
            if(this.__temp_callback){
                this.__temp_callback(null,this.__temp_prefab);
            }
        }else
        if(this.__playingId === 2){
            console.log("anim release start");
            // this.node.opacity = 255;
        }
    },
    // use this for initialization
    onLoad: function () {
        this.player = this.getComponent(cc.Animation);
    },
    clearState:function (){
        this.__playingId = 0;
        this.__temp_callback = null;
        this.__temp_index = -1;
        this.__temp_prefab = null;
    },
    drawACardToIndex(indexPos){
        
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
    // },
});
