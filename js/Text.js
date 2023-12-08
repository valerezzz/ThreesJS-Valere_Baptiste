import * as THREE from 'three';
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

export default class Text {
    constructor(scene) {
        this.scene = scene;

        this.colors = [
            // 0x47FF64,//green
            0xFF2DF7,//pink
            0xFFF72D,//yellow
            0xFF2D2D,//red
            0x2D42FF,//blue
        ]

        this.specularColors = [
            0x47FF64,//green
            0xFF2DF7,//pink

        ]
    }

    loadFont() {
        const loader = new FontLoader();
        return new Promise((resolve, reject)=> {
            loader.load("./Franchise.json",(font)=>{
                resolve(font)
        });
     }); 
    }

    getRandom(array) {
        const randIndex = Math.floor(Math.random() * array.length)
        return array[randIndex];
    }   

    createText(_text, font) {

        const geometry = new TextGeometry(_text, {
        font: font,
        size: 2,
        height: 0.15,
        // curveSegments: 12,
        // bevelEnabled: true,
        // bevelThickness: 0.1,
        // bevelSize: 0.1,
        // bevelOffset: 0,
        // bevelSegments: 5,
        });

        geometry.computeBoundingBox();
        const boundingBox = geometry.boundingBox;
        const centerOffset = new THREE.Vector3();
        centerOffset.subVectors(boundingBox.max, boundingBox.min).multiplyScalar(-0.5);

    
        // Déplacez la géométrie pour centrer le point d'ancrage
        geometry.translate(centerOffset.x, centerOffset.y, centerOffset.z);

    
        this.material = new THREE.MeshPhongMaterial({
            color : this.getRandom(this.colors),
            shininess : 50,
            // emissive : this.getRandom(this.colors),
            // specular : this.getRandom(this.specularColors)
        });
        const text = new THREE.Mesh(geometry, this.material);
        // text.rotateX(-Math.PI / 2);
        text.geometry.translate( 0.5, 0, 0 );
        text.castShadow = true;
        text.receiveShadow = true;

        text.rotation.x = 0
        text.scale.set(0,0,0);
        this.scene.add(text);


        // const outlineMaterial = new THREE.MeshPhongMaterial({
        //     color: 0x00000 
        // })

        return text
        }
 



}