function genBoundsForData(graph_data) {
    if (graph_data.length == 0) {
        return null;
    }
    // Calc Graph Y Domain
    var max_y = graph_data[0].y;
    var min_y = graph_data[0].y;
    var max_x = graph_data[0].x;
    var min_x = graph_data[0].x;
    graph_data.forEach(x => {
        if (x.y > max_y) {
            max_y = x.y;
        } else if (x.y < min_y) {
            min_y = x.y;
        }
        if (percentiles_shown && x.uq && x.lq) { // DISABLE WHEN NO PERCENTILES!
            if (x.uq > max_y) {
                max_y = x.uq;
            } else if (x.lq < min_y) {
                min_y = x.lq;
            }
        }
        if (x.x > max_x) {
            max_x = x.x;
        } else if (x.x < min_x) {
            min_x = x.x;
        }
    });

    // Find appropriate Rounding Value
    var y_round_amount = 1;
    var x_round_amount = 1;
    for (amount of [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000]) {
        if ((max_y - min_y) / 6 > amount) {
            y_round_amount = amount;
        }
        if ((max_x - min_x) / 6 > amount) {
            x_round_amount = amount;
        }
    }

    // Rounding
    max_y = (Math.ceil(max_y / y_round_amount) + 1) * y_round_amount;
    min_y = (Math.floor(min_y / y_round_amount) - 1) * y_round_amount;
    max_x = (Math.ceil(max_x / x_round_amount) + 1) * x_round_amount;
    min_x = (Math.floor(min_x / x_round_amount) - 1) * x_round_amount;

    var out = {max_y: max_y, min_y: min_y, max_x: max_x, min_x: min_x};
    return out;
}

function make_x_gridlines(x, num=6) {		
    return d3.axisBottom(x)
        .ticks(num);
}

// gridlines in y axis function
function make_y_gridlines(y, num=6) {		
    return d3.axisLeft(y)
        .ticks(num);
}







