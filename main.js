var utils = require("./utils");


function generatePositionHook(scene, doges){
    var addPositions = (positions) => {
        // Gets the positions as serialized json, adds them to the scene

        JSON.parse(positions).forEach((pos) => {
            var dog = utils.dogePic(pos[0], pos[1], pos[2]);
            scene.add(dog);
            doges.push(dog);
        });
    };
    return addPositions;
};


function genUpdateDoges(doges, camera){
    var updateDoges = () => {
        doges.forEach((doge) => { doge.lookAt(camera.position); });
    };
    return updateDoges;
};


function main(){
    var fundaments = utils.init();
    var doges = [];

    // Check that pic gets added to scene
    fundaments.scene.add(utils.dogePic(0, 0, 1));

    var hooks = [fundaments.controls.update, genUpdateDoges(doges, fundaments.camera)];

    var animate = utils.getAnimate(fundaments, hooks);
    animate();

    // Get positions and add them to the scene
    var addPositions = generatePositionHook(fundaments.scene, doges);
    utils.requestPositions("http://localhost:5000/points", addPositions);
};


main();
