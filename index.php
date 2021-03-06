<?php 
    switch (dirname(__FILE__, 2)) {
        case "/home/web-dev": {
            $GLOBALS["domain"] = "test";
        }; break;
        case "/home/website": {
            $GLOBALS["domain"] = "projects";
        }; break;
    }
?>

<!DOCTYPE html>
<head>
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-147044719-1"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'UA-147044719-1');
    </script>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <link rel="icon" href="https://projects.urbanintelligence.co.nz/uivl/lib/Urban-Intelligence-Solo-Mark-Light-Blue-Circle-32px.png" sizes="32x32">
    <link rel="icon" href="https://projects.urbanintelligence.co.nz/uivl/lib/Urban-Intelligence-Solo-Mark-Light-Blue-Circle-192px.png" sizes="192x192">

    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.0.1/d3.min.js" integrity="sha512-1e0JvdNhUkvFbAURPPlFKcX0mWu/b6GT9e0uve7BW4MFxJ15q4ZCd/Llz+B7/oh+qhw7/l6Q1ObPt6aAuR01+Q==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.2.0/dist/leaflet.css" />


    <title>Apple Growth - Urban Intelligence</title> 

    <link rel="stylesheet" href="styles.css"/>
    <?php
        require_once("../ui-visual-library/css-links.php");
    ?>

