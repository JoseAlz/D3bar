// CHART
d3.json(
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json",
  function (json) {
    //Width and height
    var w = window.innerWidth - 30;
    var h = 800;
    var padding = 60;
    var barPadding = 0;
    var dataLength = json.data.length;

    // set up the scales
    var firstDate = new Date(json.data[0][0]);
    var lastDate = new Date(json.data[dataLength - 1][0]);
    var xScale = d3.time
      .scale()
      .domain([firstDate, lastDate])
      .range([padding, w - padding]);
    var yScale = d3.scale
      .linear()
      .domain([
        0,
        d3.max(json.data, function (d) {
          return d[1];
        }),
      ])
      .range([h - padding, padding]);

    // set up our container svg
    var svg = d3
      .select("body")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .classed("chart-wrap", true);

    // set up the x axis
    var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(10);
    // draw the x axis
    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (h - padding) + ")")
      .call(xAxis);
    // set up the y axis
    var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(5);
    // draw the y axis
    svg
      .append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + padding + ",0)")
      .call(yAxis);

    // add bars to the chart
    var bars = svg.selectAll("rect").data(json.data).enter().append("rect");

    // add position of bars
    bars
      .attr("x", function (d, i) {
        return xScale(new Date(d[0]));
      })
      .attr("y", function (d) {
        return yScale(d[1]);
      })
      .attr("width", w / dataLength - barPadding)
      .attr("height", function (d) {
        return h - yScale(d[1]) - padding;
      });

    // add red and white stripes
    bars.attr("fill", function (d, i) {
      if (i % 20 < 10) {
        return "#440A67";
      } else {
        return "#32FF6A";
      }
    });

    // TOOLTIP
    bars.on("mouseover", function (d) {
      //Get this bar's x/y values, then augment for the tooltip
      var xPosition = parseFloat(d3.select(this).attr("x")) + 24;

      if (xPosition > window.innerWidth / 2 + 30) {
        xPosition = parseFloat(d3.select(this).attr("x")) - 200;
      }
      var yPosition = parseFloat(d3.select(this).attr("y")) + 14;
      var months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      var dateArr = d[0].split("-");
      //Update the tooltip position and value
      d3.select("#tooltip")
        .style("left", xPosition + "px")
        .style("top", yPosition + "px")
        .select("#value")
        .text(d[1]);
      d3.select("#tooltip")
        .select("#date")
        .text(months[dateArr[1] - 1] + ", " + dateArr[0]);
      //Show the tooltip
      d3.select("#tooltip").classed("hidden", false);
    });

    bars.on("mouseout", function () {
      //Hide the tooltip
      d3.select("#tooltip").classed("hidden", true);
    });

    // DESCRIPTION
    var description = json.description;
    d3.select("body").append("p").text(description).classed("container", true);

    // RESPONSIVE WIDTH
    window.onresize = function () {
      // new width
      var width = window.innerWidth - 30;
      svg.attr("width", width);
      // new x scale
      xScale = d3.time
        .scale()
        .domain([firstDate, lastDate])
        .range([padding, width - padding]);
      // update x axis
      xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(10);
      svg.select(".x.axis").transition().duration(1000).call(xAxis);
      // update bars
      bars
        .transition()
        .duration(1000)
        .attr("x", function (d) {
          return xScale(new Date(d[0]));
        })
        .attr("width", width / dataLength - barPadding);
    };
  }
);
