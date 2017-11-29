const width = 680;
const height = 680;

const svg = d3.select("div.svg__graph").append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("padding", '30px 60px 60px 60px')
  .style("background-color", "white");

let dataSet;
let yearRange;
let year;

const parseData = (d) => {
  return {
    country: d.Country.replace(/\s/, ''),
    year: parseFloat(d.Year),
    workHours: parseFloat(d.WorkHours),
    lifeExp: parseFloat(d.LifeExpectancy),
    employment: parseFloat(d.EmploymentRate),
  };
}

const getKeyName = (key) => {
  let keyName =  key;
  if (keyName === 'country') keyName = 'Country';
  else if (keyName === 'workHours') keyName = 'Work Hours';
  else if (keyName === 'lifeExp') keyName = 'Life Expectancy';
  else if (keyName === 'employment') keyName = 'Employment Rate';

  return keyName;
};

const addSpace = (str) => {
  if (typeof str !== 'string') return str;
  const string = str;

  return string.replace(/([a-z])([A-Z])/, '$1 $2');
}

d3.csv('./modifed_data.csv', parseData, (data) => {
  dataSet = data;
  year = year || 2010; // if init does run first (for some reason) fall back to 2010
  console.log(data);
  let toolTip;

  // min/max is rounded to 10's
  const maxY = Math.ceil(d3.max(data, d => d.employment) / 10) * 10;
  const minY = (Math.floor(d3.min(data, d => d.employment) / 10)) * 10;
  const scaleY = d3.scaleLinear()
    .domain([minY, maxY])
    .range([height, 0]);

  // min/max is rounded to 100's
  const maxX = Math.ceil(d3.max(data, d => d.workHours) / 100) * 100;
  const minX = (Math.floor(d3.min(data, d => d.workHours) / 100)- 1) * 100;
  const scaleX = d3.scaleLinear()
    .domain([minX, maxX])
    .range([0, width]);

  // min color rgb(0, 85, 85)    max color rgb(175, 255, 255)
  const maxBright = Math.ceil(d3.max(data, d => d.lifeExp));
  const minBright = Math.floor(d3.min(data, d => d.lifeExp));
  console.log(minBright, maxBright)
  const scaleColor = d3.scaleLinear()
    .domain([minBright, maxBright])
    .range([0, 175]);

  // y axis label
  svg.append('text')
    .attr('transform', 'translate(-40, 0)')
    .attr('x',10)
    .attr('y', height/4)
    .attr('style', 'writing-mode: vertical-rl; text-orientation: upright')
    .text('Employment Rate %');

  // x axis label
  svg.append('text')
    .attr('transform', `translate(${(width / 3) + 40}, 40)`)
    .attr('x',10)
    .attr('y', height)
    .text('Annual Work Hours');

  // horizontal grid lines
  const horizontalGrid = svg.append('g');
  const yAxis = d3.axisLeft(scaleY)
    .ticks(8)
    .tickSize(-width);

  horizontalGrid.attr('transform', 'translate(0, 0)')
    .call(yAxis)
    .selectAll('.tick:not(:first-of-type) line')
    .attr('stroke', '#BABABA');

  horizontalGrid.selectAll('.tick:first-of-type text')
    .attr('transform', 'translate(0, -5)');

  // vertical gird lines
  const verticalGrid = svg.append('g');
  const xAxis = d3.axisBottom(scaleX)
    .ticks(8)
    .tickSize(-height);

  verticalGrid.attr('transform', `translate(0, ${height})`)
    .call(xAxis)
    .selectAll('.tick:not(:first-of-type) line')
    .attr('stroke', '#BABABA');

  verticalGrid.selectAll('.tick:first-of-type text')
    .attr('transform', 'translate(0, 5)');

  // Legend
  const legend = svg.append('g');
  const gradient = legend.append('defs').append('linearGradient');
  gradient.attr('y1', "0%")
    .attr('id', 'gradient')
    .attr('x1', "0%")
    .attr('y2', "0%")
    .attr('x2', "100%");
  gradient.append('stop')
    .attr('offset', '0%')
    .attr('style', 'stop-color:rgb(0,85,85);stop-opacity:1');
  gradient.append('stop')
    .attr('offset', '100%')
    .attr('style', 'stop-color:rgb(175,255,255);stop-opacity:1');

  legend.append('rect')
    .attr('y', 10)
    .attr('x', width - 210)
    .attr('height', 100)
    .attr('width', 200)
    .attr('stroke', 'black')
    .attr('fill', '#F0F0F0');

  legend.append('rect')
    .attr('y', 50)
    .attr('x', width - 180)
    .attr('height', 20)
    .attr('width', 140)
    .attr('stroke', 'black')
    .attr('fill', 'url(#gradient)');

  legend.append('text')
    .attr('y', 90)
    .attr('x', width - 190)
    .text(() => `${minBright}%`);

  legend.append('text')
    .attr('y', 90)
    .attr('x', width - 50)
    .text(() => `${maxBright}%`);

  legend.append('text')
    .attr('y', 40)
    .attr('x', width - 160)
    .text(() => `Life Expectancy`);

  // data points
  // Edge case behavior:
  // if employment or work hours is NaN transition opacity to 0
  // if life expectancy is NaN fill is black
  const dataPoints= svg.append('g');
  dataPoints.attr('id', 'data__points');
  console.log(data.filter(point => point.year === year));
  dataPoints.selectAll('circle')
    .data(data.filter(point => point.year === year))
    .enter()
    .append('circle')
    .attr('id', (d) => `dataPoint__${d.country}`)
    .attr('cy', (d) => {
      return scaleY(d.employment);
    })
    .attr('cx', (d) => {
      return scaleX(d.workHours || minX);
    })
    .attr('r', 10)
    .attr('stroke', 'black')
    .attr('fill', (d) => {
      const scale = Math.round(scaleColor(d.lifeExp));
      return `rgb(${scale || 0}, ${(85 + scale) || 0}, ${(85 + scale) || 0})`;
    })
    .attr('style', d => `opacity: ${d.employment && d.workHours ? 1 : 0}`)
    .on('mouseover', (d) => {
      // on mouse over event
      toolTip = svg.append('g');

      dataPoints.select(`#dataPoint__${d.country}`)
        .transition()
        .duration(250)
        .attr('r', 15);

      // prevent NaN values
      if (d.employment && d.workHours) {
        // prevent tooltip from going off screen
        let value = scaleX(d.workHours || minX);
        if (value + 20 > 500) {
          value -= 220;
        } else {
          value += 20;
        }
        toolTip.append('rect')
          .attr('y', () => {
            return scaleY(d.employment) - 20;
          })
          .attr('x', () => {
            return value;
          })
          .attr('height', 100)
          .attr('width', 200)
          .attr('stroke', 'black')
          .attr('fill', '#F0F0F0')
          .attr('style', 'opacity: 0')
          .transition()
          .duration(250)
          .attr('style', 'opacity: 1');

        // filter out year and append text for each value
        const keys = Object.keys(d).filter(key => key !== 'year');

        toolTip.selectAll('text')
          .data(keys)
          .enter()
          .append('text')
          .attr('y', (key, i) => {
            return scaleY(d.employment) + 5 + (i * 20);
          })
          .attr('x', () => {
            return value + 10;
          })
          .text((key , i) => {
            let suffix = '';
            if (i === 1) suffix = ' Hours';
            else if (i === 2) suffix = ' Years';
            else if (i === 3) suffix = '%';

            return `${getKeyName(key)}: ${addSpace(d[key]) || 'No Data'}${suffix}`;
          })
          .attr('style', 'opacity: 0')
          .transition()
          .duration(250)
          .attr('style', 'opacity: 1');
      }
    })
    .on('mouseout', (d) => {
      // on mouse out event
      dataPoints.select(`#dataPoint__${d.country}`)
        .transition()
        .duration(250)
        .attr('r', 10);

      
      toolTip.selectAll('rect')
        .transition()
        .duration(250)
        .attr('style', 'opacity: 0');

      toolTip.selectAll('text')
        .transition()
        .duration(250)
        .attr('style', 'opacity: 0');

      toolTip.transition()
        .delay(250)
        .remove();
    });

  // year slider event
  const YearEvent = d3.select('#year__range');

  YearEvent.on('input', (e) => {
    year = parseFloat(yearRange.value);
    yearText.innerHTML = `Year ${yearRange.value}`;

    dataPoints.selectAll('circle')
      .data(dataSet.filter(point => point.year === year))
      .merge(dataPoints)
      .attr('id', (d) => `dataPoint__${d.country}`)
      .transition()
      .duration(500)
      .attr('cy', (d) => {
        return scaleY(d.employment || minY)
      })
      .attr('cx', (d) => {
        return scaleX(d.workHours || minX)
      })
      .attr('r', 10)
      .attr('stroke', 'black')
      .attr('fill', (d) => {
        const scale = Math.round(scaleColor(d.lifeExp));
        return `rgb(${scale || 0}, ${(85 + scale) || 0}, ${(85 + scale) || 0})`;
      })
      .attr('style', d => `opacity: ${d.employment && d.workHours ? 1 : 0}`)
  });
});

const init = () => {
  yearRange = document.querySelector('#year__range');
  yearText = document.querySelector('#year__value');
  yearText.innerHTML = `Year ${yearRange.value}` || 'Year 2010';
  year = parseFloat(yearRange.value) || 2010;
}

window.onload = init;
