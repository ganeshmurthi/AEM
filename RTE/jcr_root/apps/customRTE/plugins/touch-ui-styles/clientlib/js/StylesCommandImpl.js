/*************************************************************************
* Styles Command manager for fontstyles plugin
**************************************************************************/
ACT.rte.commands.StylesCommandImpl = new Class({
    
    toString: "ACTStylesCommand",
    
    extend: CUI.rte.commands.Command,

    isCommand: function(cmdStr) {
        return (cmdStr.toLowerCase() == ACT.rte.COMMAND.STYLES);
    },

    getProcessingOptions: function() {
        var cmd = CUI.rte.commands.Command;
        return cmd.PO_SELECTION | cmd.PO_BOOKMARK | cmd.PO_NODELIST;
    },

    addStyle: function(execDef) {
        var sel = CUI.rte.Selection;
        var com = CUI.rte.Common;
        var styleName = execDef.value.attributes.class;
        var tagName = execDef.value.tag;
        var styleList = execDef.value.styles;
        var selection = execDef.selection;
        var context = execDef.editContext;
        // handle DOM elements
        var selectedDom = sel.getSelectedDom(context, selection);
        var styleableObjects = ACT.rte.STYLEABLE_OBJECTS;
        if (selectedDom && com.isTag(selectedDom, styleableObjects)) {
            com.removeAllClasses(selectedDom);
            com.addClass(selectedDom, styleName);
            return;
        }
        // handle text fragments
        var nodeList = execDef.nodeList;

        if (nodeList) {
            if(selection.startNode.parentNode.tagName == "SPAN") {
                var newStyles = [];
                var existingStyles = selection.startNode.parentNode.className.split(" ");
                for(var i=0; i<existingStyles.length;i++) {
                    var status = true;
                    for(var j=0; j<styleList.length; j++) {
                        if(existingStyles[i] == styleList[j].cssName) {
                            status = false;
                        }
                    }
                    if(status) {
                        newStyles.push(existingStyles[i]);
                    }
                }
                if("default" != styleName) {
                    newStyles.push(styleName);
                }
                if(newStyles.length == 0) {
                    $(selection.startNode).unwrap();
                } else {
                	selection.startNode.parentNode.className = newStyles.join(" ");
                }
            } else if(styleName != "default") {
                nodeList.surround(execDef.editContext, tagName, {
                    "className": styleName
                });
            }
        }
    },

    execute: function(execDef) {
        switch (execDef.command.toLowerCase()) {
            case "actstyles":
                this.addStyle(execDef);
                break;
        }
    },

    queryState: function(selectionDef, cmd) {
        var com = CUI.rte.Common;
        var tagName = this._getTagNameForCommand(cmd);
        if (!tagName) {
            return undefined;
        }
        var context = selectionDef.editContext;
        var selection = selectionDef.selection;
        return (com.getTagInPath(context, selection.startNode, tagName) != null);
    }
});

CUI.rte.commands.CommandRegistry.register(ACT.rte.COMMAND.STYLES, ACT.rte.commands.StylesCommandImpl);