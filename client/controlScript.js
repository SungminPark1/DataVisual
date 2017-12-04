/* <button id="overviewControls">Overview</button>
    <button id="compareControls">Compare</button>
    */

    window.init = function() {
        var overviewBtn = document.querySelector("#overviewControls");
        var compareBtn = document.querySelector("#compareControls");
        var mapDiv = document.querySelector(".svg__map");
        var scatterDiv = document.querySelector(".svg__scatter")

        scatterDiv.style.opacity = 0;
        scatterDiv.style.zIndex = 0;
        //display map if not displayed and hide scatter if displayed
        overviewBtn.addEventListener("click",function(){
            console.log("overview clicked");
            mapDiv.style.opacity = 1;
            mapDiv.style.zIndex = 1;

            scatterDiv.style.opacity = 0;
            scatterDiv.style.zIndex = 0;
            /*mapDiv.style = {
                opacity: 1,
                zIndex: 1
            }
            scatterDiv.style = {
                opacity: 0,
                zIndex: 0
            }*/
        });

        compareBtn.addEventListener("click",function(){
            console.log("compare clicked");

            mapDiv.style.opacity = 0;
            mapDiv.style.zIndex = 0;

            scatterDiv.style.opacity = 1;
            scatterDiv.style.zIndex = 1;

           /* mapDiv.style = {
                opacity: 0,
                zIndex: 0
            }
            scatterDiv.style = {
                opacity: 1,
                zIndex: 1
            }*/
        });
    }();