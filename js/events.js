

// BUTTON (TOP LEFT) CLICK EVENT

var current_page = "growth";

var growth_button = document.getElementById("switch-growth-div");
var prediction_button = document.getElementById("switch-prediction-div");

var growth_graph_tr = document.getElementById("growth-graph-tr");
var growth_info_tr = document.getElementById("growth-info-tr");

var prediction_graph_tr = document.getElementById("prediction-graph-tr");
var prediction_info_tr = document.getElementById("prediction-info-tr");

var region_tr = document.getElementById("region-tr");
var orchard_tr = document.getElementById("orchard-tr");
var year_tr = document.getElementById("year-tr");

var menu_header = document.getElementById("menu-header");
var menu_description = document.getElementById("menu-description");

function setPage(page) {
    if (page != current_page) {
        switch (page) {
            case "growth": {
                growth_button.classList.add("active");
                prediction_button.classList.remove("active");
                
                growth_graph_tr.classList.remove("display-none");
                growth_info_tr.classList.remove("display-none");
                
                prediction_graph_tr.classList.add("display-none");
                prediction_info_tr.classList.add("display-none");
                
                region_tr.classList.remove("display-none");
                orchard_tr.classList.remove("display-none");
                year_tr.classList.remove("display-none");

                menu_header.innerText = "Apple Growth";
                menu_description.innerText = `The following data shows the average and percentile for the growth of apples in the regions, compared to previous years.`;
                
                genGrowthGraph();
            }; break;
            case "prediction": {
                growth_button.classList.remove("active");
                prediction_button.classList.add("active");
                
                growth_graph_tr.classList.add("display-none");
                growth_info_tr.classList.add("display-none");
                
                prediction_graph_tr.classList.remove("display-none");
                prediction_info_tr.classList.remove("display-none");
                
                region_tr.classList.add("display-none");
                orchard_tr.classList.add("display-none");
                year_tr.classList.add("display-none");

                menu_header.innerText = "Apple Predictions";
                menu_description.innerText = `The following data shows the predicted average and percentile for the growth of apples in the regions, compared to previous years.`;
            
                genPredictionGraph();
            }; break;
        }
        current_page = page;
    }
}



// RESIZE EVENT

window.onresize = function () {
    if (current_page == "growth") {
        genGrowthGraph();
    }
};




// GROWTH GRAPH ONHOVER INFO
var growth_graph = document.getElementById("growth-graph");
var growth_graph_hover = document.getElementById('growth-hover');
var growth_graph_hover_direction = 'left';
var graph_highlight;
growth_graph.onmouseover = function () {
    graph_highlight = document.getElementById("graph-highlight");
    if (graph_highlight) {
        graph_highlight.style.display = "block";
    }
}

growth_graph.onmouseout = function (e) {
    if (graph_highlight) {
        growth_graph_hover.style.display = "none";
        graph_highlight.style.display = "none";
        $("circle").css("r", "3px");
    }
}



