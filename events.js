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

webide.module("tabs", function(){    
    var tabsLayout = new GoldenLayout({content: []}, $(".wi-tabs-contents"));
    
    //Update with resize
    $(window).resize(function(){
        tabsLayout.updateSize($(".wi-tabs-contents").width, $(".wi-tabs-contents").height);
    });
    
    //Bind onclose tab
    tabsLayout.on('tabCreated', function(container){
        container.closeElement.off('click').click(function(){
            webide.tabs.remove(container.contentItem.container.id, function(){
                container.contentItem.remove();
            });
        });
    });        
    
    //Register url type
    tabsLayout.registerComponent('url', function(container, state){
        container.id = state.id;
        container.getElement().html("<div id='wi-url-" + state.id + "'></div>");
        webide.tabs.itens[state.id].container = container;

        webide.getContents("GET", state.path, null, function(data){
            $("#wi-url-" + state.id).html(data);
            //webide.forms.bind();

            if(typeof webide.tabs.itens[state.id].cb == "function")
                setTimeout(function(state){ webide.tabs.itens[state.id].cb(state.id); }, 300, state);
        });
    });    

    tabsLayout.init();

    this.extends("tabs", {
        /**
         * List of tabs
         * @type object
         */
        itens: {},
        
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
         * @param string settings
         * @param function cb
         * @param function onclose
         * @return void
         */
        add: function(title, path, type, settings, cb, onclose){
            var id = this.createNamespace(path);
            
            if(!this.has(id)){
                this.itens[id] = {path: path, type: type, settings: settings, cb: cb, onclose: onclose};
                
                if(!this.layout.root.contentItems[0])
                    this.layout.root.addChild({type: 'stack'});
                
                var item = {
                    id: id,
                    title: title,
                    type: 'component',
                    componentName: type,
                    tooltip: path,
                    componentState: {id: id, path: path, settings: settings, cb: cb, onclose: onclose}
                };
                
                for(var key in settings)
                    item[key] = settings[key];
                                        
                this.layout.root.contentItems[0].addChild(item);
            }
            else{
               this.focus(id);
            }
        },
        
        /**
         * Function to get title if exists
         * 
         * @param string id
         * @return string
         */
        getTitle: function(id){
            if(this.layout.root.contentItems[0])
                return (this.layout.root.contentItems[0].getItemsById(id).length > 0) ? this.layout.root.contentItems[0].getItemsById(id)[0].config.title : "";
            else
                return "";
        },
        
        /**
         * Function to set title
         * 
         * @param string id
         * @param string newtitle
         * @return boolean
         */
        setTitle: function(id, newtitle){
            if(this.layout.root.contentItems[0]){
                if(this.layout.root.contentItems[0].getItemsById(id).length > 0){
                    this.layout.root.contentItems[0].getItemsById(id)[0].setTitle(newtitle);
                    return true;
                }
                else{
                    return false;
                }
            }
            else{
                return false;
            }
        },
        
        /**
         * Function to return actived tab
         * 
         * @return object|null
         */
        getActiveTab: function(){
            return (this.layout.root.contentItems[0]) ? this.layout.root.contentItems[0].getActiveContentItem() : null;
        },
       
        /**
         * Functio to remove tab
         * 
         * @param string id
         * @return void
         */
        remove: function(id, fn){
            if(typeof this.itens[id].onclose == "function"){
                if(this.itens[id].onclose(id)){
                    if(this.has(id)){
                        this.itens[id] = null;
                                            
                        if(this.layout.root.contentItems[0])
                            if(this.layout.root.contentItems[0].getItemsById(id).length > 0)
                                this.layout.root.contentItems[0].getItemsById(id)[0].remove();
                        
                        if(typeof fn == "function")
                            fn();
                    }
                }
            }
            else{
                if(this.has(id)){
                    this.itens[id] = null;
                        
                    if(this.layout.root.contentItems[0])
                        if(this.layout.root.contentItems[0].getItemsById(id).length > 0)
                            this.layout.root.contentItems[0].getItemsById(id)[0].remove();
                    
                    if(typeof fn == "function")
                        fn();
                }
            }
        },
               
        /**
         * Function to check for tab
         * 
         * @param string id
         * @return boolean
         */
        has: function(id){
            return (typeof this.itens[id] == "object" && this.itens[id] !== null);
        },
        
        /**
         * Function to check for tab by path
         * 
         * @param string path
         * @return boolean
         */
        hasByPath: function(path){
            var id = this.createNamespace(path);
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
                if(this.layout.root.contentItems[0].getItemsById(id).length > 0)
                    this.layout.root.contentItems[0].setActiveContentItem(this.layout.root.contentItems[0].getItemsById(id)[0]);
            }
        },
        
        /**
         * Function to focus on a specific tab by path
         * 
         * @param string path
         * @return void
         */
        focusByPath: function(path){
            var id = this.createNamespace(path);
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
    });    
});