// GRAPH UPDATERS
var growth_graph_compare = null;
var growth_graph_data = null;
var growth_graph_layout = null;
function genGrowthGraph() {

    
    // Filter growth statistics
    var years = [];
    $('input[name="year"]:checked').each(function() {
        years.push(+this.value);
     });
    var regions = [];
    $('input[name="region"]:checked').each(function() {
        regions.push(this.value);
     });
    var orchards = (orchardMenu instanceof vlMultiDropDown ? orchardMenu.values : [orchardMenu.value]);

    var filtered_growth_statistics = growth_statistics.filter(d => orchards.includes(d.rpin) && 
                                                                    d.variety == varietyMenu.value && 
                                                                    years.includes(d.year) && 
                                                                    regions.includes(d.region));

                          
    // Build Graph Data
    var graph_data = [];

    filtered_growth_statistics.forEach(d => {
        graph_data.push({x: d.week, y: d.mean, lq: d.lq, uq: d.uq, year: d.year, orchard: d.rpin, region: d.region});
    });

    // separate datasets
    var datasets = [];
    var compared_tags = [];
    if (years.length > 1) {
        growth_graph_compare = "year";
        for (var year of years) {
            datasets.push(graph_data.filter(d => d.year == year));
        }
        compared_tags = years;
    } else if (orchards.length > 1) {
        growth_graph_compare = "orchard";
        for (var orchard of orchards) {
            datasets.push(graph_data.filter(d => d.orchard == orchard));
        }
        compared_tags = orchards;
    } else if (regions.length > 1) {
        growth_graph_compare = "region";
        for (var region of regions) {
            datasets.push(graph_data.filter(d => d.region == region));
        }
        compared_tags = regions;
    } else {
        growth_graph_compare = null;
        datasets.push(graph_data);
    }

    
    // Init

    var growth_graph = document.getElementById("growth-graph");
    var padding = 6;
    var legend_width = (growth_graph_compare ? 100 : 0);
    var legend_spacing = 30;
    var margin = {top: 60, right: 80, bottom: 70, left: 80},
        width = growth_graph.clientWidth - margin.left - margin.right - 5,
        height = growth_graph.clientHeight - margin.top - margin.bottom - 5;

    growth_graph.innerHTML = "";
    
    
    var svg = d3.select("#growth-graph")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + (margin.left + padding) + "," + margin.top + ")");

    width -= legend_width;
    
    
    // Title
    var title = `${varietyMenu.label} Growth` + (growth_graph_compare ? ` By ${growth_graph_compare[0].toUpperCase() + growth_graph_compare.slice(1)}`: '');
    title += ' (';
    if (growth_graph_compare != 'region') {
        title += regions[0] + (regions[0] == 'All' ? ' Regions' : '') + ', ';
    }
    if (growth_graph_compare != 'orchard') {
        title += orchards[0] + (orchards[0] == 'All' ? ' Orchards' : '');
        if (growth_graph_compare != 'year') title += ', ';
    }
    if (growth_graph_compare != 'year') {
        title += '20' + years[0];
    }
    title += ')';


    svg.append("text")
    .attr("transform",
        "translate(" + (width/2 + padding) + " ,-20)")
    .style("font", "18px arial")
    .style("text-anchor", "middle")
    .text(title)
    .attr('class','graph-title');
    
    



    if (filtered_growth_statistics.length == 0) {
        // No data matches - quit here
        growth_graph_layout = null;
        growth_graph_data = null;

        $("#growth-graph-backdrop").css("display", "block");
        return null;
    } else {
        $("#growth-graph-backdrop").css("display", "none");
    }



                



    var bounds = genBoundsForData(graph_data);

    growth_graph_layout = {
        'width': width,
        'bounds': bounds,
        'legend_width': legend_width,
        'height': height,
        'x': margin.left + padding * 2,
        'y': margin.top,
        'margin': margin
    };
    console.log(">> GenGrowthGraph", growth_graph_layout, graph_data);



    var tick_number = Math.round((bounds.max_x - bounds.min_x) * 0.5);
    // X axis
    var x = d3.scaleLinear()
    .domain([bounds.min_x, bounds.max_x])
    .range([ 0, width ])
    svg.append("g")
    .style("font", "15px arial")
    .attr("transform", "translate(" + padding + "," + (height + padding) + ")")
    .call(d3.axisBottom(x).ticks(tick_number).tickSize(0))
    .select(".domain").remove();
    
    // X axis label

    svg.append("text")
    .attr("transform",
        "translate(" + (width/2 + padding) + " ," +
                        (height + margin.bottom/2 + 10 + padding) + ")")
    .style("text-anchor", "middle")
    .text("ISO Week")
    .attr('class','graph-axis-label');




    
    // Add Y axis
    var y = d3.scaleLinear()
    .domain([bounds.min_y, bounds.max_y])
    .range([ height, 0]);
    svg.append("g")
    .style("font", "15px arial")
    .call(d3.axisLeft(y).ticks(6).tickSize(0))
    .select(".domain").remove();

    // Add Y axis label

    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left/2 - 20)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Diameter (mm)")
    .attr('class','graph-axis-label');   




    // GRIDLINES


    
    // add the X gridlines 
    svg.append("g")			
    .attr("class", "grid x-grid")
    .attr("transform", "translate(" + padding + "," + height + ")")
    .call(make_x_gridlines(x, 12)
        .tickSize(-height)
        .tickFormat("")
    )
    .select(".domain").remove();


    // add the Y gridlines
    svg.append("g")			
    .attr("class", "grid y-grid")
    .attr("transform", "translate(" + padding + ", 0 )")
    .call(make_y_gridlines(y, 12)
        .tickSize(-width)
        .tickFormat("")
    )
    .select(".domain").remove();


    // add highlihgt line
    svg.append('line')
    .attr("id", "graph-highlight")
    .style("stroke", "#c4deeb")
    .style("stroke-width", 3)
    .attr("x1", padding)
    .attr("y1", 0)
    .attr("x2", padding)
    .attr("y2", height); 

    




    // CREATE DATASETS & LEGENDS
    var colors = ["#50add4", "#db324d", "#41bf0b", "#a919bc", "#FF9B54", "#0C7C59", "#004E98", "#031926", "#4C5357"];
    var dataset_index = 0;
    for (var dataset of datasets) {
        if (dataset.length > 0) {
            // Create the Line
            svg.append("path")
            .datum(dataset)
            .attr("transform", "translate(" + padding + ", 0 )")
            .attr("fill", "none")
            .attr("stroke", colors[0])
            .attr("stroke-width", 2)
            .attr("d", d3.line()
              .x(function(d) { return x(d.x) })
              .y(function(d) { return y(d.y) })
              );
            
            // Add the Circles
            svg.selectAll("myCircles")
            .data(dataset)
            .enter()
            .append("circle")
                .attr("class", function(d) { return "circle-" + d.x })
                .attr("transform", "translate(" + padding + ", 0 )")
                .attr("fill", colors[0])
                .attr("stroke", "none")
                .attr("cx", function(d) { return x(d.x) })
                .attr("cy", function(d) { return y(d.y) })
                .attr("r", 3);
            
            
            if (percentiles_shown) {
    
                var percentiles_line = [];
                for (var d of dataset) {
                    percentiles_line.push({x: d.x, y: d.uq});
                }
                for (var i = dataset.length - 1; i >= 0; i--) {
                    var d = dataset[i];
                    percentiles_line.push({x: d.x, y: d.lq});
                }
                percentiles_line.push({x: dataset[0].x, y: dataset[0].uq});

                
                // Percentiles - Toggle this
                svg.append("path")
                .datum(percentiles_line)
                .attr("transform", "translate(" + padding + ", 0 )")
                .attr("fill", colors[0]+"20")
                .attr("stroke", "none")
                .attr("stroke-width", 2)
                .attr("d", d3.line()
                .x(function(d) { return x(d.x) })
                .y(function(d) { return y(d.y) })
                );
            }
        }




        if (growth_graph_compare) {
            // Create the legend if there's a comparison
            svg.append('line')
                .style("stroke", (dataset.length > 0 ? colors[0] : '#DDD'))
                .style("stroke-width", 2)
                .attr("x1", padding * 2 + width + 30)
                .attr("y1", dataset_index * legend_spacing + legend_spacing)
                .attr("x2", padding * 2 + width + 60)
                .attr("y2", dataset_index * legend_spacing + legend_spacing); 
    
            // X axis label
            svg.append("text")
                .attr("transform",
                    "translate(" + (padding * 2 + width + 70) + " ," +
                                    (dataset_index * legend_spacing + legend_spacing + 5) + ")")
                .style("text-anchor", "start")
                .style("fill", (dataset.length > 0 ? colors[0] : '#DDD'))
                .style("font-weight", "bold")
                .text((growth_graph_compare == "year" ? "20" : "") + compared_tags[dataset_index]);
            
            svg.append("circle")
                .attr("transform", "translate(" + (padding * 2 + width + 45) + ", " + (dataset_index * legend_spacing + legend_spacing)  + " )")
                .attr("fill", (dataset.length > 0 ? colors[0] : '#DDD'))
                .attr("stroke", "none")
                .attr("r", 3);
        }
        
        for (var data_index in dataset) {
            dataset[data_index].color = colors[0];
        }

        colors.shift();
        dataset_index += 1;
    }

    
    

    // Make Graph data available globally
    growth_graph_data = datasets;

}






