/* eslint-disable */
'use strict';

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
var axisRoundingY = 5;
var axisRoundingX = 2000;

var currentX = "Spending Per Student";

var presetButtonA = document.querySelector("#scatter_preset_a");
var presetButtonB = document.querySelector("#scatter_preset_b")
var presetButtonC = document.querySelector("#scatter_preset_c")

//==========End Vars==========End Vars==========End Vars==========End Vars==========End Vars==========End Vars==========End Vars==========End Vars==========End Vars==========

var scatterInit = function(){
    yDropDown.addEventListener("change", function() {
        // set x rounding
        axisRoundingX = 2000;
        var tempYValue;
        var xValue = function(d) {
            return d.ExpendPerStudent;
       };
       currentX="Spending per student";

        if (yDropDown.value == "HigherEducationRate" ){
            axisRoundingY = 5;
            currentY="Higher Education Rate";
            tempYValue = function(d) { return parseFloat(d.HigherEducationRate);}
        }
        else if(yDropDown.value == "PovertyRate"){
            axisRoundingY = 2;
            currentY = "Poverty Rate";
            tempYValue = function(d) { return parseFloat(d.PovertyRate);}
        }
        else if (yDropDown.value == "HighSchoolGradRate"){
            axisRoundingY = 5;
            currentY = "High School Graduation Rate";
            tempYValue = function(d) { return (parseFloat(d.HighSchoolGradRate));}
        }
        else if (yDropDown.value == "UnemploymentRate"){
            axisRoundingY = 1;
            currentY = "Unemployment Rate";
            tempYValue = function(d) { return (parseFloat(d.UnemploymentRate));}
        }
        else if (yDropDown.value == "studentsPerTeacher"){
            axisRoundingY = 2;
            currentY = "Students Per Teacher";
            tempYValue = function(d) {  return (parseFloat(d.TotalStudents) / parseFloat(d.TotalTeachers));}
        }
        else{
            return;
        }
        
        reDraw(tempData, tempYValue, xValue);
    });

    presetButtonA.addEventListener('click', function(){
        yDropDown.selectedIndex = 0;
        axisRoundingY = 2;
        axisRoundingX = 2;

        currentY = "Students Per Teacher";
        currentX = "Poverty Rate";
      
        var tempXValue = function(d) { return parseFloat(d.PovertyRate);}
        var tempYValue = function(d) {  return (parseFloat(d.TotalStudents) / parseFloat(d.TotalTeachers));}
     
        reDraw(tempData, tempYValue, tempXValue);
    });
    presetButtonB.addEventListener('click', function(){
        yDropDown.selectedIndex = 0;
        axisRoundingY = 5;
        axisRoundingX = 1;

        currentY = "Higher Education Rate";
        currentX = "Unemployment Rate";
      
        var tempYValue = function(d) {  return parseFloat(d.HigherEducationRate);}
        var tempXValue = function(d) { return parseFloat(d.UnemploymentRate);}
       
        reDraw(tempData, tempYValue, tempXValue);
    });
    presetButtonC.addEventListener('click', function(){
        yDropDown.selectedIndex = 0;
        axisRoundingY = 2;
        axisRoundingX = 2;

        currentY = "Highschool Grad Rate";
        currentX = "Poverty Rate";
      
        var tempXValue = function(d) { return parseFloat(d.PovertyRate);}
        var tempYValue = function(d) {  return parseFloat(d.HighSchoolGradRate);}
     
        reDraw(tempData, tempYValue, tempXValue);
    });

    d3.queue()
        .defer(d3.csv, '/assets/data.csv')
        .await(visualize);
};

