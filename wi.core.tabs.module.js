/**
 * Core tabs module
 * 
 * @author André Ferreira <andrehrf@gmail.com>
 * @license MIT
 */

let SystemException = require("../core.plugins.exception.js"),
    TemplateEngine = require("../core.plugins.template.js");

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
        css: [__dirname + "/wi.core.tabs.style.css"],
        js: [__dirname + "/draggabilly.pkgd.min.js", __dirname + "/wi.core.tabs.events.js"]
    },
    
    /**
     * Function to generate template
     * 
     * @param object webide
     * @return string
     */
    getTemplate: function(settings, dirname, argv, app, i18n, passport, mongodb, webide){
        return TemplateEngine(__dirname + "/wi.core.tabs.tpl.ejs").seti18n(i18n).render();
    }
}