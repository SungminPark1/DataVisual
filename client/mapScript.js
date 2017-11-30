/* global d3 */
/* global topojson */

// Width and height
const width = 960;
const height = 600;

// return word with space infront of capital letters TotalStudent -> Total Student
const addSpace = str => str.replace(/([A-Z])/g, ' $1').trim();

// return number with commas
const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const svg = d3.select('div.svg__graph').append('svg')
  .attr('width', width)
  .attr('height', height)
  .style('padding', '30px 30px 30px 60px')
  .style('background-color', 'white');

let dataSet = {};
const objectDataSet = {};
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

const visMap = (dataValue) => {
  states.transition()
    .duration(400)
    .delay((d, i) => i * 10)
    .attr('fill', (d) => {
      // skip DC
      if (stateIds[d.id] === 'DC') return 'rgb(0,0,0)';

      // find data using state's id
      const data = objectDataSet[stateIds[d.id]];
      const scale = Math.round(scaleColor(parseFloat(data[dataValue])));

      return `rgb(${(100 + scale) || 0}, ${scale || 0}, ${scale || 0})`;
    });
};

const visLegend = (text, min, max, gradientType = 'gradientType1') => {
  // update legend
  svg.select('#legendText')
    .attr('x', text.x)
    .text(text.text);

  svg.select('#legendMin')
    .attr('x', min.x)
    .text(min.min);

  svg.select('#legendMax')
    .text(max);

  svg.select('#legendGradient').attr('fill', `url(#${gradientType}`);
};

const visPoverty = () => {
  // set the gradient scale
  const max = Math.ceil(d3.max(dataSet, d => parseFloat(d.PovertyRate)));
  const min = Math.floor(d3.min(dataSet, d => parseFloat(d.PovertyRate)));
  scaleColor = d3.scaleLinear()
    .domain([min, max])
    .range([155, 0]);

  // update and transition the new values
  const dataValue = 'PovertyRate';
  visMap(dataValue);

  // update legend
  const text = {
    text: 'Poverty Rate',
    x: width - 170,
  };
  visLegend(text, { min: `${min}%`, x: width - 230 }, `${max}%`);
};

const visChildPoverty = () => {
  // set the gradient scale
  const max = Math.ceil(d3.max(dataSet, d => parseFloat(d.ChildProvertyRate)));
  const min = Math.floor(d3.min(dataSet, d => parseFloat(d.ChildProvertyRate)));
  scaleColor = d3.scaleLinear()
    .domain([min, max])
    .range([155, 0]);

  // update and transition the new values
  const dataValue = 'ChildProvertyRate';
  visMap(dataValue);

  // update legend
  const text = {
    text: 'Child Poverty Rate',
    x: width - 195,
  };
  visLegend(text, { min: `${min}%`, x: width - 240 }, `${max}%`);
};

const visHighSchoolGrad = () => {
  // set the gradient scale
  const max = Math.ceil(d3.max(dataSet, d => parseFloat(d.HighSchoolGradRate)));
  const min = Math.floor(d3.min(dataSet, d => parseFloat(d.HighSchoolGradRate)));
  scaleColor = d3.scaleLinear()
    .domain([min, max])
    .range([0, 155]);

  // update and transition the new values
  const dataValue = 'HighSchoolGradRate';
  visMap(dataValue);

  // update legend
  const legend = {
    text: {
      text: 'High School Graduate Rate',
      x: width - 210,
    },
    min: {
      min: `${min}%`,
      x: width - 240,
    },
    max: `${max}%`,
    type: 'gradientType2',
  };
  visLegend(legend.text, legend.min, legend.max, legend.type);
};

const visHigherEdu = () => {
  // set the gradient scale
  const max = Math.ceil(d3.max(dataSet, d => parseFloat(d.HigherEducationRate)));
  const min = Math.floor(d3.min(dataSet, d => parseFloat(d.HigherEducationRate)));

  scaleColor = d3.scaleLinear()
    .domain([min, max])
    .range([0, 155]);

  // update and transition the new values
  const dataValue = 'HigherEducationRate';
  visMap(dataValue);

  // update legend
  const legend = {
    text: {
      text: 'Higher Education Rate',
      x: width - 205,
    },
    min: {
      min: `${min}%`,
      x: width - 240,
    },
    max: `${max}%`,
    type: 'gradientType2',
  };
  visLegend(legend.text, legend.min, legend.max, legend.type);
};

const visExpendPerStudent = () => {
  // nearest 100
  const max = Math.ceil(d3.max(dataSet, d => d.ExpendPerStudent) / 100) * 100;
  const min = Math.floor(d3.min(dataSet, d => d.ExpendPerStudent) / 100) * 100;

  scaleColor = d3.scaleLinear()
    .domain([min, max])
    .range([0, 155]);

  // update and transition the new values
  const dataValue = 'ExpendPerStudent';
  visMap(dataValue);

  // update legend
  const legend = {
    text: {
      text: 'Expenditure Per Student',
      x: width - 210,
    },
    min: {
      min: `$${numberWithCommas(min)}`,
      x: width - 255,
    },
    max: `$${numberWithCommas(max)}`,
    type: 'gradientType2',
  };
  visLegend(legend.text, legend.min, legend.max, legend.type);
};

