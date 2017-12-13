var scatterInit = function(){
    yDropDown.addEventListener("change", function() {
        console.log(yDropDown.value);
        var tempYValue;

        if (yDropDown.value == "HigherEducationRate" ){
            //currentY="Higher Education Rate";
            tempYValue = function(d) { return parseFloat(d.HigherEducationRate);}
        }
        else if(yDropDown.value == "ExpendForEduc"){
           // currentY = "Expendutre on Education";
           tempYValue = function(d) { return parseFloat(d.ExpendForEduc);}
        }
        else if (yDropDown.value == "AveragePerStudent"){
            //currentY = "Average Spending Per Student";
            tempYValue = function(d) { return (parseFloat(d.ExpendForEduc) / parseFloat(d.TotalStudents));}
        }

        reDraw(tempData, tempYValue);
    });

    d3.queue()
        .defer(d3.csv, '/assets/data.csv')
        .await(draw);
};

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
//.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

console.log("appended SVG of " + svg);

// add the tooltip area to the webpage
var tooltip = d3.select("div.svg__container").append("div")
.attr("class", "tooltip")
.style("opacity", 0);

// data points
var dotGroup;

//==========End Vars==========End Vars==========End Vars==========End Vars==========End Vars==========End Vars==========End Vars==========End Vars==========End Vars==========


var draw = function draw(error, data){
    tempData = data;
   // svg.selectAll("*").remove();

    var xValue = function(d) {
        console.log(d);
        return parseFloat(d.PovertyRate);},
    xScale = d3.scaleLinear().range([0, width]),
    xMap = function(d) { 
        return xScale(xValue(d));
        },
    xAxis = d3.axisBottom(xScale);

    console.log(xValue);

    var yValue,
    yScale,
    yMap,
    yAxis;

    if(currentY == "Higher Education Rate"){
        yValue = function(d) { return parseFloat(d.HigherEducationRate);}
    }
    else if(currentY == "Expendutre on Education"){
        yValue = function(d) { return parseFloat(d.ExpendForEduc);}
       // yValue = parseFloat(data.ExpendForEdu);
    }
    else if(currentY == "Average Spending Per Student"){
        yValue = function(d) { return (parseFloat(d.ExpendForEduc) / parseFloat(d.TotalStudents));}
        //yValue = parseFloat(data.AveragePerStudent);
    }

    yScale = d3.scaleLinear().range([height, 0]);
    yMap = function(d) { return yScale(yValue(d));};
    yAxis = d3.axisLeft(yScale);

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
    .attr("transform", "translate(20, 300)")        
    //.attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    //.style("text-anchor", "Start")
    .attr("alignment-baseline", "hanging")
    .attr('style', 'writing-mode: vertical-rl; text-orientation: upright')
    .text(currentY);
    
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
}

var reDraw = function(data, yValue){
    var xValue = function(d) {
        console.log(d);
        return parseFloat(d.PovertyRate);},
    xScale = d3.scaleLinear().range([0, width]),
    xMap = function(d) { 
        return xScale(xValue(d));
        },
    xAxis = d3.axisBottom(xScale);

    console.log(xValue);

   // var yValue,
    yScale,
    yMap,
    yAxis;

    if(currentY == "Higher Education Rate"){
        yValue = function(d) { return parseFloat(d.HigherEducationRate);}
    }
    else if(currentY == "Expendutre on Education"){
        yValue = function(d) { return parseFloat(d.ExpendForEduc);}
       // yValue = parseFloat(data.ExpendForEdu);
    }
    else if(currentY == "Average Spending Per Student"){
        yValue = function(d) { return (parseFloat(d.ExpendForEduc) / parseFloat(d.TotalStudents));}
        //yValue = parseFloat(data.AveragePerStudent);
    }

    yScale = d3.scaleLinear().range([height, 0]);
    yMap = function(d) { return yScale(yValue(d));};
    yAxis = d3.axisLeft(yScale);

    // don't want dots overlapping axis, so add in buffer to data domain
    xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
    yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

    dotGroup.selectAll(".dot")
        .data(data)
        .merge(dotGroup)
        .transition()
        .duration(400)
        .attr("cx", xMap)
        .attr("cy", yMap);
 }
window.addEventListener('load', scatterInit);