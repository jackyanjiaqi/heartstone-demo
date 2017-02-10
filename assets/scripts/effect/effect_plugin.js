cc.Class({
    extends: cc.Component,

    properties: {
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
        this._plugins = {};
    },
    register: function(instruction,proxy){
        this._plugins[instruction]=proxy;
        console.log("effect_plugin:22",this._plugins);
    },
    getProxy: function(key){
        console.log("effect_plugin:25",key,this._plugins);
        return this._plugins[key];
    },
    filter: function(str){
        var args = arguments;
        console.log("effect_plugin:30",args);
        var filtered = Object.keys(this._plugins).filter(
            function(keyValue){
                for(var i=0;i<args.length;i++){
                    if(keyValue.indexOf(args[i]) === -1)
                        return false;
                }
                return true;
            });
        console.log("effect_plugin:39",filtered);
        return filtered;
    },
    removeByFilter: function (){
        
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
