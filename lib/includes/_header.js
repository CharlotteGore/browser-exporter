    __dirname = "browserx";
    __filename = "browserx";

    if(typeof global === 'undefined'){
        if(window){
            var global = window;
        } else {
            var global = {};
        }
    }

    if(typeof process === 'undefined'){

        process = {
            cwd : function(){ return 'browserx'; },
            arch : "browser",
            platform : "browser",
            memoryUsage : function(){ return 0; },
            exit : function(){ return false; },
            execPath : "browserx",
            argv : []
        };
    }

    var require = (function(){

        var exportsObjects = {};

        var require = function( id ){

            if(exportsObjects.hasOwnProperty(id)){
                return exportsObjects[id];
            }

            var $module = {
                id : id,
                parent : null,
                children : [],
                exports : {},
                filename : '',
                loaded : false
            };

            $module.require = function(id){

                return require.call($module, id);

            }

            exportedModules[id].call($module.exports, require, $module, $module.exports);
            exportsObjects[id] = $module.exports;
            return exportsObjects[id];

        };
        
        return require;

    })();

    var exportedModules = {};