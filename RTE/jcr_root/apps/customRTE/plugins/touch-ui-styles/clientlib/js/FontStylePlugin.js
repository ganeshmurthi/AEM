/*************************************************************************
* Font Style Plugin
**************************************************************************/
ACT.rte.plugins.FontStylePlugin = new Class({
    
    toString: "FontStylePlugin",

    extend: CUI.rte.plugins.Plugin,

    /**
     * @private
     */
    cachedStyles: null,

    /**
     * @private
     */
    stylesUI: null,
    
    getFeatures: function() {
        return [ ACT.rte.FEATURE.FONT_STYLE.NAME ];
    },

    /**
     * @private
     */
    getStyleId: function(dom) {
        var tagName = dom.tagName.toLowerCase();
        var styles = this.getStyles();
        var stylesCnt = styles.length;
        for (var f = 0; f < stylesCnt; f++) {
            var styleDef = styles[f];
            //TODO: We need to handle span class, not tag
            if (styleDef.tag && (styleDef.tag == tagName)) {
                return styleDef.tag;
            }
        }
        return null;
    },

	getStyles: function() {
        var com = CUI.rte.Common;
        if (!this.cachedStyles) {
            this.cachedStyles = this.config.styles || { };
            if (this.cachedStyles) {
                // take styles from config
                com.removeJcrData(this.cachedStyles);
                this.cachedStyles = com.toArray(this.cachedStyles, "cssName", "text");
            } else {
                this.cachedStyles = [ ];
            }
        }
        return this.cachedStyles;
    },

    setStyles: function(styles) {
        this.cachedStyles = styles;
    },

    hasStylesConfigured: function() {
        return !!this.config.styles;
    },

    initializeUI: function(tbGenerator, options) {
        var plg = CUI.rte.plugins;
        if (this.isFeatureEnabled(ACT.rte.FEATURE.FONT_STYLE.NAME)) {
            this.stylesUI = new tbGenerator.createStyleSelector(ACT.rte.FEATURE.FONT_STYLE.NAME, this, null, this.getStyles());
            tbGenerator.addElement(ACT.rte.FEATURE.FONT_STYLE.NAME, plg.Plugin.SORT_STYLES, this.stylesUI, 700);
        }
    },

	notifyPluginConfig: function(pluginConfig) {
        pluginConfig = pluginConfig || { };
        CUI.rte.Utils.applyDefaults(pluginConfig, { });
        this.config = pluginConfig;
    },

	execute: function (cmdId, styleDef) {
      if (!this.stylesUI) {
        return;
      }
      var cmd = null;
      var tagName;
      var className;
      switch (cmdId.toLowerCase()) {

      case 'applystyle':
        cmd = 'style';
        tagName = 'span';
        className = ((styleDef !== null && styleDef !== undefined) ? styleDef
          : this.stylesUI.getSelectedStyle());
        break;
      }

     if (cmd && tagName && className) {

			this.editorKernel.relayCmd(cmd, {
          'tag': tagName,
          'attributes': {
            'class': className
          }
        });

      }
    },
	updateState: function(selDef) {
        if (!this.stylesUI) {
            return;
        }
        var com = CUI.rte.Common;
        var styles = selDef.startStyles;
        var actualStyles = [ ];
        var s;
        var styleableObject = selDef.selectedDom;
        if (styleableObject) {
            if (!CUI.rte.Common.isTag(selDef.selectedDom,
                    CUI.rte.plugins.StylesPlugin.STYLEABLE_OBJECTS)) {
                styleableObject = null;
            }
        }
        var stylesDef = this.getStyles();
        var styleCnt = stylesDef.length;
        if (styleableObject) {
            for (s = 0; s < styleCnt; s++) {
                var styleName = stylesDef[s].cssName;
                if (com.hasCSS(styleableObject, styleName)) {
                    actualStyles.push({
                        "className": styleName
                    });
                }
            }
        } else {
            var checkCnt = styles.length;
            for (var c = 0; c < checkCnt; c++) {
                var styleToProcess = styles[c];
                var currentStyles = styleToProcess.className.split(" ");
                for(var j=0; j<currentStyles.length; j++) {
                    for (s = 0; s < styleCnt; s++) {
						if (stylesDef[s].cssName == currentStyles[j]) {
                            actualStyles.push(currentStyles[j]);
                            break;
                        }
                    }
				}
            }
        }
        this.stylesUI.selectStyles(actualStyles, selDef);
    }
});



CUI.rte.plugins.PluginRegistry.register(ACT.rte.FEATURE.FONT_STYLE.NAME, ACT.rte.plugins.FontStylePlugin);