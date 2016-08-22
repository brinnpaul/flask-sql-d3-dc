queue()
    .defer(d3.json, "/question1data")
    .defer(d3.json, "static/geojson/world.json")
    .await(makeGraphs);

function makeGraphs(error, q1, world) {
  tradeData = q1
  var dateFormat = d3.time.format("%Y-%m-%d");
  tradeData.forEach(function(d) {
    d["date"] = d["date"]+"-01-01";
    d["date"] = dateFormat.parse(d["date"]);
  });

  var ndx = crossfilter(tradeData);
  var all = ndx.groupAll();
  var countAll = all.reduceCount();

  var countryDim = ndx.dimension(function(d) { return d["country"]; });
  var dateDim = ndx.dimension(function(d) { return d["date"]})

  var tradeQuantityDim = ndx.dimension(function(d) { return d["quantity"];});
  var tradeQuantityGroup = ndx.groupAll().reduceSum(function(d) { return d["quantity"];});
  var tradeQuantityByCountry = countryDim.group().reduceSum(function(d) { return d["quantity"]});
  var tradeQuantityByDate = dateDim.group().reduceSum(function(d) { return d["quantity"]});

  var tradeUSDDim = ndx.dimension(function(d) { return d["trade_usd"];});
  var tradeUSDGroup = ndx.groupAll().reduceSum(function(d) { return d["trade_usd"];});
  var tradeUSDByCountry = countryDim.group().reduceSum(function(d) { return d["trade_usd"]});
  var tradeUSDByDate = dateDim.group().reduceSum(function(d) { return d["trade_usd"]});

  var worldChartQuantity = dc.geoChoroplethChart('#world-chart-quantity');
  var worldChartUSD = dc.geoChoroplethChart('#world-chart-usd');
  var timeChartQuantity = dc.lineChart("#quantity-time-chart");
  var timeChartUSD = dc.lineChart("#usd-time-chart");

  var maxTradeUSD_country = tradeUSDByCountry.top(1)[0].value;
  var maxTradeQuantity_country = tradeQuantityByCountry.top(1)[0].value;

  var minDate = dateDim.bottom(1)[0]["date"];
  var maxDate = dateDim.top(1)[0]["date"];

  timeChartQuantity
    .width(450)
    .height(160)
    .margins({top: 10, right: 30, bottom: 30, left: 90})
    .dimension(dateDim)
    .group(tradeQuantityByDate)
    .transitionDuration(500)
    .x(d3.time.scale().domain([minDate, maxDate]))
    .elasticY(true)
    .xAxisLabel("Year")
    .yAxis().ticks(4);

  timeChartUSD
    .width(450)
    .height(160)
    .margins({top: 10, right: 30, bottom: 30, left: 90})
    .dimension(dateDim)
    .group(tradeUSDByDate)
    .transitionDuration(500)
    .x(d3.time.scale().domain([minDate, maxDate]))
    .elasticY(true)
    .xAxisLabel("Year")
    .yAxis().ticks(4);

  worldChartQuantity
  .width(1300)
    .height(300)
    .dimension(countryDim)
    .group(tradeQuantityByCountry)
    .linearColors(['white', 'blue'])
    .colorDomain([0, maxTradeQuantity_country])
    .overlayGeoJson(world["features"], "country", function (d) {
      return d.properties.name;
    })
    .projection(d3.geo.mercator()
            .scale(80)
            .translate([235, 200]))
    .title(function (p) {
      return "Country: " + p["key"]
          + "\n"
          + "Total Trade: " + Math.round(p["value"]);
    });

    worldChartUSD
    .width(1300)
      .height(300)
      .dimension(countryDim)
      .group(tradeUSDByCountry)
      .linearColors(['white', 'green'])
      .colorDomain([0, maxTradeUSD_country])
      .overlayGeoJson(world["features"], "country", function (d) {
        return d.properties.name;
      })
      .projection(d3.geo.mercator()
              .scale(80)
              .translate([235, 200]))
      .title(function (p) {
        return "Country: " + p["key"]
            + "\n"
            + "Total Trade: " + Math.round(p["value"]);
      });

    dc.renderAll();
}