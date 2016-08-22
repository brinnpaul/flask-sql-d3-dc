queue()
    .defer(d3.json, "/question2datadem")
    .defer(d3.json, "/question2dataconf")
    .defer(d3.json, "static/geojson/world.json")
    .await(makeGraphs);

function makeGraphs(error, q2_dem, q2_conf, world) {

  // console.log(q2_dem, q2_conf)

  var ndx_dem = crossfilter(q2_dem);
  var ndx_conf = crossfilter(q2_conf);

  var demDim = ndx_dem.dimension(function(d) { return d["dem_index"];});
  var countryDimDem = ndx_dem.dimension(function(d) { return d["country"];});
  var incomeDimDem = ndx_dem.dimension(function(d) { return d["income"];});
  var demByCountry = countryDimDem.group().reduceSum(function(d) { return d["dem_index"];});
  var demByIncome = incomeDimDem.group().reduceSum(function(d) { return d["dem_index"];});
  var avg_dem_by_income = incomeDimDem.group().reduce(
    function(p, v) {
      p.count++;
      p.total += v["dem_index"];
      return p;
    },
    function(p, v) {
      --p.count;
      p.total -= v["dem_index"];
      return p;
    },
    function() {
      return {count: 0, total: 0};
    });

  var confDim = ndx_conf.dimension(function(d) { return d["conflict"]});
  var countryDimConf = ndx_conf.dimension(function(d) { return d["country"];});
  var incomeDimConf = ndx_conf.dimension(function(d) { return d["income"];});
  var confByCountry = countryDimConf.group().reduceSum(function(d) { return d["conflict"];});
  var confByIncome = incomeDimConf.group().reduceSum(function(d) { return d["conflict"];});
  var avg_conflict_by_income = incomeDimConf.group().reduce(
    function(p, v) {
      p.count++;
      p.total += v["conflict"];
      return p;
    },
    function(p, v) {
      --p.count;
      p.total -= v["conflict"];
      return p;
    },
    function() {
      return {count: 0, total: 0};
    });


  var avgConflictChart = dc.rowChart("#avg-conflict-chart");
  avgConflictChart
        .width(300)
        .height(250)
        .dimension(incomeDimConf)
        .group(avg_conflict_by_income)
        .valueAccessor(function(p) {
          return p.value.count > 0 ? p.value.total / p.value.count : 0;
        })
        .xAxis().ticks(4);

    var avgDemChart = dc.rowChart("#avg-dem-chart");
    avgDemChart
          .width(300)
          .height(250)
          .dimension(incomeDimDem)
          .group(avg_dem_by_income)
          .valueAccessor(function(p) {
            return p.value.count > 0 ? p.value.total / p.value.count : 0;
          })
          .xAxis().ticks(4);


  var conflict_world_chart = dc.geoChoroplethChart("#conflict-world-chart");
  var dem_world_chart = dc.geoChoroplethChart("#dem-world-chart");

  var max_country_conf = confByCountry.top(1)[0].value;
  var max_country_dem = demByCountry.top(1)[0].value;

  conflict_world_chart.width(1300)
    .height(300)
    .dimension(countryDimConf)
    .group(confByCountry)
    .linearColors(['white', 'red'])
    .colorDomain([0, max_country_conf])
    .overlayGeoJson(world["features"], "country", function (d) {
      return d.properties.name;
    })
    .projection(d3.geo.mercator()
            .scale(100)
            .translate([300, 200]))
    .title(function (p) {
      return "Country: " + p["key"]
          + "\n"
          + "Total Workers: " + Math.round(p["value"]);
    });

    dem_world_chart.width(1300)
      .height(300)
      .dimension(countryDimDem)
      .group(demByCountry)
      .linearColors(['white', 'blue'])
      .colorDomain([0, max_country_dem])
      .overlayGeoJson(world["features"], "country", function (d) {
        return d.properties.name;
      })
      .projection(d3.geo.mercator()
              .scale(100)
              .translate([300, 200]))
      .title(function (p) {
        return "Country: " + p["key"]
            + "\n"
            + "Total Workers: " + Math.round(p["value"]);
      });

  dc.renderAll();

}