</head>
<body>

    <table style="height:100%;width:100%;border-spacing: 0px;max-height:100%;">
        <tr>
            <td id="menu-td"> <!-- Menu -->
                <div style="width:25rem;height:100%;">
                    <table id="menu-table">
                        <tr>
                            <td id="switch-td"> <!-- Switch -->
                            </td>
                        </tr>
                        <tr>
                            <td id="options-td"> <!-- Option Menu-->
                                <table id="options-table">
                                    <tr>
                                        <td style="text-align: center;">
                                            <h1 id="menu-header">Apple Growth</h1>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p id="menu-description">
                                                The following data shows the average and percentile for the growth of apples in the regions, compared to previous years.
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="form-td">
                                            <table class="form-table">
                                                <tr>
                                                    <td>
                                                        <div class="form-header">Select the variety:</div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div id="variety-dropdown">
                                                        
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr id="region-tr">
                                        <td class="form-td">
                                            <table class="form-table">
                                                <tr>
                                                    <td style="padding-bottom: 0.2rem;">
                                                        <div class="form-header">Select a region:</div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <input type="checkbox" value="All" id="region-all" name="region" checked>
                                                        <label for="region-all">All</label>
                                                        <input type="checkbox" value="Hastings" id="region-hastings" name="region">
                                                        <label for="region-hastings">Hastings</label>
                                                        <input type="checkbox" value="CHB" id="region-chb" name="region">
                                                        <label for="region-chb">Central Hawkes Bay</label>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="description" style="font-weight: lighter;font-size: 14px;font-style:italic;">
                                                        
                                                    </td>
                                                </tr>
                                            </table>
                                            <div class="compare-button" onclick="regionFormType('multi')">
                                                Compare
                                            </div>
                                        </td>
                                    </tr>
                                    <tr id="orchard-tr">
                                        <td class="form-td">
                                            <table class="form-table">
                                                <tr>
                                                    <td>
                                                        <div class="form-header">Select an orchard:</div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <!--
                                                        <div style="width: 100%;box-sizing:border-box;padding: 0.5rem;border: 1px solid #50add4; border-radius: 0.2rem;">
                                                            <b>Royal Gala</b>
                                                        </div>-->

                                                        <div id="orchard-dropdown">
                                                        
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="description" style="font-weight: lighter;font-size: 14px;font-style:italic;">
                                                        
                                                    </td>
                                                </tr>
                                            </table>
                                            <div class="compare-button" onclick="orchardFormType('multi')">
                                                Compare
                                            </div>
                                        </td>
                                    </tr>
                                    <tr id="year-tr">
                                        <td class="form-td">
                                            <table class="form-table">
                                                <tr>
                                                    <td style="padding-bottom: 0.1rem;">
                                                        <div class="form-header">Select a year:</div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="year">
                                                        <input type="checkbox" id="year-2016" value="16" name="year">
                                                        <label for="year-2016">2016</label>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="year">
                                                        <input type="checkbox" id="year-2017" value="17" name="year">
                                                        <label for="year-2017">2017</label>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="year">
                                                        <input type="checkbox" id="year-2018" value="18" name="year">
                                                        <label for="year-2018">2018</label>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="year">
                                                        <input type="checkbox" id="year-2019" value="19" name="year">
                                                        <label for="year-2019">2019</label>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="year">
                                                        <input type="checkbox" id="year-2020" value="20" name="year">
                                                        <label for="year-2020">2020</label>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="year">
                                                        <input type="checkbox" id="year-2021" value="21" name="year">
                                                        <label for="year-2021">2021</label>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="year">
                                                        <input type="checkbox" id="year-2022" value="22" name="year" checked>
                                                        <label for="year-2022">2022</label>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="description" style="font-weight: lighter;font-size: 14px;font-style:italic;">

                                                    </td>
                                                </tr>
                                            </table>
                                            <div class="compare-button" onclick="yearFormType('multi')">
                                                Compare
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </div>
            </td>
            <td id="page-td"> <!-- Page -->
                <div id="page-div">
                    <table id="page-table">

                        <!-- Growth Rows -->
                        <tr style="height: 100%;" id="growth-graph-tr">
                            <td class="graph-td" colspan="2">
                                <div class="graph" id="growth-graph">

                                </div>
                                <div id="growth-graph-backdrop">
                                    No Data
                                </div>
                                <div class="graph-hover" id="growth-hover">
                                    <div class="graph-hover-div">
                                        <table class="graph-hover-table" id="growth-hover-table">
                                        </table>
                                    </div>
                                </div>
                                <div id="percentile-switch" onclick="togglePercentiles()">
                                    <div class="switch"></div>
                                    <div class="label">50th Percentiles</div>
                                </div>
                            </td>
                        </tr>
                        <tr id="growth-info-tr">
                            <td class="info-td">
                                <table id="horizontal-counts-table" style="width: 100%;">
                                    <tr>
                                        <td colspan="100%" style="padding-bottom: 0.5rem;">
                                            <h2>Past Counts for <span class="variety-label">Royal Gala</span></h2>
                                        </td>
                                    </tr>
                                    <tr class="counts-tr">
                                        <td>
                                            <table style="width: 100%;">
                                                <tr>
                                                    <td>
                                                        <h1>123</h1>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <h2>2016</h2>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                        <td>
                                            <table style="width: 100%;">
                                                <tr>
                                                    <td>
                                                        <h1>123</h1>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <h2>2017</h2>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                        <td>
                                            <table style="width: 100%;">
                                                <tr>
                                                    <td>
                                                        <h1>120</h1>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <h2>2018</h2>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                        <td>
                                            <table style="width: 100%;">
                                                <tr>
                                                    <td>
                                                        <h1>131</h1>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <h2>2019</h2>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                        <td>
                                            <table style="width: 100%;">
                                                <tr>
                                                    <td>
                                                        <h1>124</h1>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <h2>2020</h2>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                        <td>
                                            <table style="width: 100%;">
                                                <tr>
                                                    <td>
                                                        <h1>131</h1>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <h2>2021</h2>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                            <td class="info-td">
                                <table style="width: 100%;">
                                    <tr>
                                        <td colspan="100%" style="padding-bottom: 0.5rem;">
                                            <h2>Target Count</h2>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table style="width: 100%;">
                                                <tr>
                                                    <td class="target-value-td">
                                                        <h1>115</h1>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="target-year-td">
                                                        <h2>2022</h2>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Prediction Rows -->
                        <tr class="display-none" id="prediction-graph-tr">
                            <td style="width:100%;height:100%;position:relative;" rowspan="2">
                                <div style="height: 100%;overflow:auto;margin: 2rem;">
                                    <table style="width: 100%;border-spacing: 0.5rem 2rem;">
                                        <tr>
                                            <td  class="graph-td">
                                                <div class="graph" id="prediction-graph">

                                                </div>
                                                <div class="graph-hover" id="prediction-hover">
                                                    <div class="graph-hover-div">
                                                        <table class="graph-hover-table" id="prediction-hover-table">
                                                        </table>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td  class="graph-td">
                                                
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                <div id="prediction-fade-top"></div>
                                <div id="prediction-fade-bottom"></div>
                            </td>
                            <td class="info-td" style="padding-top:0;padding-bottom: 0;">
                                <table id="vertical-counts-table" style="width: 100%;min-width:8rem;">
                                    <tr>
                                        <td>
                                            <h2>Past Counts for <span class="variety-label">Royal Gala</span></h2>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table style="width: 100%;">
                                                <tr>
                                                    <td>
                                                        <h1>121</h1>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <h2>2015</h2>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table style="width: 100%;">
                                                <tr>
                                                    <td>
                                                        <h1>123</h1>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <h2>2016</h2>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table style="width: 100%;">
                                                <tr>
                                                    <td>
                                                        <h1>123</h1>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <h2>2017</h2>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table style="width: 100%;">
                                                <tr>
                                                    <td>
                                                        <h1>120</h1>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <h2>2018</h2>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table style="width: 100%;">
                                                <tr>
                                                    <td>
                                                        <h1>131</h1>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <h2>2019</h2>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table style="width: 100%;">
                                                <tr>
                                                    <td>
                                                        <h1>124</h1>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <h2>2020</h2>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr class="display-none" id="prediction-info-tr">
                            <td class="info-td">
                                <table style="width: 100%;">
                                    <tr>
                                        <td colspan="100%" style="padding-bottom: 0.5rem;">
                                            <h2>Target Count</h2>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table style="width: 100%;">
                                                <tr>
                                                    <td>
                                                        <h1>131</h1>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <h2>2021</h2>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>

                            </td>
                        </tr>
                    </table>
                </div>
            </td>
        </tr>
        <tr> <!-- Footer -->
          <td colspan="2" id="footer">
            <div style="height:2rem;width:100%;overflow:none;">
              <a href="https://urbanintelligence.co.nz/" target="_blank"><img src="https://projects.urbanintelligence.co.nz/uivl/lib/Solo-Mark-Small-White-32px.png"></img></a>
              <div class="attribution">?? 2021 Urban Intelligence.</div>
            </div>
          </td>
        </tr>
    </table>




      <div id="help-popup">
        <button onclick="hideHelpPopup()">&#10006;</button>
        <h2>The 15 Minute City</h2>
        <p>As cities rapidly urbanise and adapt to climate change, there is an increasing need to shift the design of built environments to be human-centric and easy to traverse. The 5, 10, and 15-minute city is all about living locally. Giving people the ability to meet most of their everyday needs within a 15-minute walk, scooter, cycle, or public transport trip of their home. This concept was first implemented in Paris to reduce transport emissions and increase vibrancy, wellbeing, and safety within communities.<br>
          <br>This tool enables local government, central government, and communities to:<br><ul>
          <li>Guide investment prioritisation in creating highly accessible cities through place making and smart amenity locations<br>
          <li>Guide the densification and urban renaissance of towns and cities in Aotearoa <br>
          <li>Identify neighbourhoods that are underserved by a range of amenities  <br>
          <li>Identify the inequities of city design by income, ethnicity, and disability <br>
          <li>Adapt to and mitigate climate change through promoting active modes of transit, such as walking, cycling and using a wheelchair <br>
          </ul><span style="font-style: italic; font-size: 16px;">See our full post <a href="https://urbanintelligence.co.nz/project/x-minute-city" target="_blank">here</a></span><br>
          <span class="contact">Is there a destination missing? Add it to this shared Google Sheet and we'll update the site: <a
              href="https://docs.google.com/spreadsheets/d/1-FHfr8l7f9USI-YqPIua9zzrT1G4r6NP0OdLIyQQpI0/edit?usp=sharing">Google Sheet</a></span><br>
          <span class="contact">Have other suggestions or feedback? Contact us at <a href="mailto:info@urbanintelligence.co.nz?subject=About Your 15-Minute City Project">info@urbanintelligence.co.nz</a></span>
          <!--</ul><br><span style="font-style: italic; font-size: 80%;">M. J. Anderson, D. A. F. Kiddle, & T. M. Logan (2021). The Underestimated Role of the Transportation Network: Improving Disaster & Community Resilience. Transportation Research Part D : Transport and Environment. (Under Review)</span></p>
          <br><br>
          <span class="contact">Have suggestions or feedback? Contact us at <a href="mailto:info@urbanintelligence.co.nz?subject=About Your WREMO Project...">info@urbanintelligence.co.nz</a></span>
          -->
      </div>
</body>
</html>
<?php
    require_once("../ui-visual-library/js-scripts.php");
?>



<script>
    var DEBUGGING = true;
</script>
<script src="js/init.js"></script>
<script src="js/data-load.js"></script>
<script src="js/events.js"></script>
<script src="js/graphs.js"></script>