var visualize = function (error, data) {
    tempData = data;

    for (var i = 0; i < data.length; i++) {
      var d = data[i];

      tempData[i].ExpendPerStudent = Math.round(parseFloat(d.ExpendForEduc) / parseFloat(d.TotalStudents) * 100) / 100;
    }

    // Setup init x values
    var xValue = function(d) {
         return d.ExpendPerStudent;
    };
    var xScale = d3.scaleLinear().range([0, width]);
    xScale.domain([
        Math.floor((d3.min(data, xValue)-1) / axisRoundingX) * axisRoundingX,
        Math.ceil((d3.max(data, xValue)+1) / axisRoundingX) *axisRoundingX 
    ]);
    var xMap = function(d) { 
        return xScale(xValue(d));
    };
    var xAxis = d3.axisBottom(xScale)
        .ticks(8)
        .tickSize(-height);

    // Setup init y values
    var yValue = function(d) { return parseFloat(d.HigherEducationRate)};
    var yScale = d3.scaleLinear().range([height, 0]);
    yScale.domain([
        Math.floor((d3.min(data, yValue)-1) / axisRoundingY) * axisRoundingY,
        Math.ceil((d3.max(data, yValue)+1) / axisRoundingY ) * axisRoundingY
    ]);
    var yMap = function(d) { return yScale(yValue(d));};
    var yAxis = d3.axisLeft(yScale)
        .ticks(8)
        .tickSize(-width);


    // Setup watch tooltip (click event)
    watchTooltip = svg.append('g');
    watchTooltip.attr('class', 'watch__tooltip')
        .attr('transform', 'translate(-410, 0)');
    watchTooltip.append('rect')
        .attr('x', 20)
        .attr('y', 0)
        .attr('height', 240)
        .attr('width', 350)
        .attr('fill', '#F0F0F0')
        .attr('stroke', '#000')
        .attr("stroke-width", 2);
    watchTooltip.append('text')
        .attr('text-anchor', 'middle')
        .attr('x', 195)
        .attr('y', 20)
        .text('Click Data to Watch');

    hoverTooltip = svg.append('g');
    hoverTooltip.attr('class', 'hover__tooltip')
        .attr('transform', 'translate(-410, 0)');
    hoverTooltip.append('rect')
        .attr('x', 20)
        .attr('y', 300)
        .attr('height', 240)
        .attr('width', 350)
        .attr('fill', '#F0F0F0')
        .attr('stroke', '#000')
        .attr("stroke-width", 2);
        hoverTooltip.append('text')
        .attr('id', 'hover__title')
        .attr('text-anchor', 'middle')
        .attr('x', 195)
        .attr('y', 320)
        .text('Hover to View Data');

    initDraw(data, xMap, yMap, xAxis, yAxis, xValue, yValue);
};