// PREDICTION GRAPH UPDATERS
var prediction_graph_compare = null;
var prediction_graph_data = null;
var prediction_graph_layout = null;
function genPredictionGraph() {
    // Filter prediction statistics
    var years = [];
    $('input[name="year"]:checked').each(function() {
        years.push(+this.value);
     });
    var regions = [];
    $('input[name="region"]:checked').each(function() {
        regions.push(this.value);
     });
    var orchards = (orchardMenu instanceof vlMultiDropDown ? orchardMenu.values : [orchardMenu.value]);

    var filtered_growth_statistics = growth_statistics.filter(d => orchards.includes(d.rpin) && 
                                                                    d.variety == varietyMenu.value && 
                                                                    years.includes(d.year) && 
                                                                    regions.includes(d.region));

                          
    // Build Graph Data
    var graph_data = [];

    filtered_growth_statistics.forEach(d => {
        graph_data.push({x: d.week, y: d.mean, lq: d.lq, uq: d.uq, year: d.year, orchard: d.rpin, region: d.region});
    });

    
    // Init

    var growth_graph = document.getElementById("prediction-graph");
    var padding = 6;
    var legend_width = (growth_graph_compare ? 100 : 0);
    var legend_spacing = 30;
    var margin = {top: 60, right: 80, bottom: 70, left: 80},
        width = growth_graph.clientWidth - margin.left - margin.right - 5,
        height = growth_graph.clientHeight - margin.top - margin.bottom - 5;

    growth_graph.innerHTML = "";
    
    
    var svg = d3.select("#prediction-graph")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + (margin.left + padding) + "," + margin.top + ")");

    width -= legend_width;
    
    
    // Title
    var title = `${varietyMenu.label} Prediction`;


    svg.append("text")
    .attr("transform",
        "translate(" + (width/2 + padding) + " ,-20)")
    .style("font", "18px arial")
    .style("text-anchor", "middle")
    .text(title)
    .attr('class','graph-title');




    var bounds = genBoundsForData(graph_data);

    prediction_graph_layout = {
        'width': width,
        'bounds': bounds,
        'legend_width': legend_width,
        'height': height,
        'x': margin.left + padding * 2,
        'y': margin.top,
        'margin': margin
    };
    console.log(">> GenPredictionGraph", prediction_graph_layout, graph_data);



    var tick_number = Math.round((bounds.max_x - bounds.min_x) * 0.5);
    // X axis
    var x = d3.scaleLinear()
    .domain([bounds.min_x, bounds.max_x])
    .range([ 0, width ])
    svg.append("g")
    .style("font", "15px arial")
    .attr("transform", "translate(" + padding + "," + (height + padding) + ")")
    .call(d3.axisBottom(x).ticks(tick_number).tickSize(0))
    .select(".domain").remove();
    
    // X axis label

    svg.append("text")
    .attr("transform",
        "translate(" + (width/2 + padding) + " ," +
                        (height + margin.bottom/2 + 10 + padding) + ")")
    .style("text-anchor", "middle")
    .text("ISO Week")
    .attr('class','graph-axis-label');




    
    // Add Y axis
    var y = d3.scaleLinear()
    .domain([bounds.min_y, bounds.max_y])
    .range([ height, 0]);
    svg.append("g")
    .style("font", "15px arial")
    .call(d3.axisLeft(y).ticks(6).tickSize(0))
    .select(".domain").remove();

    // Add Y axis label

    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left/2 - 20)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Diameter (mm)")
    .attr('class','graph-axis-label');   




    // GRIDLINES


    
    // add the X gridlines 
    svg.append("g")			
    .attr("class", "grid x-grid")
    .attr("transform", "translate(" + padding + "," + height + ")")
    .call(make_x_gridlines(x, 12)
        .tickSize(-height)
        .tickFormat("")
    )
    .select(".domain").remove();


    // add the Y gridlines
    svg.append("g")			
    .attr("class", "grid y-grid")
    .attr("transform", "translate(" + padding + ", 0 )")
    .call(make_y_gridlines(y, 12)
        .tickSize(-width)
        .tickFormat("")
    )
    .select(".domain").remove();


    // add highlihgt line
    svg.append('line')
    .attr("id", "prediction-graph-highlight")
    .style("stroke", "#c4deeb")
    .style("stroke-width", 3)
    .attr("x1", padding)
    .attr("y1", 0)
    .attr("x2", padding)
    .attr("y2", height); 

    




        // Create the Line
    svg.append("path")
    .datum(graph_data)
    .attr("transform", "translate(" + padding + ", 0 )")
    .attr("fill", "none")
    .attr("stroke", "#50add4")
    .attr("stroke-width", 2)
    .attr("d", d3.line()
        .x(function(d) { return x(d.x) })
        .y(function(d) { return y(d.y) })
        );
    
    // Add the Circles
    svg.selectAll("myCircles")
    .data(graph_data)
    .enter()
    .append("circle")
        .attr("class", function(d) { return "circle-" + d.x })
        .attr("transform", "translate(" + padding + ", 0 )")
        .attr("fill", "#50add4")
        .attr("stroke", "none")
        .attr("cx", function(d) { return x(d.x) })
        .attr("cy", function(d) { return y(d.y) })
        .attr("r", 3);

        
    for (var data_index in graph_data) {
        graph_data[data_index].color = "#50add4";
    }
    

    // Make Graph data available globally
    prediction_graph_data = graph_data;

}





















