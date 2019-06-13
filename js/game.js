var fbRef = new Firebase("https://gameforgamer69.firebaseio.com/data");

var otherPlayers = {};

var playerID;
var player;

function loadGame() {
    // load the enviroment
    loadEnvironment1();
    loadEnvironment2();
    loadEnvironment3();
    loadEnvironment4();
    // load the player
    initMainPlayer();

    listenToOtherPlayers();

    window.onunload = function() {
        fbRef.child( "Players" ).child( playerID ).remove();
    }

    window.onbeforeunload = function() {
        fbRef.child( "Players" ).child( playerID ).remove();
    }
}

function listenToPlayer( playerData ) {
    if ( playerData.val() ) {
        otherPlayers[playerData.key()].setOrientation( playerData.val().orientation.position, playerData.val().orientation.rotation );
    }
}

function listenToOtherPlayers() {
    // when a player is added, do something
    fbRef.child( "Players" ).on( "child_added", function( playerData ) {
        if ( playerData.val() ) {
            if ( playerID != playerData.key() && !otherPlayers[playerData.key()] ) {
                otherPlayers[playerData.key()] = new Player( playerData.key() );
                otherPlayers[playerData.key()].init();
                fbRef.child( "Players" ).child( playerData.key() ).on( "value", listenToPlayer );
            }
        }
    })
    // when a player is removed, do something

    fbRef.child( "Players" ).on( "child_removed", function( playerData ) {
        if ( playerData.val() ) {
            fbRef.child( "Players" ).child( playerData.key())
        }
    });
}



function initMainPlayer() {

    playerID = fbRef.child( "Players" ).push().key();

    fbRef.child( "Players" ).child( playerID ).child("orientation").set({
        position: {x: 0, y:0, z:0},
        rotation: {x: 0, y:0, z:0}
    });

    player = new Player( playerID );
    player.isMainPlayer = true;
    player.init();
}

// spawn sphere
function loadEnvironment2() {
    var sphere_geometry = new THREE.SphereGeometry( 1 );
    var sphere_material = new THREE.MeshNormalMaterial();
    var sphere = new THREE.Mesh( sphere_geometry, sphere_material );

    scene.add( sphere );
}

// giant sphere
function loadEnvironment1() {
    var sphere_geometry = new THREE.SphereGeometry( 5 );
    var sphere_material = new THREE.MeshNormalMaterial();
    var sphere = new THREE.Mesh( sphere_geometry, sphere_material );

    sphere.position.x = 2;
    sphere.position.y = 4;
    sphere.position.z = 100;

    scene.add( sphere );
}

// red wall
function loadEnvironment3() {
    var geometry = new THREE.BoxGeometry(10,5,1);
    var material = new THREE.MeshBasicMaterial({color: 0xff0000});
    var cube = new THREE.Mesh(geometry, material);

    //cube.add( new THREEFIELD.Collider( cube ) );
    //gyroscope

    cube.position.x = 30;
    cube.position.y = 2;
    cube.position.z = 30;

    scene.add( cube );
}

// bleron ball
function loadEnvironment4() {
    var texture = new THREE.TextureLoader().load( "face.png" );

    var geometry = new THREE.SphereGeometry(10);
    var material = new THREE.MeshBasicMaterial({map: texture});
    var sphere = new THREE.Mesh(geometry, material);

    sphere.position.x = -30;
    sphere.position.y = 2;
    sphere.position.z = -30;

    scene.add( sphere );
}

