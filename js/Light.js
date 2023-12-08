import * as THREE from 'three';

export default class Light {
    constructor(scene){
        this.scene = scene;
    }

    createLight(){
        //créer une ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 3);
        this.scene.add(ambientLight)

        //créer une spotlight
        // this.spotlight = new THREE.SpotLight(0xffffff, 100)
        // this.spotlight.position.set(0,5, 30);
        // this.scene.add(this.spotlight);

        //gérer les ombres
        // this.spotlight.castShadow = true;
        // this.spotlight.shadow.mapSize.width = 4096
        // this.spotlight.shadow.mapSize.height = 4096

        //créer un helper pour la spotlight
        // this.spotlightHelper = new THREE.SpotLightHelper(this.spotlight)
        // this.scene.add(this.spotlightHelper)
    }

    update() {
        // this.spotlightHelper.update();
    }

    gui(gui) {
        // //controle intensiter lumiere
        // const folder = gui.addFolder("Light");
        // folder.add(this.spotlight, "intensity", 0, 100,0.01)
        // //controle l'angle du spotlight
        // folder.add(this.spotlight, "angle", 0, Math.PI / 3, 0.01);
        // //contole des positions
        // folder.add(this.spotlight.position, "x", -10, 10, 0.01)
        // folder.add(this.spotlight.position, "y", -10, 10, 0.01)
        // folder.add(this.spotlight.position, "z", -10, 10, 0.01)
        // //controle de la pénombre
        // folder.add(this.spotlight, "penumbra", 0, 1, 0.01);
        // //controle de la distance
        // folder.add(this.spotlight, "distance", 0, 100, 0.01);
    }
}