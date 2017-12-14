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

// grid
var horizontalGrid;
var verticalGrid;

console.log("appended SVG of " + svg);

// add the tooltip area to the webpage
var tooltip = d3.select("div.svg__container").append("div")
.attr("class", "tooltip")
.style("opacity", 0);

// data points
var dotGroup;
var dotGroupText;
var axisRoundingY = 5;
var axisRoundingX = 1000;

var currentX = "Spending Per Student";

var presetButtonA = document.querySelector("#scatter_preset_a");
var presetButtonB = document.querySelector("#scatter_preset_b")
var presetButtonC = document.querySelector("#scatter_preset_c")

//==========End Vars==========End Vars==========End Vars==========End Vars==========End Vars==========End Vars==========End Vars==========End Vars==========End Vars==========

var scatterInit = function(){
    yDropDown.addEventListener("change", function() {
        var tempYValue;
        var xValue = function(d) {
            return (parseFloat(d.ExpendForEduc) / parseFloat(d.TotalStudents));
       };
       currentX="Spending per student";

        if (yDropDown.value == "HigherEducationRate" ){
            axisRoundingY = 5;
            currentY="Higher Education Rate";
            tempYValue = function(d) { return parseFloat(d.HigherEducationRate);}
        }
        else if(yDropDown.value == "PovertyRate"){
            axisRoundingY = 1;
            currentY = "Poverty Rate";
            tempYValue = function(d) { return parseFloat(d.PovertyRate);}
        }
        else if (yDropDown.value == "HighSchoolGradRate"){
            axisRoundingY = 3;
            currentY = "High School Graduation Rate";
            tempYValue = function(d) { return (parseFloat(d.HighSchoolGradRate));}
        }
        else if (yDropDown.value == "UnemploymentRate"){
            axisRoundingY = 1;
            currentY = "Unemployment Rate";
            tempYValue = function(d) { return (parseFloat(d.UnemploymentRate));}
        }
        else if (yDropDown.value == "studentsPerTeacher"){
            axisRoundingY = 1;
            currentY = "Students Per Teacher";
            tempYValue = function(d) {  return (parseFloat(d.TotalStudents) / parseFloat(d.TotalTeachers));}
        }
        
        reDraw(tempData, tempYValue, xValue);
    });

    presetButtonA.addEventListener('click', function(){
        axisRoundingY = 2;
        axisRoundingx = 1;

        currentY = "Students Per Teacher";
        currentX = "Poverty Rate";
      
        tempXValue = function(d) { return parseFloat(d.PovertyRate);}
        tempYValue = function(d) {  return (parseFloat(d.TotalStudents) / parseFloat(d.TotalTeachers));}
     
        reDraw(tempData, tempYValue, tempXValue);
    });
    presetButtonB.addEventListener('click', function(){
        axisRoundingY = 5;
        axisRoundingx = 1;

        currentY = "Higher Education Rate";
        currentX = "Unemployment Rate";
      
        tempYValue = function(d) {  return parseFloat(d.HigherEducationRate);}
        tempXValue = function(d) { return parseFloat(d.UnemploymentRate);}
       
        reDraw(tempData, tempYValue, tempXValue);
    });
    presetButtonC.addEventListener('click', function(){
        axisRoundingY = 2;
        axisRoundingx = 1;

        currentY = "Highschool Grad Rate";
        currentX = "Poverty Rate";
      
        tempXValue = function(d) { return parseFloat(d.PovertyRate);}
        tempYValue = function(d) {  return parseFloat(d.HighSchoolGradRate);}
     
        reDraw(tempData, tempYValue, tempXValue);
    });

    d3.queue()
        .defer(d3.csv, '/assets/data.csv')
        .await(visualize);
};

var visualize = function (error, data) {
    tempData = data;

    // svg.selectAll("*").remove();

    // Setup init x values
    var xValue = function(d) {
         return (parseFloat(d.ExpendForEduc) / parseFloat(d.TotalStudents));
    },
    xMap = function(d) { 
        return xScale(xValue(d));
    },
    xScale = d3.scaleLinear().range([0, width]);
    xScale.domain([
        Math.floor((d3.min(data, xValue)-1) / axisRoundingX) * axisRoundingX,
        Math.ceil((d3.max(data, xValue)+1) / axisRoundingX) *axisRoundingX 
    ]);
    var xAxis = d3.axisBottom(xScale)
        .ticks(8)
        .tickSize(-height);

    // Setup init y values
    var yValue = function(d) { return parseFloat(d.HigherEducationRate)},
    yScale,
    yMap,
    yAxis;

    yScale = d3.scaleLinear().range([height, 0]);
    yScale.domain([
        Math.floor((d3.min(data, yValue)-1) / axisRoundingY) * axisRoundingY,
        Math.ceil((d3.max(data, yValue)+1) / axisRoundingY ) * axisRoundingY
    ]);
    yMap = function(d) { return yScale(yValue(d));};
    yAxis = d3.axisLeft(yScale)
        .ticks(8)
        .tickSize(-width);


    // Setup watch tooltip (click event)
    watchTooltip = svg.append('g');
    watchTooltip.attr('class', 'watch__tooltip')
        .attr('transform', 'translate(-410, 0)');
    watchTooltip.append('rect')
        .attr('x', 20)
        .attr('y', 0)
        .attr('height', 220)
        .attr('width', 350)
        .attr('fill', '#F0F0F0')
        .attr('stroke', '#000');
    watchTooltip.append('text')
        .attr('text-anchor', 'middle')
        .attr('x', 195)
        .attr('y', 20)
        .text('Click Data to Watch');

    initDraw(data, xMap, yMap, xAxis, yAxis, xValue, yValue);
};

