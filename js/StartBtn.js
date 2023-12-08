import App from "./App.js";


export default class StartBtn {
    constructor() {

    }

    createBtnStart(sound){

        this.btn = document.createElement('div');
        this.btn.id = 'btnStart'
        this.btn.innerHTML = '   ';

        this.btn.addEventListener('click', () => {
            this.btn.remove();
            const app = new App();
            sound.stop();
        })

        document.body.appendChild(this.btn);
    }
}