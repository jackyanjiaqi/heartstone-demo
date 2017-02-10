cc.Class({
    extends: cc.Component,

    properties: {
        labelNames:{
            default:[],
            type:["String"]
        },
        testLabels:{
            default:[],
            type:[cc.Label]
        },
        minusWarnPercentRed:1,
        addWarnPercentGreen:1,
        defaultWhiteFont:{
            default:null,
            url:cc.Font
        },
        minusRedFont:{
            default:null,
            url:cc.Font
        },
        addGreenFont:{
            default:null,
            url:cc.Font
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
    changeColor:function (name,color){
        var id = this.getIdByName(name);
        var label;
        if(id != -1){
            label = this.testLabels[id];
            switch(color){
                case "white":
                    label.file = this.defaultWhiteFont;
                    break;
                case "green":
                    label.file = this.addGreenFont;
                    break;
                case "red":
                    label.file = this.minusRedFont;
                    break;
                default:
            }
        }
    },
    getIdByName:function(name){
        for(var i=0;i<this.labelNames.length;i++){
            if(this.labelNames[i] === name){
                console.log("effect_number.getIdByName,name:"+name+",i:"+i);
                return i;
            }
        }
        return -1;
    },
    setValueByName:function(name,newVal,matchValue){
        var id = this.getIdByName(name);
        var label;
        if(id != -1){
            label = this.testLabels[id];
            if(newVal/matchValue>this.addWarnPercentGreen){
                label.file = this.addGreenFont;
            }else
            if(newVal/matchValue<this.minusWarnPercentRed){
                label.file = this.minusRedFont;
            }else{
                label.file = this.defaultWhiteFont;
            }
            label.string = newVal;
        }
        
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
