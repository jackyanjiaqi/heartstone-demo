cc.Class({
    extends: cc.Component,

    properties: {
        labelTitle:{
            default:null,
            type:cc.Label
        },
        labelSubtitle:{
            default:null,
            type:cc.Label
        },
        labelDescription:{
            default:null,
            type:cc.Label
        },
        title:{
            set: function(val){
                this._title = val;
                if(this.labelTitle){
                    this.labelTitle.string = this._title;
                }
            },
            get: function(){
                return this._title;
            }
        },
        subtitle:{
            set: function(val){
                this._subtitle = val;
                if(this.labelSubtitle){
                    this.labelSubtitle.string = this._subtitle;
                }
            },
            get: function(){
                return this._subtitle;
            }
        },
        description:{
            set: function(val){
                this._description = val;
                if(this.labelDescription){
                    this.labelDescription.string = this._description;
                }
            },
            get: function(){
                return this._description;
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
    start:function (){
        // if(this.labelTitle)
        //     this.labelTitle.string = this.title;
        // if(this.labelSubtitle)
        //     this.labelSubtitle.string = this.subtitle;
        // if(this.labelDescription)
        //     this.labelDescription.string = this.description;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