// PAST COUNTS ETC
var all_counts = {
    "gala": [[2015, 121],
            [2016, 123],
            [2017, 123],
            [2018, 120],
            [2019, 131],
            [2020, 131],
            ],
    "p_queen": [[2015, 98.7],
            [2016, 102],
            [2017, 99.6],
            [2018, 97.8],
            [2019, 109],
            [2020, 101],
            ],
    "braeburn": [[2016, 111],
            [2017, 111],
            [2018, 106],
            [2019, 115],
            [2020, 111],
            ],
    "p_lady": [[2020, 113],
            ],
    "fuji": [[2016, 98],
            [2017, 99],
            [2018, 92],
            [2019, 106],
            [2020, 99],
            ],
    "jazz": [[2016, 117],
            [2017, 118],
            [2018, 112],
            [2019, 125],
            [2020, 118],
            ]
};
var target_counts = {
    "gala": [2021, 121],
    "p_queen": [2021, 98],
    "braeburn": [2021, 112],
    "p_lady": [2021, 108],
    "fuji": [2021, 93],
    "jazz": [2021, 110],
}
function updateCounts() {
    var contents = "";

    for (var count of all_counts[varietyMenu.value]) {
        contents += `
        <td>
            <table style="width: 100%;">
                <tr>
                    <td>
                        <h1>${count[1]}</h1>
                    </td>
                </tr>
                <tr>
                    <td>
                        <h2>${count[0]}</h2>
                    </td>
                </tr>
            </table>
        </td>`;
    }

    $("#horizontal-counts-table .counts-tr").html(contents);
}