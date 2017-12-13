/* eslint-disable */

var padding = "25px 20px 45px 430px",
width = 600,
height = 600;

var currentY = "Higher Education Rate";
var yDropDown = document.querySelector("#y_select");

var tempData;

// add the graph canvas to the body of the webpage
var svg = d3.select("div.svg__scatter").append("svg")
.attr("width", width)
.attr("height", height)
.style("padding", padding )
.append("g");

console.log("appended SVG of " + svg);

// add the tooltip area to the webpage
var tooltip = d3.select("div.svg__container").append("div")
.attr("class", "tooltip")
.style("opacity", 0);

// data points
var dotGroup;
var axisRounding = 5;

//==========End Vars==========End Vars==========End Vars==========End Vars==========End Vars==========End Vars==========End Vars==========End Vars==========End Vars==========

var scatterInit = function(){
    yDropDown.addEventListener("change", function() {
        var tempYValue;

        if (yDropDown.value == "HigherEducationRate" ){
            axisRounding = 5;
            currentY="Higher Education Rate";
            tempYValue = function(d) { return parseFloat(d.HigherEducationRate);}
        }
        else if(yDropDown.value == "ExpendForEduc"){
            axisRounding = 1;
            currentY = "Expendutre on Education";
            tempYValue = function(d) { return parseFloat(d.ExpendForEduc);}
        }
        else if (yDropDown.value == "AveragePerStudent"){
            axisRounding = 1000;
            currentY = "Average Spending Per Student";
            tempYValue = function(d) { return (parseFloat(d.ExpendForEduc) / parseFloat(d.TotalStudents));}
        }

        reDraw(tempData, tempYValue);
    });

    d3.queue()
        .defer(d3.csv, '/assets/data.csv')
        .await(visualize);
};

var visualize = function (error, data) {
    tempData = data;

    // svg.selectAll("*").remove();

    var xValue = function(d) {
        return parseFloat(d.PovertyRate);
    },
    xMap = function(d) { 
        return xScale(xValue(d));
    },
    xScale = d3.scaleLinear().range([0, width]);
    xScale.domain([
        Math.floor((d3.min(data, xValue)-1) / 2) * 2,
        Math.ceil((d3.max(data, xValue)+1) / 2) *2 
    ]);
    var xAxis = d3.axisBottom(xScale)
        .ticks(8)
        .tickSize(-height);

    var yValue = function(d) { return parseFloat(d.HigherEducationRate)},
    yScale,
    yMap,
    yAxis;

    yScale = d3.scaleLinear().range([height, 0]);
    yScale.domain([
        Math.floor((d3.min(data, yValue)-1) / axisRounding) * axisRounding,
        Math.ceil((d3.max(data, yValue)+1) / axisRounding ) * axisRounding
    ]);
    yMap = function(d) { return yScale(yValue(d));};
    yAxis = d3.axisLeft(yScale)
        .ticks(8)
        .tickSize(-width);

    initDraw(data, xMap, yMap, xAxis, yAxis, xValue, yValue);
};

var initDraw = function (data, xMap, yMap, xAxis, yAxis, xValue, yValue){
    // x-axis
    svg.append("g")
    .attr("class", "x__axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "label")
    .attr("x", width)
    .attr("y", -6)
    .style("text-anchor", "end")
    .text("Poverty Rate")
    .selectAll('.tick:not(:first-of-type) line')
    .attr('stroke', '#BABABA');
    
    // y-axis
    svg.append("g")
    .attr("class", "y__axis")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("transform", "translate(20, 300)")        
    //.attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    //.style("text-anchor", "Start")
    .attr("alignment-baseline", "hanging")
    .attr('style', 'writing-mode: vertical-rl; text-orientation: upright')
    .text(currentY || 'var name')
    .selectAll('.tick:not(:first-of-type) line')
    .attr('stroke', '#BABABA');
    
    dotGroup = svg.append('g');
    // draw dots
    dotGroup.selectAll(".dot")
        .data(data)
        .enter()      
        .append("circle")
        .attr("class", "dot")
        .attr("r", 7.0)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .attr("fill", "rgba(0, 0, 0, .5)")
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
};

var reDraw = function(data, yValue) {
    var yScale,
    yMap,
    yAxis;

    yScale = d3.scaleLinear().range([height, 0]);
    // don't want dots overlapping axis, so add in buffer to data domain
    yScale.domain([
        Math.floor((d3.min(data, yValue)-1) / axisRounding) * axisRounding,
        Math.ceil((d3.max(data, yValue)+1) / axisRounding ) * axisRounding
    ]);

    yMap = function(d) { return yScale(yValue(d));};
    yAxis = d3.axisLeft(yScale)
        .ticks(8)
        .tickSize(-width);

    // y-axis
    svg.selectAll('.y__axis').remove();
    svg.append("g")
    .attr("class", "y__axis")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("transform", "translate(20, 300)")        
    //.attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    //.style("text-anchor", "Start")
    .attr("alignment-baseline", "hanging")
    .attr('style', 'writing-mode: vertical-rl; text-orientation: upright')
    .text(currentY)
    .selectAll('.tick:not(:first-of-type) line')
    .attr('stroke', '#BABABA');

    dotGroup.selectAll(".dot")
        .data(data)
        .merge(dotGroup)
        .transition()
        .duration(400)
        .attr("cy", yMap);
};

window.addEventListener('load', scatterInit);
