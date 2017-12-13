/*
  <button id="overviewControls">Overview</button>
  <button id="compareControls">Compare</button>
*/

const controlInit = () => {
  const overviewBtn = document.querySelector('#overviewBtn');
  const compareBtn = document.querySelector('#compareBtn');
  const overViewControls = document.querySelector('.overview__controls');
  const compareViewControls = document.querySelector('.compare_controls');
  const mapDiv = document.querySelector('.svg__map');
  const scatterDiv = document.querySelector('.svg__scatter');

  overviewBtn.style.backgroundColor = 'rgb(200, 200, 200)';

  // display map if not displayed and hide scatter if displayed
  overviewBtn.addEventListener('click', () => {
    // map related styles
    overviewBtn.style.backgroundColor = 'rgb(200, 200, 200)';
    mapDiv.style.opacity = 1;
    mapDiv.style.zIndex = 5;
    overViewControls.style.opacity = 1;
    overViewControls.style.zIndex = 5;

    // scatter related styles
    compareBtn.style.backgroundColor = 'rgb(255, 255, 255)';
    scatterDiv.style.opacity = 0;
    scatterDiv.style.zIndex = -1;
    compareViewControls.style.opacity = 0;
    compareViewControls.style.zIndex = -1;
  });

  compareBtn.addEventListener('click', () => {
    // map related styles
    overviewBtn.style.backgroundColor = 'rgb(255, 255, 255)';
    mapDiv.style.opacity = 0;
    mapDiv.style.zIndex = -1;
    overViewControls.style.opacity = 0;
    overViewControls.style.zIndex = -1;

    // scatter related styles
    compareBtn.style.backgroundColor = 'rgb(200, 200, 200)';
    scatterDiv.style.opacity = 1;
    scatterDiv.style.zIndex = 5;
    compareViewControls.style.opacity = 1;
    compareViewControls.style.zIndex = 5;
  });
};

window.addEventListener('load', controlInit);