var initDraw = function (data, xMap, yMap, xAxis, yAxis, xValue, yValue){
    // x-axis
    horizontalGrid = svg.append("g");
    horizontalGrid.attr("class", "x__axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "label")
    .attr("x", width)
    .attr("y", -6)
    .style("text-anchor", "end")
    .text(currentX)
    .selectAll('.tick:not(:first-of-type) line')
    .attr('stroke', '#BABABA');
    
    // y-axis
    verticalGrid = svg.append("g");
    verticalGrid.attr("class", "y__axis")
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
    dotGroupText = svg.append('g');

    // draw dots
    dotGroup.selectAll(".dot")
        .data(data)
        .enter()      
        .append("circle")
        .attr("class", "dot")
        .attr("r", 15)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .attr("fill", "rgba(155, 155, 155, 1)")
        .attr("stroke", "rgba(0, 0, 0, 1)")
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
        })
        .on("click", updateWatchTooltip);

    dotGroupText.selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .attr("x", xMap)
        .attr("y", yMap)
        .style("font-size", "12px")
        .style("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .style('pointer-events', 'none')
        .text(function (d) {
            return d.Abbr
        });
};

var reDraw = function(data, yValue, xValue) {
    var xScale = d3.scaleLinear().range([0, width]);
    xScale.domain([
        Math.floor((d3.min(data, xValue)-1) / axisRoundingX) * axisRoundingX,
        Math.ceil((d3.max(data, xValue)+1) / axisRoundingX) *axisRoundingX 
    ]);
    var xMap = function(d) { 
        return xScale(xValue(d) || 0);
    };
    var xAxis = d3.axisBottom(xScale)
    .ticks(8)
    .tickSize(-height);


    var yScale = d3.scaleLinear().range([height, 0]);
    // don't want dots overlapping axis, so add in buffer to data domain
    yScale.domain([
        Math.floor((d3.min(data, yValue)-1) / axisRoundingY) * axisRoundingY,
        Math.ceil((d3.max(data, yValue)+1) / axisRoundingY ) * axisRoundingY
    ]);

    var yMap = function(d) { 
        return yScale(yValue(d) || 0);
    };
    var yAxis = d3.axisLeft(yScale)
        .ticks(8)
        .tickSize(-width);

    //x-axis
    horizontalGrid.selectAll('*').remove();
    horizontalGrid.attr('opacity', 0)
        .transition()
        .duration(400)
        .attr('opacity', 1);
    horizontalGrid.call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text(currentX)
        .selectAll('.tick:not(:first-of-type) line')
        .attr('stroke', '#BABABA')
        .attr('opacity', 0)
        .transition()
        .duration(400)
        .attr('opacity', 1);

    // y-axis
    verticalGrid.selectAll('*').remove();
    verticalGrid.attr('opacity', 0)
        .transition()
        .duration(400)
        .attr('opacity', 1);
    verticalGrid.call(yAxis)
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
        .attr('stroke', '#BABABA')
        .attr('opacity', 0)
        .transition()
        .duration(400)
        .attr('opacity', 1);

    dotGroup.selectAll(".dot")
        .data(data)
        .merge(dotGroup)
        .transition()
        .duration(400)
        .attr("cy", yMap || 0)
        .attr("cx", xMap || 0);

    dotGroupText.selectAll("text")
        .data(data)
        .merge(dotGroup)
        .transition()
        .duration(400)
        .attr("y", yMap || 0)
        .attr("x", xMap || 0);
};

var watchTooltip;
var watchFirstCall = true;

var updateWatchTooltip = function(d) {
    // get the keys in object d
    // filter out Abbr and UnemploymentRate
    var keys = Object.keys(d).filter( function(key) {
        return key !== 'Abbr' && key !== 'UnemploymentRate';
    });

    // add data if its the first call otherwise change the values with merge
    if (watchFirstCall) {
        watchTooltip.selectAll('text').remove();

        watchFirstCall = false;
        watchTooltip.selectAll('text')
            .data(keys)
            .enter()
            .append('text')
            .attr('x', 40)
            .attr('y', function (key, i) {
                return 45 + (i * 20);
            })
            .attr('style', 'opacity: 0')
            .transition()
            .duration(400)
            .attr('style', 'opacity: 1')
            .text(function (key, i) {
              var dataValue = d[key] || 'N/A';

              if (i > 4) {
                dataValue = numberWithCommas(parseFloat(d[key]));
              }

              // add dollar symbol
              if (i > 7) {
                dataValue = `$${dataValue}`;
              }

              return `${addSpace(key)}: ${dataValue}`;
            });

        watchTooltip.append('text')
            .attr('text-anchor', 'middle')
            .attr('x', 195)
            .attr('y', 20)
            .text('Watching')
            .attr('style', 'opacity: 0')
            .transition()
            .duration(400)
            .attr('style', 'opacity: 1');
    } else {
        watchTooltip.selectAll('text')
            .data(keys)
            .merge(watchTooltip)
            .text(function (key, i) {
              var dataValue = d[key] || 'N/A';

              if (i > 4) {
                dataValue = numberWithCommas(parseFloat(d[key]));
              }

              // add dollar symbol
              if (i > 7) {
                dataValue = `$${dataValue}`;
              }

              return `${addSpace(key)}: ${dataValue}`;
            });
    }
};

window.addEventListener('load', scatterInit);
