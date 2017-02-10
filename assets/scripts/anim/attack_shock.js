cc.Class({
    extends: cc.Component,

    properties: {
        //抖动的实体
        // shockNode: {
        //     default:null,
        //     type:cc.Node
        // },
        //初始抖动方向
        shockInitDirection:new cc.Vec2(1,1),
        //抖动的次数
        shockTimes:3,
        //初始偏移量
        shockOffsetInit:5,
        //一次抖动的减少量
        shockOffsetMinusOnce:0.5,
        //持续时间
        shockOffsetDuration:0.4
        
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
        // this.shockNode.runAction(this.setAttackShockAction());
    },
    start:function (){
        // this.shockAndFadeOut(0.4, function(){
        //     console.log("OK!");
        // })
    },
    fadeOut:function(){
        
    },
    shockAndFadeOut:function(duration,next){
        var self = this;
        this.node.runAction(
            cc.sequence(
                self.setAttackShockAction(duration),
                cc.fadeOut(duration),
                cc.callFunc(function(){
                    next();
                })
            )
        );
    },
    shock:function(){
        this.node.runAction(this.setAttackShockAction());
    },
    setAttackShockAction : function (duration,times,directionVect,offsetInit){
        var shockActions = [];
        var cOffset = offsetInit?offsetInit:this.shockOffsetInit;
        var duration = duration?duration:this.shockOffsetDuration;
        var direction = directionVect?directionVect:this.shockInitDirection;
        var shockTimes = times?times:this.shockTimes;
        var xOffset = direction.x * cOffset;
        var yOffset = direction.y * cOffset;
        for(var i=0;i<shockTimes*2;i++){
            duration = duration/2;
            var action = cc.moveBy(duration,cc.p(xOffset,yOffset));
            shockActions.push(action);
            direction.x = -direction.x;
            direction.y = -direction.y;
            xOffset = direction.x * (2*Math.abs(xOffset)-this.shockOffsetMinusOnce);
            yOffset = direction.y * (2*Math.abs(yOffset)-this.shockOffsetMinusOnce);
        }
        //返回原点
        shockActions.push(cc.moveTo(duration,cc.p(0,0)));
        return cc.sequence(shockActions);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
