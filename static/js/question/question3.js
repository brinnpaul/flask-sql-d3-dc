queue()
    .defer(d3.json, "/question3data")
    .defer(d3.json, "static/geojson/world.json")
    .await(makeGraphs);

function makeGraphs(error, q3, world) {

    var ndx = crossfilter(q3);
    var all = ndx.groupAll();
    var countAll = all.reduceCount();

    var totalWorkersND = dc.numberDisplay("#total-workers-chart");
    var totalWorkers = ndx.groupAll().reduceSum(function(d) {return d["total_workers"];});

    totalWorkersND
      .formatNumber(d3.format("d"))
      .valueAccessor(function(d){return d; })
      .group(totalWorkers)
      .formatNumber(d3.format(".3s"));

    var FemaleWorkersND = dc.numberDisplay("#female-workers-chart");
    var femaleWorkersDim = ndx.dimension(function(d) { return d["female_workers"];});
    var FWgroup = femaleWorkersDim.groupAll().reduceSum(function(d) { return d["female_workers"]})

    FemaleWorkersND
      .formatNumber(d3.format("d"))
      .valueAccessor(function(d) { return d; })
      .group(FWgroup)
      .formatNumber(d3.format(".3s"));

    var countryDim = ndx.dimension(function(d) { return d["country"]; });
  	var workers  = ndx.dimension(function(d) { return d["total_workers"]; });
    var workersByCountry = countryDim.group().reduceSum(function(d) {
      return d["total_workers"];
    });

    var popND2013 = dc.numberDisplay("#pop-2013");
    var popND2014 = dc.numberDisplay("#pop-2014");
    var popND2015 = dc.numberDisplay("#pop-2015");
    var popND2016 = dc.numberDisplay("#pop-2016");
    var popND2017 = dc.numberDisplay("#pop-2017");

    var ueDim2013 = ndx.dimension(function(d) { return d["ue_2013"]});
    var ueDim2014 = ndx.dimension(function(d) { return d["ue_2014"]});
    var ueDim2015 = ndx.dimension(function(d) { return d["ue_2015"]});
    var ueDim2016 = ndx.dimension(function(d) { return d["ue_2016"]});
    var ueDim2017 = ndx.dimension(function(d) { return d["ue_2017"]});

    var popGroup2013 = ndx.groupAll().reduceSum(function(d) {return d["pop_2013"];});
    var popGroup2014 = ndx.groupAll().reduceSum(function(d) {return d["pop_2014"];});
    var popGroup2015 = ndx.groupAll().reduceSum(function(d) {return d["pop_2015"];});
    var popGroup2016 = ndx.groupAll().reduceSum(function(d) {return d["pop_2016"];});
    var popGroup2017 = ndx.groupAll().reduceSum(function(d) {return d["pop_2017"];});

    var ueGroup2013 = ndx.groupAll().reduceSum(function(d) {return d["ue_2013"];});
    var ueGroup2014 = ndx.groupAll().reduceSum(function(d) {return d["ue_2014"];});
    var ueGroup2015 = ndx.groupAll().reduceSum(function(d) {return d["ue_2015"];});
    var ueGroup2016 = ndx.groupAll().reduceSum(function(d) {return d["ue_2016"];});
    var ueGroup2017 = ndx.groupAll().reduceSum(function(d) {return d["ue_2017"];});


    popND2013
      .formatNumber(d3.format("d"))
      .valueAccessor(function(d){return d; })
      .group(popGroup2013)
      .formatNumber(d3.format(".4r"));

    popND2014
      .formatNumber(d3.format("d"))
      .valueAccessor(function(d){return d; })
      .group(popGroup2014)
      .formatNumber(d3.format(".4r"));

    popND2015
      .formatNumber(d3.format("d"))
      .valueAccessor(function(d){return d; })
      .group(popGroup2015)
      .formatNumber(d3.format(".4r"));

    popND2016
      .formatNumber(d3.format("d"))
      .valueAccessor(function(d){return d; })
      .group(popGroup2016)
      .formatNumber(d3.format(".4r"));

    popND2017
      .formatNumber(d3.format("d"))
      .valueAccessor(function(d){return d; })
      .group(popGroup2017)
      .formatNumber(d3.format(".4r"));

    var worldChart = dc.geoChoroplethChart("#world-chart");
    var max_country = workersByCountry.top(1)[0].value

  	worldChart.width(1300)
  		.height(300)
  		.dimension(countryDim)
  		.group(workersByCountry)
      .linearColors(['white', 'purple'])
  		.colorDomain([0, max_country])
  		.overlayGeoJson(world["features"], "country", function (d) {
  			return d.properties.name;
  		})
  		.projection(d3.geo.mercator()
      				.scale(120)
      				.translate([400, 200]))
  		.title(function (p) {
  			return "Country: " + p["key"]
  					+ "\n"
  					+ "Total Workers: " + Math.round(p["value"]);
  		})

      dc.renderAll();
    }