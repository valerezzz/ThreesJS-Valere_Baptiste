export default class Restart {
    constructor() {
        this.btn = document.createElement('div');
        this.btn.id = 'btnRestart';
        this.btn.innerHTML = ' ';

        this.btnContainer = document.createElement('div');
        this.btnContainer.id = 'container';
        document.body.appendChild(this.btnContainer);

        this.phoneHangUp = "./sound/phone-hangup.mp3";
        
        this.ringHangUp = new Howl({
            src: this.phoneHangUp,
            loop: false,
            volume: 1,
          });

        this.btn.addEventListener('click', () => {
            this.ringHangUp.play()
        })
        
        this.btnContainer.appendChild(this.btn);
    }

    createRestart(){

        
    }
}