var initDraw = function (data, xMap, yMap, xAxis, yAxis, xValue, yValue){
    // x-axis
    horizontalGrid = svg.append("g")
    horizontalGrid.attr("class", "x__axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll('.tick:not(:first-of-type) line')
        .attr('stroke', '#BABABA');
        horizontalGrid.append("text")
        .attr("class", "label")
        .attr("x", width)
       // .attr("dx", "1.71em")
        .attr("y", -6)
        .style("text-anchor", "end")
        .text(currentX);
    
    
    // y-axis
    verticalGrid = svg.append("g");
    verticalGrid.attr("class", "y__axis")
        .call(yAxis)
        .selectAll('.tick:not(:first-of-type) line')
        .attr('stroke', '#BABABA');
        verticalGrid.append("text")
        .attr("class", "label")
        .attr("transform", "translate(20, 300)")        
        //.attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "1.71em")
        //.style("text-anchor", "Start")
        .attr("alignment-baseline", "hanging")
        .attr('style', 'writing-mode: vertical-rl; text-orientation: upright')
        .text(currentY || 'var name')
    
    dotGroup = svg.append('g')
      .attr('class', 'dotGroup')
      .selectAll('.circle') //any value seems to work but THIS is needed for it to grab correct circle
      .data(data)
      .enter()
      .append('g');

    // draw dots
    dotGroup.append("circle")
        .attr('id', function(d) {
            return `scatter__${d.Abbr}`
        })
        .attr("class", "dot")
        .attr("r", 12)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .attr("fill", "rgba(155, 155, 155, 1)")
        .attr("stroke", "rgba(0, 0, 0, 1)")
        .attr("stroke-width", 2)
        .on("mouseover", updateHoverWatch)
        .on("mouseout", clearHover)
        .on("click", updateWatchTooltip);

    dotGroup.append('text')
        .attr("class", "scatter__lable")
            .attr("x", xMap)
            .attr("y", yMap)
            .attr("alignment-baseline", "middle")
            .style("text-anchor", "middle")
            .style("pointer-events", "none")
            .style("font-size", "12px")
            .text(function(d) { return d.Abbr; });
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
    horizontalGrid.call(xAxis)
        .selectAll('.tick:not(:first-of-type) line')
        .attr('stroke', '#BABABA')
        .attr('opacity', 0)
        .transition()
        .duration(400)
        .attr('opacity', 1);
    horizontalGrid.append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text(currentX)
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
        .selectAll('.tick:not(:first-of-type) line')
        .attr('stroke', '#BABABA')
        .attr('opacity', 0)
        .transition()
        .duration(400)
        .attr('opacity', 1);
    verticalGrid.append("text")
        .attr("class", "label")
        .attr("transform", "translate(20, 300)")        
        //.attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        //.style("text-anchor", "Start")
        .attr("alignment-baseline", "hanging")
        .attr('style', 'writing-mode: vertical-rl; text-orientation: upright')
        .text(currentY)
        .attr('opacity', 0)
        .transition()
        .duration(400)
        .attr('opacity', 1);

    dotGroup.selectAll(".dot")
        .merge(dotGroup)
        .transition()
        .duration(400)
        .attr("cy", yMap || 0)
        .attr("cx", xMap || 0);

    dotGroup.selectAll(".scatter__lable")
        .merge(dotGroup)
        .transition()
        .duration(400)
        .attr("y", yMap || 0)
        .attr("x", xMap || 0);
};

var watchTooltip;
var prevWatchDot;
var watchFirstCall = true;

var updateWatchTooltip = function(d) {
    // get the keys in object d
    // filter out Abbr and UnemploymentRate
    var keys = Object.keys(d).filter( function(key) {
        return key !== 'Abbr' && key !== 'UnemploymentRate';
    });

    if (prevWatchDot) {
        svg.select(`#scatter__${prevWatchDot.Abbr}`)
        .transition()
        .duration(200)
        .attr('stroke', '#000');
    }

    svg.select(`#scatter__${d.Abbr}`)
        .transition()
        .duration(200)
        .attr('stroke', '#F00');

    prevWatchDot = d;

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

            watchTooltip.select('rect')
            .transition()
            .duration(400)
            .attr('stroke', '#f00');
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

var hoverTooltip;

var updateHoverWatch = function(d) {
    // get the keys in object d
    // filter out Abbr and UnemploymentRate
    var keys = Object.keys(d).filter( function(key) {
        return key !== 'Abbr' && key !== 'UnemploymentRate';
    });
    
    hoverTooltip.selectAll('.hover__' + d.Abbr)
        .data(keys)
        .enter()
        .append('text')
        .attr('class', 'hover__' + d.Abbr)
        .attr('x', 40)
        .attr('y', function (key, i) {
            return 345 + (i * 20);
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

        hoverTooltip.select('#hover__title')
        .text('Hovering')
        .attr('style', 'opacity: 0')
        .transition()
        .duration(400)
        .attr('style', 'opacity: 1');

        svg.select("#scatter__" + d.Abbr)
        .transition()
        .duration(400)
        .attr("fill", "rgb(200, 200, 200)")
}

var clearHover = function(d) {
    hoverTooltip.selectAll('.hover__' + d.Abbr)
        .transition()
        .duration(400)
        .attr('style', 'opacity: 0')
        .remove();

    hoverTooltip.select('#hover__title')
        .text('Hover to View Data')
        .attr('style', 'opacity: 0')
        .transition()
        .duration(400)
        .attr('style', 'opacity: 1');

        svg.select("#scatter__" + d.Abbr)
        .transition()
        .duration(400)
        .attr("fill", "rgb(155, 155, 155)")
}
window.addEventListener('load', scatterInit);
