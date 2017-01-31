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

let SystemException = require("../wi.core.exception.js"),
    TemplateEngine = require("../wi.core.template.js");

module.exports = {
    /**
     * List of navbar itens
     * @type object
     */
    itens: {},
    
    /**
     * List module assets
     * @type object
     */
    assets: {
        css: [__dirname + "/node_modules/golden-layout/src/css/goldenlayout-base.css", __dirname + "/node_modules/golden-layout/src/css/goldenlayout-dark-theme.css"],
        js: [__dirname + "/node_modules/golden-layout/dist/goldenlayout.min.js"]
    },
    
    /**
     * Function to generate template
     * 
     * @param object webide
     * @return string
     */
    getTemplate: function(i18n){
        return TemplateEngine(__dirname + "/template.ejs").seti18n(i18n).render();
    }
};