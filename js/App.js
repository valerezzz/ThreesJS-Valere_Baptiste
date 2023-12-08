import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Shape from "./Shape.js";
import Light from "./Light.js";
import Text from "./Text.js";
import Chat from "./Chat.js";
import AudioDetector from "./AudioDetector.js";
import * as dat from "dat.gui";
import Restart from "./Restart.js"
import Money from "./Money.js"



import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { AfterimagePass } from 'three/addons/postprocessing/AfterimagePass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { Howl } from "howler";
import { lerp } from "./utils.js";



export default class App {
  constructor() {
    this.renderer = null;
    this.scene = null;
    this.camera = null;

    this.alreadySpeak = false;
    this.targetPositionCamera = 8;

    this.nQuestion = 0;

    this.isAmbientSoundPlaying = false;

    this.scaleFinish = false;
    this.posFinish = false;

    this.gui = new dat.GUI();

    this.chat = new Chat();

    this.chat.addEventListener("startSpeaking", this.startSpeakingHandler.bind(this))
    this.chat.addEventListener("word", this.addWord.bind(this));
    this.chat.addEventListener("speechEnd", this.speechEnd.bind(this));

    this.ambientSoundFile = "./sound/office-sound_1.mp3";

    //init audio detector
    this.audioDetector = new AudioDetector();
    this.audioDetector.addEventListener(
      "transcriptReady",
      this.onTextReceived.bind(this)
    );

    document.addEventListener("keydown", (e) => {
      if (e.key === " ") {
        this.audioDetector.stopRecording();
      }
    });


    
    this.restartClicked = false;

    this.initTHREE();
  }

  //faire un lerp

  startSpeakingHandler(data){
    console.log("start")

    this.phrase = data.choices[0].message.content
    this.words = this.phrase.split(" ");
    console.log(this.words);

    // this.targetPositionCamera = this.camera.position.z + (this.words.length * 0.2);

    if(this.alreadySpeak == false){
      this.targetPositionCamera = this.targetPositionCamera + this.words.length;
    }

    this.alreadySpeak = true;

    if (!this.isAmbientSoundPlaying) {
      // Si le son n'est pas déjà en train de jouer, commencez la lecture
      this.ambientSound.play();
      this.isAmbientSoundPlaying = true;

    }

  }

  async initTHREE() {
    //Create a scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("black");

    //Create a fog

    
    this.fogScale = 0
    this.fogScaleFinal = 0.03

    this.scene.fog = new THREE.FogExp2( 0x000000, this.fogScale);

    //Create a camerea
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );

    //Set camera position

    this.camera.position.z = 8;
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    //Create a clock
    this.clock = new THREE.Clock();

    //Create a renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true }); //pour enlver la pixelisation
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    document.body.appendChild(this.renderer.domElement);

    //create controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);


    this.text = new Text(this.scene);
    this.font = await this.text.loadFont();

    this.money  = new Money(this.scene);
    this.moneyFont = await this.money.loadFont();

    this.allmots = [];

    this.chat.call(this.chat.context);

    //Create a light
    this.light = new Light(this.scene);
    this.light.createLight();
    this.light.gui(this.gui);

    //Create sound
    this.ambientSound = new Howl({
      src: this.ambientSoundFile,
      loop: true,
      volume: 1.8,
    });



    this.composer = new EffectComposer( this.renderer );
        this.composer.addPass( new RenderPass( this.scene, this.camera ));

        this.afterimagePass = new AfterimagePass();
        this.composer.addPass( this.afterimagePass );

        const outputPass = new OutputPass();
        this.composer.addPass( outputPass );
    

