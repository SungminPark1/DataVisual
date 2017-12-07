window.addEventListener('load', function() {
    var padding = "25px 20px 45px 430px",
    width = 600,
    height = 600;

    var xValue = function(d) { return parseFloat(d.PovertyRate);},
    xScale = d3.scaleLinear().range([0, width]),
    xMap = function(d) { 
        return xScale(xValue(d));
        },
    xAxis = d3.axisBottom(xScale);

    var yValue = function(d) { return parseFloat(d.HigherEducationRate);},
    yScale = d3.scaleLinear().range([height, 0]),
    yMap = function(d) { return yScale(yValue(d));},
    yAxis = d3.axisLeft(yScale);

    // setup fill color TODO
    /*
    var cValue = function(d) { return d.VAR;}, //replace d.VAR with deseried varaible
    color = d3.scale.category10();
    */

    // add the graph canvas to the body of the webpage
    var svg = d3.select("div.svg__scatter").append("svg")
    .attr("width", width)
    .attr("height", height)
	.style("padding", padding )
    .append("g");
    //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    console.log("appended SVG of " + svg);

    // add the tooltip area to the webpage
    var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
    //==========End Vars==========End Vars==========End Vars==========End Vars==========End Vars==========End Vars==========End Vars==========End Vars==========End Vars==========



    // load data TODO
    d3.csv("/assets/data.csv", function(error, data) 
    {
    // don't want dots overlapping axis, so add in buffer to data domain
    xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
    yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);


    // x-axis
    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "label")
    .attr("x", width)
    .attr("y", -6)
    .style("text-anchor", "end")
    .text("Poverty Rate");
    
    // y-axis
    svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Higher Education Rate");
    
    // draw dots
    svg.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("r", 7.0)
    .attr("cx", xMap)
    .attr("cy", yMap)
	.attr("fill", "rgba(0, 0, 0, .5)")
    /* .style("fill", function(d) { return color(cValue(d));}) */
    .on("mouseover", function(d) {
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html(d.State + "<br/> (" + d.PovertyRate 
            + ", " + yValue(d) + ")")
            .style("left", (d3.event.pageX + 5) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
         })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
    })
});
