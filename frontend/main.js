var utils = require("./utils");


function renderPositionHook(scene, pics, baseUrl){
    var addPositions = (positions) => {
        // Gets the positions and URLs as serialized json, adds them to the scene

        JSON.parse(positions).forEach((urlAndPos) => {
            var urlEnd = urlAndPos[0];
            var pos = urlAndPos[1];
            var url = baseUrl + urlEnd.substring(2);
            var pic = utils.picture(url, pos[0], pos[1], pos[2]);
            scene.add(pic);
            pics.push(pic);
            console.log(pic);
        });
        console.log("Pics loaded");
    };
    return addPositions;
};


function genUpdateDoges(pics, camera){
    var updateDoges = () => {
        pics.forEach((doge) => { doge.lookAt(camera.position); });
    };
    return updateDoges;
};


function main(){
    var fundaments = utils.init();
    var pics = [];

    var hooks = [fundaments.controls.update, genUpdateDoges(pics, fundaments.camera)];

    var animate = utils.getAnimate(fundaments, hooks);
    animate();

    // Get positions and add them to the scene
    url = "http://localhost:5000/"
    var addPositions = renderPositionHook(fundaments.scene, pics, url);
    utils.requestPositions(url, addPositions);
};


main();