growth_graph.onmousemove = function (e) {
    var ggl = growth_graph_layout;
    if (!ggl) {
        // If ggl is null, there's no graph
        return null;
    }
    

    //console.log(ggl);
    //console.log(e.offsetX, e.offsetY, growth_graph.clientWidth, growth_graph.clientHeight);
    var mX = (e.offsetX - ggl.x) / ggl.width * (ggl.bounds.max_x - ggl.bounds.min_x) + ggl.bounds.min_x;
    //console.log(mX, mY);

    if (mX < ggl.bounds.max_x && mX > ggl.bounds.min_x) {

        var week = null;
        for (var dataset of growth_graph_data) {
            for (var item of dataset) {
                if (week == null) week = item.x;
                if ((mX - item.x) ** 2 < (mX - week) ** 2) {
                    week = item.x;
                }
            }
        }

        var weekX = (week - ggl.bounds.min_x)  * ggl.width / (ggl.bounds.max_x - ggl.bounds.min_x);
        
        graph_highlight.style.transform = `translate(${weekX}px, 0px)`;

        // Get matching data points for week
        var points = [];
        var weekY = 0;
        for (var dataset of growth_graph_data) {
            for (var item of dataset) {
                if (item.x == week) {
                    points.push(item);
                    weekY += item.y;
                }
            }
        }
        weekY /= points.length;
        weekY = ggl.height - (weekY - ggl.bounds.min_y) * ggl.height / (ggl.bounds.max_y - ggl.bounds.min_y);

        if (points.length > 0) {
            growth_graph_hover.style.display = "block";
            if (weekX < ggl.width/2) {
                growth_graph_hover.style.left = (ggl.x + weekX + 10) + "px";

                if (growth_graph_hover_direction != 'left') {
                    growth_graph_hover_direction = 'left';
                    growth_graph_hover.style.right = "";
                }
            } else {
                growth_graph_hover.style.right = (ggl.margin.right + ggl.width + ggl.legend_width - weekX + 10) + "px";

                if (growth_graph_hover_direction != 'right') {
                    growth_graph_hover_direction = 'right';
                    growth_graph_hover.style.left = "";
                }
            }
            growth_graph_hover.style.top = (ggl.y + weekY) + "px";

            // Increase size of relevant circles
            $("circle").css("r", "3px");
            $(".circle-" + week).css("r", "6px");

            // Sort points by y value
            points.sort(function(x, y) {
                if (x.y > y.y) {
                  return -1;
                }
                if (x.y < y.y) {
                  return 1;
                }
                return 0;
              });

            // Plug numbers & colors in hover box (in order of height)
            var contents = "";
            for (var point of points) {
                var details = '';
                if (growth_graph_compare) {
                    switch(growth_graph_compare) {
                        case "year": details = "20" + point.year; break;
                        case "orchard": details = point.orchard; break;
                        case "region": details = point.region; break;
                    }
                    details = `<b>${details}:</b>`;
                }

                contents += `<tr>
                                <td>
                                    <div class="graph-hover-dot" style="background-color:${point.color}"></div>
                                </td>
                                <td style="color:${darkenColor(point.color)}CC">
                                    ${details} ${Math.round(point.y)}mm in day ${point.x}
                                </td>
                            </tr>`; // week
            }
            document.getElementById("growth-hover-table").innerHTML = contents;


        } else {
            growth_graph_hover.style.display = "none";
        }

    } else {
        graph_highlight.style.display = "none";
    }
    
}
function darkenColor(color) {
    // Assume # - remove it
    var color = color.slice(1);
    var split = color.split(/(.{2})(.{2})(.{2})/).slice(1,4);
    for (var i in split) {
        split[i] = (Math.round(parseInt(split[i], 16) / 2)).toString(16);
        if (split[i].length == 1) {
            split[i] = '0' + split[i];
        }
    }
    return '#' + split[0] + split[1] + split[2];
}













var prediction_graph = document.getElementById("prediction-graph");
var prediction_graph_hover = document.getElementById('prediction-hover');
var prediction_graph_hover_direction = 'left';
prediction_graph.onmouseover = function () {
    graph_highlight = document.getElementById("prediction-graph-highlight");
    if (graph_highlight) {
        graph_highlight.style.display = "block";
    }
}

prediction_graph.onmouseout = function (e) {
    if (graph_highlight) {
        prediction_graph_hover.style.display = "none";
        graph_highlight.style.display = "none";
        $("circle").css("r", "3px");
    }
}



prediction_graph.onmousemove = function (e) {
    var ggl = prediction_graph_layout;
    if (!ggl) {
        // If ggl is null, there's no graph
        return null;
    }
    

    //console.log(ggl);
    //console.log(e.offsetX, e.offsetY, growth_graph.clientWidth, growth_graph.clientHeight);
    var mX = (e.offsetX - ggl.x) / ggl.width * (ggl.bounds.max_x - ggl.bounds.min_x) + ggl.bounds.min_x;
    //console.log(mX, mY);

    if (mX < ggl.bounds.max_x && mX > ggl.bounds.min_x) {

        var week = null;
        for (var dataset of growth_graph_data) {
            for (var item of dataset) {
                if (week == null) week = item.x;
                if ((mX - item.x) ** 2 < (mX - week) ** 2) {
                    week = item.x;
                }
            }
        }

        var weekX = (week - ggl.bounds.min_x)  * ggl.width / (ggl.bounds.max_x - ggl.bounds.min_x);
        
        graph_highlight.style.transform = `translate(${weekX}px, 0px)`;

        // Get matching data points for week
        var points = [];
        var weekY = 0;
        for (var dataset of growth_graph_data) {
            for (var item of dataset) {
                if (item.x == week) {
                    points.push(item);
                    weekY += item.y;
                }
            }
        }
        weekY /= points.length;
        weekY = ggl.height - (weekY - ggl.bounds.min_y) * ggl.height / (ggl.bounds.max_y - ggl.bounds.min_y);

        if (points.length > 0) {
            prediction_graph_hover.style.display = "block";
            if (weekX < ggl.width/2) {
                prediction_graph_hover.style.left = (ggl.x + weekX + 10) + "px";

                if (prediction_graph_hover_direction != 'left') {
                    prediction_graph_hover_direction = 'left';
                    prediction_graph_hover.style.right = "";
                }
            } else {
                prediction_graph_hover.style.right = (ggl.margin.right + ggl.width + ggl.legend_width - weekX + 10) + "px";

                if (prediction_graph_hover_direction != 'right') {
                    prediction_graph_hover_direction = 'right';
                    prediction_graph_hover.style.left = "";
                }
            }
            prediction_graph_hover.style.top = (ggl.y + weekY) + "px";

            // Increase size of relevant circles
            $("circle").css("r", "3px");
            $(".circle-" + week).css("r", "6px");

            // Sort points by y value
            points.sort(function(x, y) {
                if (x.y > y.y) {
                  return -1;
                }
                if (x.y < y.y) {
                  return 1;
                }
                return 0;
              });

            // Plug numbers & colors in hover box (in order of height)
            var contents = "";
            for (var point of points) {
                contents += `<tr>
                                <td>
                                    <div class="graph-hover-dot" style="background-color:${point.color}"></div>
                                </td>
                                <td style="color:${darkenColor(point.color)}CC">
                                    ${Math.round(point.y)}mm in day ${point.x}
                                </td>
                            </tr>`;
            }
            document.getElementById("prediction-hover-table").innerHTML = contents;


        } else {
            prediction_graph_hover.style.display = "none";
        }

    } else {
        graph_highlight.style.display = "none";
    }
    
}









