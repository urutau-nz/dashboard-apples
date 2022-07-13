
var import_manager = new ImportManager();
var vl_domain = window.location.hostname;

import_manager.addImport('growth_statistics', 'Growth Statistics', 'csv', 
    `https://${vl_domain}/mrapple/data/growth_statistics.csv`,
    d3.autoType);

    

import_manager.onComplete(importsComplete);
import_manager.runImports();

var growth_statistics = [];

function importsComplete(imports) {
    growth_statistics = imports['growth_statistics'].filter(d => d.year != "2015" && !d.rpin_block.startsWith("OLD BLOCK") && d.variety != 'braeburn');
    
    init();
}
