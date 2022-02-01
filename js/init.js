
var default_values = {
    variety: 'gala'
};

// Init Menus
var orchardMenu = new vlMultiDropDown("orchard-dropdown");
orchardMenu.onchange = function() {
    genGrowthGraph();
}
var varietyMenu = new vlDropDown("variety-dropdown");
varietyMenu.onchange = function() {
    genGrowthGraph();
    updateCounts();
    updateOrchardDropdown();
}

$('input[name="year"]').change(function () {
    genGrowthGraph();
});
$('input[name="region"]').change(function () {
    genGrowthGraph();
});

function init() {
    
    console.log("INIT");
    // Get Unique Form Values
    var orchard_values = [];
    var variety_values = [];
    for (var item of growth_statistics) {
        if (!variety_values.includes(item.variety)) {
            variety_values.push(item.variety);
        }
        if (!orchard_values.includes(item.rpin_block) && item.variety == default_values.variety) {
            orchard_values.push(item.rpin_block);
        }
    }

    /* Orchard Menu Items */
    orchardMenu.populate(orchard_values);

    /* Variety Menu Items */
    var variety_headers = {
        'gala': 'Royal Gala',
        'p_queen': 'Pacific Queen',
        'braeburn': 'Braeburn',
        'p_lady': 'Pink Lady',
        'fuji': 'Fuji',
        'jazz': 'Jazz',
        "dazzle": 'Dazzle',
        "dazzle_promalin": 'Dazzle Promalin',
        "posy": "Posy"
    };
    for (var value of variety_values) {
        varietyMenu.push(value, variety_headers[value]);
    }


    // GEN GRAPHS
    genGrowthGraph();

    regionFormType("mono");
    yearFormType("mono");
    orchardFormType("mono");
}

function updateOrchardDropdown() {
    var orchard_values = [];
    for (var item of growth_statistics) {
        if (!orchard_values.includes(item.rpin_block) && item.variety == varietyMenu.value) {
            orchard_values.push(item.rpin_block);
        }
    }
    orchardMenu.populate(orchard_values);
}