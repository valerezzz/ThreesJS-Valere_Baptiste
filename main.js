import './style.css';
import StartBtn from './js/StartBtn.js';
import { Howl } from "howler";

window.onload = function() { // Utilisez une fonction régulière ici

  this.ringSoundFile = "./sound/phone-ring.mp3";
  this.ringInit = true

  this.ringSound = new Howl({
    src: this.ringSoundFile,
    loop: true,
    volume: 1,
  });
  this.ringSound.play();
  // document.addEventListener("click", (e) => {
  //   if(ringInit) {
  //   this.ringSound.play();
  //   this.ringInit = false
  //     }
  // });

  const btn = new StartBtn();
  btn.createBtnStart(this.ringSound);


}