// Form Changers
var currently_comparing = "none";

function regionFormType(type) {
    genGrowthGraph();
    if (type == "mono") {
        for (var elem of $("#region-tr input").get()) {
            elem.type = "radio"
        }
        $("#region-tr .description").text("");
        $("#region-tr .compare-button").removeClass("active");

        currently_comparing = "none";

    } else if (type == "multi") {

        if ( currently_comparing != "region") {
            orchardFormType("mono");
            yearFormType("mono");
            for (var elem of $("#region-tr input").get()) {
                elem.type = "checkbox"
            }
            $("#region-tr .description").text("Currently Comparing - Select Multiple!");
            $("#region-tr .compare-button").addClass("active");

            currently_comparing = "region";

        } else {
            regionFormType("mono");
        }
    }
}
function yearFormType(type) {
    genGrowthGraph();
    if (type == "mono") {
        for (var elem of $("#year-tr input").get()) {
            elem.type = "radio"
        }
        $("#year-tr .description").text("");
        $("#year-tr .compare-button").removeClass("active");

        currently_comparing = "none";

    } else if (type == "multi") {

        if ( currently_comparing != "year") {
            orchardFormType("mono");
            regionFormType("mono");
            for (var elem of $("#year-tr input").get()) {
                elem.type = "checkbox"
            }
            $("#year-tr .description").text("Currently Comparing - Select Multiple!");
            $("#year-tr .compare-button").addClass("active");

            currently_comparing = "year";

        } else {
            yearFormType("mono");
        }

    }
}
function orchardFormType(type) {
    genGrowthGraph();
    if (type == "mono" && orchardMenu instanceof vlMultiDropDown) {
        orchardMenu = orchardMenu.convertToDropDown();
        $("#orchard-tr .description").text("");
        $("#orchard-tr .compare-button").removeClass("active");

        currently_comparing = "none";

    } else if (type == "multi" && orchardMenu instanceof vlDropDown) {

        if ( currently_comparing != "orchard") {
            yearFormType("mono");
            regionFormType("mono");
            orchardMenu = orchardMenu.convertToMultiDropDown();
            $("#orchard-tr .description").text("Currently Comparing - Select Multiple!");
            $("#orchard-tr .compare-button").addClass("active");

            currently_comparing = "orchard";

        } else {
            orchardFormType("mono");
        }
    }
}





// Percentiles
var percentiles_shown = false;
function togglePercentiles() {
    percentiles_shown = !percentiles_shown;
    if (percentiles_shown) {
        $("#percentile-switch").addClass("active");
    } else {
        $("#percentile-switch").removeClass("active");
    }
    genGrowthGraph();
}




// While Predictions aren't available
function showPredictionWarning() {
    $("#prediction-warning").css("pointer-events", "initial");
    $("#prediction-warning").css("opacity", "1");
}
// While Predictions aren't available
function hidePredictionWarning() {
    $("#prediction-warning").css("pointer-events", "none");
    $("#prediction-warning").css("opacity", "0");
}