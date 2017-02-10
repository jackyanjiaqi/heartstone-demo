cc.Class({
    extends: cc.Component,

    properties: {
        tipsLabel:{
            default:null,
            type:cc.Label
        },
        SHORT:1,
        LONG:3,
        ALWAYS:-1,
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
    start: function (){
    },
    show: function(text,time,next){
        this.tipsLabel.string = text;
        if(time>0){
            this.scheduleOnce(function() {
                console.log("time end:");
                this.unshow();
                if(next){
                    next();
                }
            }, time);    
        }
    },
    unshow: function(){
        this.tipsLabel.string = "";
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
