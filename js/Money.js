import * as THREE from "three";

import {
    FontLoader
} from "three/examples/jsm/loaders/FontLoader.js"; // pr charger le fichier json de la typo
import {
    TextGeometry
} from "three/addons/geometries/TextGeometry.js"; // pr faire le text en 3D

export default class Money {
    constructor(scene) {
        this.scene = scene;

        this.dollars = [];
        this.dollarsSpeed = [];
        this.dollarsSize = [0.5, 1, 1.5, 2, 2.5]

        this.density = 120;
        this.initPos = 23 + Math.random() * 20;

        this.fontsPath = "./typos/"
        this.fontsSrc = [
            "fraunces.json",
            "young.json"
        ]
        this.colors = [
            0x47FF64,//green

            // 0xffed24,//yellow
            // 0xA4A4A4,
            // 0xFF2DF7, //pink
            // 0xFF2D2D, //red
            // 0x2D42FF, //blue
        ]

        this.signs = [
            '$',
            '€',
            '£',
        ]

        this.specularColors = [
            0x47FF64, //green
            0xFF2DF7, //pink
        ]
    }


    // loadFonts() {
    //     const arr = [];

    //     for (let i = 0; i < this.fontsSrc.length; i++) {

    //         const font = this.loadFont(this.fontsPath + this.fontsSrc[i]);
    //         arr.push(font)

    //     }

    //     return Promise.all(arr);
    // }

    // loadFont(src) {
    //     const loader = new FontLoader();
    //     return new Promise((resolve, reject) => {
    //         loader.load(src, (font) => {
    //             console.log(font)
    //             resolve(font);
    //         });
    //     });

    // }

    loadFont() {
        const loader = new FontLoader();
        return new Promise((resolve, reject)=> {
            loader.load("./fraunces.json",(font)=>{
                resolve(font)
        });
     }); 
    }

    getRandom(array) {
        const randIndex = Math.floor(Math.random() * array.length)
        return array[randIndex];
    }

    addDollar(font, i, zPosCam) {
        // const font = this.getRandom(fonts);
        // console.log(font);

        const geometry = new TextGeometry(this.getRandom(this.signs), {
            font: font,
            size: this.getRandom(this.dollarsSize),
            height: 0.1,
            curveSegments: 12, // Adjust this value
            bevelEnabled: false, // Disable bevel for now
            // Ok de mettre seulement les 3 premiers params
        });

        // const material = new THREE.MeshPhysicalMaterial({
        //     color: this.getRandom(this.colors),
        //     shininess: 0,
        //     roughness: 0.3,
        //     metalness: 1.5,
        // });

        let material;

        if(Math.random() > 0.5){
            material = new THREE.MeshPhysicalMaterial({
                color: this.getRandom(this.colors),
                shininess: 1,
                roughness: 0.3,
                metalness: 1,
            });
        }else{
            material = new THREE.MeshPhongMaterial({
                color: this.getRandom(this.colors),
                shininess: 1,
                roughness: 0.3,
                metalness: 1,
            });
        }

        const text = new THREE.Mesh(geometry, material);

        text.castShadow = true;
        text.receiveShadow = true;

        geometry.computeBoundingBox();
        const boundingBox = geometry.boundingBox;
        const centerOffset = new THREE.Vector3();
        centerOffset.subVectors(boundingBox.max, boundingBox.min).multiplyScalar(-0.5);
    
        // Déplacez la géométrie pour centrer le point d'ancrage
        geometry.translate(centerOffset.x, centerOffset.y, centerOffset.z);

        text.position.y = this.initPos;
        text.position.x = -40 + Math.random() * 80;
        text.position.z = zPosCam - Math.random() * 20

        this.dollars.push(text);

        this.dollarsSpeed.push(0.01 + Math.random()/50); 

        this.scene.add(text);

    }



    makeItRain() {
        for(let i = 0; i < this.dollars.length; i++){
            this.dollars[i].position.y -= this.dollarsSpeed[i];
            this.dollars[i].rotation.y -= Math.random()/50;

            if(this.dollars[i].position.y <= -20){
                this.dollars[i].position.y = this.initPos;
            }
        }

        // console.log(this.dollars[0].position.y);

        // if(this.dollars[i].position.y)
    }

}