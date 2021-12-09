
var import_manager = new ImportManager();


import_manager.addImport('growth_statistics', 'Growth Statistics', 'csv', 
    'https://test.urbanintelligence.co.nz/mrapple/data/growth_statistics.csv',
    d3.autoType);

    

import_manager.onComplete(importsComplete);
import_manager.runImports();


var growth_statistics = [];

function importsComplete(imports) {
    growth_statistics = imports['growth_statistics'].filter(d => d.year != "2015" && !d.rpin.startsWith("OLD BLOCK"));
    init();
}
