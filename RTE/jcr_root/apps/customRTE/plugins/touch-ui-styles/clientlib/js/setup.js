
var ACT = ACT || {};
ACT.rte = ACT.rte || {
    GROUP: "act",

    // Commands
    COMMAND: {
   		STYLES: "fontstyles"
	},

    DEBUG: {
        ALL: false,
        STYLESELECTOR: false,
        TOOLKITIMPL: false,
        TOOLBARBUILDER: false,
        STYLECOMMAND: false,
        FONTSTYLE: false
    },

    // Features
    FEATURE: {
        FONT_STYLE: {
            NAME: "fontstyles",
            ID: "#fontstyles",
            POPID: "fontstyles:getStyles:styles-pulldown",
            ICON: "coral-Icon coral-Icon--textStyle"
        }
    },

    STYLE_TAG: "span",

    STYLEABLE_OBJECTS: [
    	"img"
	]
};
ACT.rte.commands = {};
ACT.rte.plugins = {};
ACT.rte.ui = {};