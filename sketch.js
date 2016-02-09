var ship = new CollectionNode('ship', {position: v2d(50,50)});
ship.add(new Sprite({position: v2d(10,10), size: [100, 100], map: 'img/ship'}));
ship.add(new Sprite({position: v2d(-10,10), size: [100, 100], map: 'img/ship_part1'}));
ship.add(new Sprite({position: v2d(20,10), size: [100, 100], map: 'img/ship_part2'}));

var camera = new CameraNode({name: 'camera_0', position: v2d(0,0)});
ship.add(camera);
ship.setCenter(v2d(10, 10)); // local center

camera.moveTo(v2d(10, 10)); // local center camera

//...

scene.setFullPageSize().init();
scene.registerViewport('ship', ship.getNode('camera_0'));
scene.setBackground({map: 'img/background'}).add('ship', ship);

function controller() {
    io.on('ACTION', function() {
        scene.updateViewport('ship');
        ship.rotateTo(io.getLastPositionPoint()).moveTo(io.getLastPositionPoint());
    });
}

function renderGame() {
//...
    scene.clear();
    scene.render(['background', 'ship']);
//...
}
