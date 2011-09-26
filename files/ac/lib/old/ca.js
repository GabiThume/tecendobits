var container;
var camera, scene, renderer;
var scaleCell = 10;
var sizeGrid = 50;

function CA (sizeCells, sizeCell, maxGenerations, rules) {
    this.cells = new Array(sizeCells);
    this.sizeCell = sizeCell;
    this.maxGenerations = maxGenerations;
    this.randomRules();
    this.restart();
}

CA.prototype.randomRules = function () {
    this.rules = new Array(8);
    for (var i=0; i<8; i++)
        this.rules[i] = Math.round(Math.random()*2);
};

CA.prototype.applyRules = function (ns) {
    if ((ns[0] == 0) && (ns[1] == 0) && (ns[2] == 0)) return this.rules[0];
    if ((ns[0] == 0) && (ns[1] == 0) && (ns[2] == 1)) return this.rules[1];
    if ((ns[0] == 0) && (ns[1] == 1) && (ns[2] == 0)) return this.rules[2];
    if ((ns[0] == 0) && (ns[1] == 1) && (ns[2] == 1)) return this.rules[3];
    if ((ns[0] == 1) && (ns[1] == 0) && (ns[2] == 0)) return this.rules[4];
    if ((ns[0] == 1) && (ns[1] == 0) && (ns[2] == 1)) return this.rules[5];
    if ((ns[0] == 1) && (ns[1] == 1) && (ns[2] == 0)) return this.rules[6];
    if ((ns[0] == 1) && (ns[1] == 1) && (ns[2] == 1)) return this.rules[7];
};

CA.prototype.generate = function () {
    var nextGen = new Array(this.cells.length);

    for (var i=1; i<nextGen.length-1; i++) {
        var left = this.cells[i-1];
        var current = this.cells[i];
        var right = this.cells[i+1];
        nextGen[i] = this.applyRules([left, current, right]);
    }
    this.cells = nextGen.slice();
    this.generation++;
};

CA.prototype.render = function () {
    var geometry = new THREE.Cube( scaleCell, scaleCell, scaleCell );
    var material = new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading } );

    for (var i=0; i<this.cells.length; i++) {
        if (this.cells[i] == 1) {
            var cube = new THREE.Mesh( geometry, material );
            
            var z = i;
            var x = this.generation;
            cube.overdraw = true;
            cube.position.x = x * scaleCell + scaleCell/2 - (sizeGrid/2)*scaleCell;
            cube.position.z = z * scaleCell + scaleCell/2 - (sizeGrid/2)*scaleCell;
            cube.position.y = ( cube.scale.y * scaleCell ) / 2;
            
            scene.addObject(cube);
        }
    }
};

CA.prototype.restart = function () {
    for (var i=0; i<this.cells.length; i++) {
        this.cells[i] = 0;
    }
    this.cells[this.cells.length/2] = 1;
    this.generation = 0;
};

CA.prototype.finished = function () {
    if (this.generation > this.maxGenerations) {
        return true;
    } else {
        return false;
    }
};
var ca = new CA(50, 10, 25);

init();
animate();

function restart() {
    scene = new THREE.Scene();

    // Grid

    var geometry = new THREE.Geometry();
    geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( -((sizeGrid/2)*scaleCell), 0, 0 ) ) );
    geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( ((sizeGrid/2)*scaleCell), 0, 0 ) ) );

    for ( var i = 0; i <= sizeGrid; i ++ ) {

	var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } ) );
	line.position.z = ( i * scaleCell ) - ((sizeGrid/2)*scaleCell);
	scene.addObject( line );

	var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } ) );
	line.position.x = ( i * scaleCell ) - ((sizeGrid/2)*scaleCell);
	line.rotation.y = 90 * Math.PI / 180;
	scene.addObject( line );

    }

    // Lights

    var ambientLight = new THREE.AmbientLight( Math.random() * 0x10 );
    scene.addLight( ambientLight );

    var directionalLight = new THREE.DirectionalLight( Math.random() * 0xffffff );
    directionalLight.position.x = Math.random() - 0.5;
    directionalLight.position.y = Math.random() - 0.5;
    directionalLight.position.z = Math.random() - 0.5;
    directionalLight.position.normalize();
    scene.addLight( directionalLight );

    var directionalLight = new THREE.DirectionalLight( Math.random() * 0xffffff );
    directionalLight.position.x = Math.random() - 0.5;
    directionalLight.position.y = Math.random() - 0.5;
    directionalLight.position.z = Math.random() - 0.5;
    directionalLight.position.normalize();
    scene.addLight( directionalLight );
}

function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    var info = document.createElement( 'div' );
    info.style.position = 'absolute';
    info.style.top = '10px';
    info.style.width = '100%';
    info.style.textAlign = 'center';
    info.innerHTML = '<a href="http://github.com/mrdoob/three.js" target="_blank">three.js</a> - orthographic view';
    container.appendChild( info );

    camera = new THREE.Camera( 400, window.innerWidth / window.innerHeight, - 1000, 1000 );
    camera.projectionMatrix = THREE.Matrix4.makeOrtho( window.innerWidth / -2, 
                                                       window.innerWidth /  2, 
                                                       window.innerHeight / 2, 
                                                       window.innerHeight / - 2, 
                                                       - 2000, 1000 );
    camera.position.x = 100;
    camera.position.y = 100;
    camera.position.z = 100;

    scene = new THREE.Scene();

    // Grid

    var geometry = new THREE.Geometry();
    geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( -((sizeGrid/2)*scaleCell), 0, 0 ) ) );
    geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( ((sizeGrid/2)*scaleCell), 0, 0 ) ) );

    for ( var i = 0; i <= sizeGrid; i ++ ) {

	var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } ) );
	line.position.z = ( i * scaleCell ) - ((sizeGrid/2)*scaleCell);
	scene.addObject( line );

	var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } ) );
	line.position.x = ( i * scaleCell ) - ((sizeGrid/2)*scaleCell);
	line.rotation.y = 90 * Math.PI / 180;
	scene.addObject( line );

    }

    // Lights

    var ambientLight = new THREE.AmbientLight( Math.random() * 0x10 );
    scene.addLight( ambientLight );

    var directionalLight = new THREE.DirectionalLight( Math.random() * 0xffffff );
    directionalLight.position.x = Math.random() - 0.5;
    directionalLight.position.y = Math.random() - 0.5;
    directionalLight.position.z = Math.random() - 0.5;
    directionalLight.position.normalize();
    scene.addLight( directionalLight );

    var directionalLight = new THREE.DirectionalLight( Math.random() * 0xffffff );
    directionalLight.position.x = Math.random() - 0.5;
    directionalLight.position.y = Math.random() - 0.5;
    directionalLight.position.z = Math.random() - 0.5;
    directionalLight.position.normalize();
    scene.addLight( directionalLight );

    renderer = new THREE.CanvasRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    container.appendChild( renderer.domElement );
}

function animate() {
    requestAnimationFrame( animate );

    render();
}


function render() {
    ca.render();
    ca.generate();
    if (ca.finished() === true) {
        restart();
        ca.randomRules();
        ca.restart();
    }
    
//    var timer = new Date().getTime() * 0.0001;
//    camera.position.x = Math.cos( timer ) * 200;
//    camera.position.z = Math.sin( timer ) * 200;

    renderer.render( scene, camera );
}