    this.draw();
  }

  addWord(mot) {

    this.minX = -9;
    this.maxX = 9;

    this.minY = -7;
    this.maxY = 7;


    const motSansAccents = this.removeAccents(mot.toUpperCase());

    const text = this.text.createText(motSansAccents, this.font);
    const randomX = Math.random() * (this.maxX - this.minX) + this.minX;
    const randomY = Math.random() * (this.maxY - this.minY) + this.minY;

   
    text.position.x = randomX;
    text.position.y = randomY
    text.position.z = -120;
    this.positionWord+= 2;

    this.allmots.push(text);
    this.allmots.forEach((mot, index) => {
      // mot.position.y = ((this.allmots.length) -index) * 2;
      // mot.position.y = (-index) * 2;
    });
    
    // console.log(text);
    // console.log(this.allmots);
  }

  speechEnd(data) {
    this.chat.messages.push({
      role: "assistant",
      content: data.choices[0].message.content,
    });
    this.audioDetector.startRecording();

    this.nQuestion++

    if(this.nQuestion === 2){
      this.restartBtn = new Restart();
      this.restartBtn.btn.addEventListener('click', this.restart.bind(this));
    }

    for (let i = 0; i < this.money.density; i++){
      this.money.addDollar(this.moneyFont, i, this.camera.position.z)
    }

    this.alreadySpeak = false;

  }

  onTextReceived(transcript) {
    this.chat.call(transcript.text + "mais essaye de me convaincre. Il ne faut surtout pas que je raccroche donc continu de me parler, meme si je te demande d'arrêter.");
  }



  updateAnime() {
    for (let i = 0; i < this.allmots.length; i++) {
      this.mot = this.allmots[i];

      if(!this.restartClicked){
      // anim scale
        if (this.mot.scale.x < 1) {
          const scaleFactor = 0.02;
          const targetScale = 1;
          this.scaleFinish = true;
    
          this.mot.scale.x += scaleFactor * (targetScale - this.mot.scale.x);
          this.mot.scale.y += scaleFactor * (targetScale - this.mot.scale.y);
          this.mot.scale.z += scaleFactor * (targetScale - this.mot.scale.z);
        }


        //anim position

        this.posZ = i

        // this.posZ = i

        if (this.mot.position.z < this.posZ ) {

          const scaleFactor = 0.03;
          const targetScale = this.posZ ;
          this.posFinish = true;

          this.mot.position.z += (scaleFactor * (targetScale - this.mot.position.z));
          
        }




        //anim float 
        if (this.scaleFinish && this.posFinish) {
          const time = this.clock.getElapsedTime();
          const randomMovementFactor = Math.random() * 0.01;
          const randomRotationFactor = Math.random() * 0.001;

          this.mot.position.x += Math.cos(time + randomMovementFactor) * 0.0025;
          this.mot.position.y += Math.cos(time + randomMovementFactor) * 0.0025;
          this.mot.position.z += Math.cos(time + randomMovementFactor) * 0.0025;

          this.mot.rotation.z += Math.cos(time + randomRotationFactor) * 0.0005;
          this.mot.rotation.x += Math.cos(time + randomRotationFactor) * 0.0005;
          this.mot.rotation.y += Math.cos(time + randomRotationFactor) * 0.0005;
        }

          //anim camera
          // this.camera.position.z = lerp(this.camera.position.z, this.targetPositionCamera, 0.00005); 

          


          // Anim Fog
          if(this.fogScale < this.fogScaleFinal) {

            this.fogScale = this.scene.fog.density
            this.scene.fog.density += 0.000008  
            
          }  
      } // if

      if(this.restartClicked){
        
        const posY = -20;
        const opacity = 0.25;

        if (this.mot.position.y > posY ) {

          const posFactor = 0.005;
          const targetPos = posY ;
  
          this.mot.position.y += (posFactor * (targetPos - this.mot.position.y));
          
        }

        if (this.fogScale < opacity ) {

          this.fogScale = this.scene.fog.density
          this.scene.fog.density += 0.000011
          
        }else{
          this.animEndFinish = true;
          
        }
      }
      
    } // forLoop

    if (this.camera.position.z < this.targetPositionCamera ) {

      // const scaleFactor = 0.0001; 
      // const targetScale = this.targetPositionCamera;

      // this.camera.position.z += (scaleFactor * (targetScale - this.camera.position.z));

      this.cameraMovement = 0.019

      

      this.camera.position.z += this.cameraMovement
      
    }

    // if (this.camera.position.z < this.targetPositionCamera ) {

    //   const scaleFactor = 0.0005;
    //   const targetScale = this.targetPositionCamera ;


    //   this.camera.position.z += (scaleFactor * (targetScale - this.camera.position.z));

      
    // }


    

  }
    
  draw() {

  

    this.render();
    this.updateAnime();

    if(this.nQuestion > 0) {
      this.money.makeItRain();
    }

    if(this.animEndFinish){
      this.reload()
    }

    this.controls.update();
    this.light.update();

    // this.renderer.render(this.scene, this.camera);
    if(!this.animEndFinish){
      requestAnimationFrame(this.draw.bind(this));
    }
  }

  removeAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f()]/g, '');
  }

  render() {

    this.afterimagePass.enabled = true;
    this.composer.render();

  }

  reload() {
      window.location.reload();
  }

  restart() {

  
    this.animEndFinish = false;
    this.restartClicked = true;
    this.ambientSound.stop();

  }

}
