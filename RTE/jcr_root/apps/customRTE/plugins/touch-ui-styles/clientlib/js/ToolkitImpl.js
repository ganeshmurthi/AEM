/*************************************************************************
* Extend the toolkit implementation for custom toolbar builder and dialog manager
**************************************************************************/
ACT.rte.ui.ToolkitImpl = new Class({

    toString: "ACTToolkitImpl",
    
    extend: CUI.rte.ui.cui.ToolkitImpl,

    createToolbarBuilder: function() {
        return new ACT.rte.ui.CuiToolbarBuilder();
    }
});

CUI.rte.ui.ToolkitRegistry.register("cui", ACT.rte.ui.ToolkitImpl);