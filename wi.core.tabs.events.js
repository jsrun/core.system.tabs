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
                this.itens[id] = {};
                var _this = this;

                var tabListItem = document.createElement("div");
                tabListItem.id = "wi-tl-" + id;
                tabListItem.className = "wi-tabs-list-item animated slideInUp";
                tabListItem.innerHTML = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><symbol id="topleft" viewBox="0 0 214 29" ><path d="M14.3 0.1L214 0.1 214 29 0 29C0 29 12.2 2.6 13.2 1.1 14.3-0.4 14.3 0.1 14.3 0.1Z"/></symbol><symbol id="topright" viewBox="0 0 214 29"><use xlink:href="#topleft"/></symbol><clipPath id="crop"><rect class="mask" width="100%" height="100%" x="0"/></clipPath></defs><svg width="50%" height="100%" transfrom="scale(-1, 1)"><use xlink:href="#topleft" width="214" height="29" class="chrome-tab-background"/><use xlink:href="#topleft" width="214" height="29" class="chrome-tab-shadow"/></svg><g transform="scale(-1, 1)"><svg width="50%" height="100%" x="-100%" y="0"><use xlink:href="#topright" width="214" height="29" class="chrome-tab-background"/><use xlink:href="#topright" width="214" height="29" class="chrome-tab-shadow"/></svg></g></svg>'+
                                        '<div class="wi-tabs-list-item-title" title="' + path + '">' + title + "</div>";
                                
                tabListItem.onclick = function () { 
                    webide.tabs.focus(id); 
                };

                document.querySelector(".wi-tabs-list-itens").appendChild(tabListItem);
                _this.tabIndex.push("#wi-tl-" + id);
                
                setTimeout(function(){
                    $("#wi-tl-" + id).removeClass("slideInUp");
                    bindDraggabilly(id);
                }, 1000);
                
                function bindDraggabilly(id){
                    $("#wi-tl-" + id).draggabilly({
                        axis: 'x',
                        containment: '.wi-tabs-list-itens'
                    });

                    $("#wi-tl-" + id).each(function(elem, index){
                        var originalTabPositionX = 0, tabEffectiveWidth = 0;

                        $(this).on('dragStart', function(){
                            var currentIndex = _this.tabIndex.indexOf("#wi-tl-" + id);
                            tabEffectiveWidth = $(this).width() + 10;
                            originalTabPositionX = currentIndex*tabEffectiveWidth;
                            $(this).removeClass("slideInUp").css("position", "absolute").css("left", originalTabPositionX + "px");
                        });

                        $(this).on('dragEnd', function(){
                            $(this).css("transform", "translate3d(0, 0, 0)").css("left", "0");
                            $(this).css("position", "");
                        })

                        $(this).on('dragMove', (event, pointer, moveVector) => {
                            var tabIndex = _this.tabIndex;
                            var currentIndex = _this.tabIndex.indexOf("#wi-tl-" + id);
                            var currentTabPositionX = originalTabPositionX + moveVector.x;
                            var destinationIndex = Math.max(0, Math.min(_this.tabIndex.length, Math.floor((currentTabPositionX + (tabEffectiveWidth / 2)) / tabEffectiveWidth)));
                            
                            if(currentIndex !== destinationIndex){
                                (destinationIndex < currentIndex) ? $(this).insertBefore(_this.tabIndex[destinationIndex]) : $(this).insertAfter(_this.tabIndex[destinationIndex]);

                                var tmp = _this.tabIndex[currentIndex];
                                _this.tabIndex[currentIndex] = _this.tabIndex[destinationIndex];
                                _this.tabIndex[destinationIndex] = tmp;                           
                            }
                        });
                    });
                }
               
                var tabListContents = document.createElement("div");
                tabListContents.id = "wi-tc-" + id;     
                tabListContents.className = "wi-tabs-contents-item wi-tabs-editor";

                switch(type){
                    case "editor":
                        tabListContents.innerHTML = "<div id='wi-ed-" + id + "' class='wi-tabs-contents-item-editor'></div>";  
                        document.querySelector(".wi-tabs-contents").appendChild(tabListContents);
                        _this.focus(id);
                        
                        var settings = webide.settings.getByPattern(/^ace\.editor\..*?$/i);
                        var theme = webide.settings.get("ace.editor.theme");                        
                        theme = (!theme) ? "ace/theme/twilight" : "ace/theme/" + theme;

                        var editor = ace.edit("wi-ed-" + id);
                        //$(".ace_scroller").mCustomScrollbar({theme:"inset"});
                        editor.setTheme(theme);
                        
                        for(var key in settings){
                            if(key !== "ace.editor.theme"){
                                if(settings[key] == "true") settings[key] = true;//Bugfix
                                if(settings[key] == "false") settings[key] = false;//Bugfix
                                
                                if(!isNaN(parseInt(settings[key])))
                                    settings[key] = parseInt(settings[key]);
                                
                                editor.setOption(key.replace(/ace\.editor\./img, ""), settings[key]);
                            }
                        }
                                                
                        this.itens[id].editor = editor;
                        editor.resize();
                        
                        if(typeof cb == "function")
                            cb(id, editor);
                    break;
                    case "url":
                        tabListContents.innerHTML = "<div id='wi-url-" + id + "'></div>";  
                        document.querySelector(".wi-tabs-contents").appendChild(tabListContents);
                        _this.focus(id);

                        webide.getContents("GET", path, null, function(data){
                            $("#wi-url-" + id).html(data);
                            //$(".wi-scrollbar").mCustomScrollbar({set_height: "100%", theme:"inset"});
                            webide.forms.bind();
                            
                            if(typeof cb == "function")
                                cb(id);
                        });
                    break;
                }
            }
            else{
                this.focus(id);
            }
        },
        
        addToolbar: function(id){   
            $("#wi-tc-" + id).append("<div class='wi-tabs-toolbar'></div>");
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