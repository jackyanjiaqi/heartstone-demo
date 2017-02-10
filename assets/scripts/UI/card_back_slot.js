cc.Class({
    extends: cc.Component,

    properties: {
        numbers:-1
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
        // this.setCardNum(this.numbers);
    },
    start: function (){
        this.setCardNum(this.numbers);
    },
    setCardNum:function(cardNum){
        if(cardNum>=0 && cardNum<=7){
            // if(cardNum != this.numbers){
                this.numbers = cardNum;
                console.log(this.node);
                var children = this.node.getChildren();
                for(var i=1;i<=7;i++){
                    var cardNode = this.node.getChildByName("card_back_"+i);
                    // console.log("number "+i,cardNode);
                    if(i<=cardNum){
                        cardNode.opacity = 255;
                    }else{
                        cardNode.opacity = 0;    
                    }
                }
            // }
        }
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        //   this.node.opacity -= 1;
        // this.setCardNum(this.numbers);
    }
});