// called by event listeners set up by setEvents
const updateVis = (value) => {
  if (value === 'povertyRate') {
    visPoverty();
  } else if (value === 'childProverty') {
    visChildPoverty();
  } else if (value === 'highSchoolGrad') {
    visHighSchoolGrad();
  } else if (value === 'higherEdu') {
    visHigherEdu();
  } else if (value === 'expendPerStudent') {
    visExpendPerStudent();
  }
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
  const gradientType1 = legend.append('defs').append('linearGradient');
  gradientType1.attr('id', 'gradientType1')
    .attr('y1', '0%')
    .attr('x1', '0%')
    .attr('y2', '0%')
    .attr('x2', '100%');
  gradientType1.append('stop')
    .attr('offset', '0%')
    .attr('style', 'stop-color:rgb(255, 175, 175);stop-opacity:1');
  gradientType1.append('stop')
    .attr('offset', '100%')
    .attr('style', 'stop-color:rgb(100, 0, 0);stop-opacity:1');

  const gradientType2 = legend.append('defs').append('linearGradient');
  gradientType2.attr('id', 'gradientType2')
    .attr('y1', '0%')
    .attr('x1', '0%')
    .attr('y2', '0%')
    .attr('x2', '100%');
  gradientType2.append('stop')
    .attr('offset', '0%')
    .attr('style', 'stop-color:rgb(100, 0, 0);stop-opacity:1');
  gradientType2.append('stop')
    .attr('offset', '100%')
    .attr('style', 'stop-color:rgb(255, 175, 175);stop-opacity:1');

  legend.append('rect')
    .attr('id', 'legendGradient')
    .attr('y', 10)
    .attr('x', width - 200)
    .attr('height', 20)
    .attr('width', 140)
    .attr('stroke', 'black')
    .attr('fill', 'url(#gradientType1)');

  legend.append('text')
    .attr('id', 'legendMin')
    .attr('y', 25)
    .attr('x', width - 230)
    .text('0%');

  legend.append('text')
    .attr('id', 'legendMax')
    .attr('y', 25)
    .attr('x', width - 50)
    .text('30%');

  legend.append('text')
    .attr('id', 'legendText')
    .attr('y', 0)
    .attr('x', width - 170)
    .text(legendText);
};

const setupTooltips = () => {
  states.on('mouseover', (d) => {
    // skip DC
    if (stateIds[d.id] === 'DC') return;

    // grab state data from csv using stateIds
    const data = objectDataSet[stateIds[d.id]];
    // filter out Abbr and UnemploymentRate
    const keys = Object.keys(data).filter(key => key !== 'Abbr' && key !== 'UnemploymentRate');
    const pos = { x: path.bounds(d)[1][0] || 0, y: path.bounds(d)[0][1] || 0 };

    // check if pos.x is to far to the right
    if (pos.x > 700) {
      pos.x = path.bounds(d)[0][0] - 250;
    }

    if (pos.y > 400) {
      pos.y = 400;
    }

    toolTip = svg.append('g');

    toolTip.append('rect')
      .attr('x', () => pos.x)
      .attr('y', () => pos.y)
      .attr('height', 220)
      .attr('width', 250)
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
      .attr('y', (key, i) => pos.y + 25 + (i * 20))
      .text((key, i) => {
        let dataValue = data[key] || 'N/A';

        if (i > 4) {
          dataValue = numberWithCommas(parseFloat(data[key]));
        }

        // add dollar symbol
        if (i > 7) {
          dataValue = `$${dataValue}`;
        }

        return `${addSpace(key)}: ${dataValue}`;
      })
      .attr('style', 'opacity: 0')
      .transition()
      .duration(400)
      .attr('style', 'opacity: 1');
  });

  states.on('mouseout', (d) => {
    // skip DC
    if (stateIds[d.id] === 'DC') return;

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
    .on('change', () => updateVis('povertyRate'));

  d3.select('#childProvertyButton')
    .on('change', () => updateVis('childProverty'));

  d3.select('#highSchoolGradButton')
    .on('change', () => updateVis('highSchoolGrad'));

  d3.select('#higherEduButton')
    .on('change', () => updateVis('higherEdu'));

  d3.select('#expendPerStudentButton')
    .on('change', () => updateVis('expendPerStudent'));
};

const visualize = (error, us, data) => {
  if (error) {
    console.log('Error Occured', error);
    return;
  }

  dataSet = data;
  // convert data into a object instead of an array
  // personally find it easier this way
  for (let i = 0; i < data.length; i++) {
    const d = data[i];

    d.ExpendPerStudent = Math.round(parseFloat(d.ExpendForEduc) / parseFloat(d.TotalStudents) * 100) / 100;

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

  updateVis('povertyRate');
};

const init = () => {
  // https://d3js.org/us-10m.v1.json - paths for states
  d3.queue()
    .defer(d3.json, 'https://d3js.org/us-10m.v1.json')
    .defer(d3.csv, '/assets/data.csv')
    .await(visualize);
};

window.onload = init;
