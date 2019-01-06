var THREE = window.THREE = require("three");
require("three/examples/js/controls/OrbitControls");

var camera, scene, renderer


// Module constants
const loader = new THREE.TextureLoader();


// Good for debugging purposes
export function dogePic(x, y, z) {
    var geometry = new THREE.PlaneGeometry( 0.3, 0.3, 0.3, 0.3 );
    var material = new THREE.MeshLambertMaterial( { map: loader.load("https://yt3.ggpht.com/a-/AN66SAw_M_11Alp1TIDompdqcTC94F-T-BUKgNgSFw=s900-mo-c-c0xffffffff-rj-k-no") } );
    var plane = new THREE.Mesh( geometry, material);
    plane.position.set( x, y, z );
    return plane
}


// Main workhorse of this project
export function picture(url, x, y, z){
    var geometry = new THREE.PlaneGeometry( 0.1, 0.1, 0.1, 0.1 );
    var material = new THREE.MeshBasicMaterial( { map: loader.load(url) } );
    var plane = new THREE.Mesh( geometry, material);
    plane.position.set( x, y, z );
    return plane
}


// Get data from backend
export function requestPositions(url, callback){
    // Gets the positions from the backend api
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        console.log(this.status);
        if (this.readyState == 4 && this.status == 200) {
            //console.log(this.responseText);
            callback(this.responseText);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
};


export function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(0, 0, 5);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // Add controls
    var controls = new THREE.OrbitControls( camera );
    controls.update();

    return { camera: camera, scene: scene, renderer: renderer, controls: controls };
};


export function getAnimate(fundaments, hooks){
    var animate = () => {
        requestAnimationFrame( animate );
        hooks.forEach((hook) => { hook(); });
        fundaments.renderer.render( fundaments.scene, fundaments.camera );
    };
    return animate;
};


