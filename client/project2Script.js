/* global d3 */
/* global topojson */

// Width and height
const width = 960;
const height = 600;

const svg = d3.select('div.svg__graph').append('svg')
  .attr('width', width)
  .attr('height', height)
  .style('padding', '30px 30px 30px 60px')
  .style('background-color', 'white');

const objectDataSet = {};
let legendText = 'Poverty Rate';
let toolTip;
let scaleColor;

// Define path generator
const path = d3.geoPath();

const stateIds = {
  '01': 'AL',
  '02': 'AK',
  '04': 'AZ',
  '05': 'AR',
  '06': 'CA',
  '08': 'CO',
  '09': 'CT',
  10: 'DE',
  11: 'DC',
  12: 'FL',
  13: 'GA',
  15: 'HI',
  16: 'ID',
  17: 'IL',
  18: 'IN',
  19: 'IA',
  20: 'KS',
  21: 'KY',
  22: 'LA',
  23: 'ME',
  24: 'MD',
  25: 'MA',
  26: 'MI',
  27: 'MN',
  28: 'MS',
  29: 'MO',
  30: 'MT',
  31: 'NE',
  32: 'NV',
  33: 'NH',
  34: 'NJ',
  35: 'NM',
  36: 'NY',
  37: 'NC',
  38: 'ND',
  39: 'OH',
  40: 'OK',
  41: 'OR',
  42: 'PA',
  44: 'RI',
  45: 'SC',
  46: 'SD',
  47: 'TN',
  48: 'TX',
  49: 'UT',
  50: 'VT',
  51: 'VA',
  53: 'WA',
  54: 'WV',
  55: 'WI',
  56: 'WY',
};
let states;

// called by event listeners set up by setEvents
const updateVis = (type) => {
  let value = 'PovertyRate';
  let legendX = width - 150;
  legendText = 'Poverty Rate';

  if (type === 'childProverty') {
    value = 'ChildProvertyRate';
    legendText = 'Child Proverty Rate';
    legendX = width - 175;
  } else if (type === 'unemployment') {
    value = 'UnemploymentRate';
    legendText = 'Unemployment Rate';
    legendX = width - 175;
  }

  states.transition()
    .duration(400)
    .delay((d, i) => i * 10)
    .attr('fill', (d) => {
      // skip DC
      if (stateIds[d.id] === 'DC') return 'rgb(0,0,0)';

      const data = objectDataSet[stateIds[d.id]];
      const scale = Math.round(scaleColor(parseFloat(data[value])));

      return `rgb(${(100 + scale) || 0}, ${scale || 0}, ${scale || 0})`;
    });

  // update legend text
  svg.select('#legendText')
    .attr('x', legendX)
    .text(() => legendText);
};

// set up map with id's attached to states
const setupMap = (us) => {
  states = svg.append('g')
    .attr('class', 'states')
    .selectAll('path')
    .data(topojson.feature(us, us.objects.states).features)
    .enter()
    .append('g');

  // add class to states
  states.attr('class', 'state');
  states.attr('fill', 'rgb(255,255,255)');

  // state paths
  states.append('path')
    .attr('d', path);

  // state border lines
  svg.append('path')
    .attr('class', 'state-borders')
    .attr('d', path(topojson.mesh(us, us.objects.states, (a, b) => a !== b)));

  // add id to states
  /*
    states.append('text')
      .text((d) => stateIds[d.id] || d.id)
      .attr('x', (d) => path.centroid(d)[0] || 0)
      .attr('y', (d) => path.centroid(d)[1] || 0);
  */

  // add id with state abbr
  states.attr('id', d => stateIds[d.id] || d.id);
};

const setupLegend = () => {
  // Legend
  const legend = svg.append('g');
  const gradient = legend.append('defs').append('linearGradient');
  gradient.attr('y1', '0%')
    .attr('id', 'gradient')
    .attr('x1', '0%')
    .attr('y2', '0%')
    .attr('x2', '100%');
  gradient.append('stop')
    .attr('offset', '0%')
    .attr('style', 'stop-color:rgb(255, 175, 175);stop-opacity:1');
  gradient.append('stop')
    .attr('offset', '100%')
    .attr('style', 'stop-color:rgb(100, 0, 0);stop-opacity:1');

  legend.append('rect')
    .attr('y', 10)
    .attr('x', width - 180)
    .attr('height', 20)
    .attr('width', 140)
    .attr('stroke', 'black')
    .attr('fill', 'url(#gradient)');

  legend.append('text')
    .attr('y', 25)
    .attr('x', width - 210)
    .text(() => '0%');

  legend.append('text')
    .attr('y', 25)
    .attr('x', width - 30)
    .text(() => '30%');

  legend.append('text')
    .attr('id', 'legendText')
    .attr('y', 0)
    .attr('x', width - 150)
    .text(() => legendText);
};

const setupTooltips = () => {
  states.on('mouseover', (d) => {
    // grab state data from csv using stateIds
    const data = objectDataSet[stateIds[d.id]];
    const keys = Object.keys(data);
    const pos = { x: path.bounds(d)[1][0] || 0, y: path.bounds(d)[0][1] || 0 };

    // check if pos.x is to far to the right
    if (pos.x > 730) {
      pos.x = path.bounds(d)[0][0] - 200;
    }

    toolTip = svg.append('g');

    toolTip.append('rect')
      .attr('x', () => pos.x)
      .attr('y', () => pos.y)
      .attr('height', 110)
      .attr('width', 200)
      .attr('fill', '#F0F0F0')
      .attr('stroke', '#000')
      .attr('style', 'opacity: 0')
      .transition()
      .duration(400)
      .attr('style', 'opacity: 1');

    toolTip.selectAll('text')
      .data(keys)
      .enter()
      .append('text')
      .attr('x', () => pos.x + 10)
      .attr('y', (key, i) => pos.y + 20 + (i * 20))
      .text(key => `${key}: ${data[key]}`)
      .attr('style', 'opacity: 0')
      .transition()
      .duration(400)
      .attr('style', 'opacity: 1');
  });

  states.on('mouseout', () => {
    toolTip.selectAll('rect')
      .transition()
      .duration(400)
      .attr('style', 'opacity: 0');

    toolTip.selectAll('text')
      .transition()
      .duration(250)
      .attr('style', 'opacity: 0');

    toolTip.transition()
      .delay(250)
      .remove();
  });
};

const setEvents = () => {
  d3.select('#povertyButton')
    .on('change', () => updateVis());

  d3.select('#childProvertyButton')
    .on('change', () => updateVis('childProverty'));

  d3.select('#unemploymentButton')
    .on('change', () => updateVis('unemployment'));
};

const visualize = (error, us, data) => {
  if (error) {
    console.log('Error Occured', error);
    return;
  }

  // convert data into a object instead of an array
  // personally find it easier this way
  for (let i = 0; i < data.length; i++) {
    const d = data[i];

    objectDataSet[d.Abbr] = d;
  }

  // min color rgb(255, 150, 150)
  // max color rgb(100, 0, 0)
  // for now lock data domain to 0 ~ 30
  scaleColor = d3.scaleLinear()
    .domain([0, 30])
    .range([155, 0]);

  setupMap(us);
  setupLegend();
  setupTooltips(data);
  setEvents();

  updateVis();
};

const init = () => {
  // https://d3js.org/us-10m.v1.json - paths for states
  d3.queue()
    .defer(d3.json, 'https://d3js.org/us-10m.v1.json')
    .defer(d3.csv, '/assets/p2Data.csv')
    .await(visualize);
};

window.onload = init;
