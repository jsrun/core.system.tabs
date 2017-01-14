/**
 *  __          __  _    _____ _____  ______ _______    _         
 *  \ \        / / | |  |_   _|  __ \|  ____|__   __|  | |        
 *   \ \  /\  / /__| |__  | | | |  | | |__     | | __ _| |__  ___ 
 *    \ \/  \/ / _ \ '_ \ | | | |  | |  __|    | |/ _` | '_ \/ __|
 *     \  /\  /  __/ |_) || |_| |__| | |____ _ | | (_| | |_) \__ \
 *      \/  \/ \___|_.__/_____|_____/|______(_)|_|\__,_|_.__/|___/  
 *                                                                            
 *  @author André Ferreira <andrehrf@gmail.com>
 *  @license MIT
 */

"use strict";        

(function(){    
    var config = {content: [{type: 'stack', isClosable: false, activeItemIndex: 1}]};
    var tabsLayout = new GoldenLayout(config, $(".wi-tabs-contents"));
    
    $(window).resize(function(){
        tabsLayout.updateSize($(".wi-tabs-contents").width, $(".wi-tabs-contents").height);
    });
        
    tabsLayout.on('tabCreated', function(container){
        console.log(container);
        container.closeElement.off('click').click(function(){
            if(confirm( 'really close this?' )){
                container.contentItem.remove();
            }
        });
    });
        
    tabsLayout.registerComponent('editor', function(container, state){
        container.getElement().html("<div id='wi-ed-" + state.id + "'></div>");        
                
        setTimeout(function(){
            var settings = webide.settings.getByPattern(/^ace\.editor\..*?$/i);
            var theme = webide.settings.get("ace.editor.theme");                        
            theme = (!theme) ? "ace/theme/twilight" : "ace/theme/" + theme;

            var editor = ace.edit("wi-ed-" + state.id);
            editor.setTheme(theme);

            for(var key in state.settings){
                if(key !== "ace.editor.theme"){
                    if(state.settings[key] == "true") state.settings[key] = true;//Bugfix
                    if(state.settings[key] == "false") state.settings[key] = false;//Bugfix

                    if(!isNaN(parseInt(state.settings[key])))
                        state.settings[key] = parseInt(state.settings[key]);

                    editor.setOption(key.replace(/ace\.editor\./img, ""), state.settings[key]);
                }
            }

            webide.tabs.itens[state.id].editor = editor;
            editor.resize();

            if(typeof webide.tabs.itens[state.id].cb == "function")
                webide.tabs.itens[state.id].cb(state.id, editor);
        }, 100);
    });
    
    tabsLayout.registerComponent('url', function(container, state){
        container.getElement().html("<div id='wi-url-" + state.id + "'></div>");

        webide.getContents("GET", state.path, null, function(data){
            $("#wi-url-" + state.id).html(data);
            webide.forms.bind();

            if(typeof webide.tabs.itens[state.id].cb == "function")
                webide.tabs.itens[state.id].cb(state.id);
        });
    });

    tabsLayout.init();

    webide.tabs = {
        /**
         * List of tabs
         * @type object
         */
        itens: {},
        
        /**
         * Tabs index
         * @type array
         */
        tabIndex: [],
        
        /**
         * Golden Layout
         * @type object
         */
        layout: tabsLayout,
        
        /**
         * Function to add tab item
         * @param string title
         * @param string path
         * @param string type
         * @param string language
         * @return void
         */
        add: function(title, path, type, settings, cb){
            var id = webide.createNamespace(path);
            
            if(!this.has(id)){
                this.itens[id] = {path: path, type: type, settings: settings, cb: cb};
                
                var newItemConfig = {
                    id: id,
                    title: title,
                    type: 'component',
                    componentName: type,
                    componentState: {id: id, path: path, settings: settings, cb: cb}
                };

                if(this.layout.root.contentItems[0])
                    this.layout.root.contentItems[0].addChild(newItemConfig);
            }
            else{
                //focus
            }
        },
       
        /**
         * Functio to remove tab
         * 
         * @param string id
         * @return void
         */
        remove: function(id){
            if(this.has(has))
                this.itens[id] = null;
        },
        
        addToolbar: function(id){   
            
        },
        
        /**
         * Function to check for tab
         * 
         * @param string id
         * @return boolean
         */
        has: function(id){
            return (typeof this.itens[id] == "object");
        },
        
        /**
         * Function to check for tab by path
         * 
         * @param string path
         * @return boolean
         */
        hasByPath: function(path){
            var id = webide.createNamespace(path);
            return this.has(id);
        },
        
        /**
         * Function to focus on a specific tab
         * 
         * @param string id
         * @return void
         */
        focus: function(id){
            if(this.has(id)){
                $(".wi-tabs-list-item-active").removeClass("wi-tabs-list-item-active");
                $(".wi-tabs-contents-item-active").removeClass("wi-tabs-contents-item-active");
                $("#wi-tl-" + id).addClass("wi-tabs-list-item-active");
                $("#wi-tc-" + id).addClass("wi-tabs-contents-item-active");
            }
        },
        
        /**
         * Function to focus on a specific tab by path
         * 
         * @param string path
         * @return void
         */
        focusByPath: function(path){
            var id = webide.createNamespace(path);
            this.focus(id);
        },
        
        /**
         * Function to return all tabs itens
         * 
         * @return object
         */
        getAll: function(){
            return this.itens;
        }
    };    
})();