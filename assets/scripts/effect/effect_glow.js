cc.Class({
    extends: cc.Component,

    properties: {
        glowSpriteNode:{
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

    // use this for initialization
    onLoad: function () {
        this.offGlow();
    },

    showGlow: function(){
        this.glowSpriteNode.opacity = 80;  
    },
    
    blink: function(){
        
    },
    
    offGlow: function(){
        this.glowSpriteNode.opacity = 0;
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
