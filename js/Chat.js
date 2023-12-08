import Config from "./Config.js";
import Speech from "speak-tts";
import EventEmitter from "@onemorestudio/eventemitterjs";
export default class Chat extends EventEmitter {
  constructor() {
    super();
    this.API_URL = "https://api.openai.com/v1/chat/completions";
    this.API_KEY = Config.OPEN_AI_KEY;
    this.messages = [];
    this.context =
      "Tu es un spécialiste telemarketer et tu veux absolument me vendre un objet. Tu choisis un objet à me vendre. Commence par me saluer en disant ton prénom masculin et en me disant le nom du produit que tu veux me vendre. Basé sur ma réponse, tu me poses une autre question et met en avant un point positif de ce que tu veux me vendre. Tu fais des questions très courtes et succinctes. Tu fais des questions de maximum 10 mots.";
      // "Tu es un spécialiste de l'ECAL, Ecole Cantonale d'Art de Lausanne. Et tu me poses des questions. Basé sur mes réponses, tu me poses d'autres questions. Tu fais des question réponses très courtes et succinctes. Commence par me poser une question sur un quelconque sujet en relation avec l'ECAL.";
      // "Tu es un telemarketer qui veut absolument me vendre un grille-pain. Je suis un client et je vais te donner des réponses à tes tentative de ventes et questions. Basé sur mes réponses, tu me poses d'autres questions et met en avant d'autres points positifs de ce que tu veux me vendre. Tu fais des question réponses très courtes et succinctes. Commence par introduire la conversation avec une phrase de telemarketer.";
    this.speech = new Speech(); // will throw an exception if not browser supported
    if (this.speech.hasBrowserSupport()) {
      // returns a boolean
      console.log("speech synthesis supported");
    }
    this.speech
      .init({
        volume: 1,
        lang: "fr-FR",
        rate: 1,
        pitch: 1,
        voice: "Thomas",
        splitSentences: true,
        listeners: {
          onvoiceschanged: (voices) => {
            console.log("Event voiceschanged", voices);
          },
        },
      })
      .then((data) => {
        // The "data" object contains the list of available voices and the voice synthesis params
        console.log("Speech is ready, voices are available", data);
        // this.speech.voice = "Eddy (anglais (États-Unis))";
      })
      .then(() => {
        console.log("Success !");
        //
        // this.call(this.context);
      })
      .catch((e) => {
        console.error("An error occured while initializing : ", e);
      });

    // this.init();
  }
  async init() {
    // on invente un contexte pour le chat
  }

  async call(userMessage) {
    this.messages.push({
      role: "user",
      content: userMessage,
    });
    console.log("config", Config.TEXT_MODEL);
    console.log("userMessage", userMessage);
    try {
      console.log("Send message to OpenAI API");
      // Fetch the response from the OpenAI API with the signal from AbortController
      const response = await fetch(this.API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.API_KEY}`,
        },
        body: JSON.stringify({
          model: Config.TEXT_MODEL, // "gpt-3.5-turbo",
          messages: this.messages,
        }),
      });

      const data = await response.json();
      // ici on attends la réponse de CHAT GPT
      // console.log(data);
      // console.log(data.choices[0].message.content);

      // on peut envoyer la réponse à l'app dans l'idée de voir si on pourrait générer une image
      this.emit("gpt_response", [data.choices[0].message.content]);
      this.activeString = "";
      //on peut faire parler le bot
      this.speech
        .speak({
          text: data.choices[0].message.content,
          listeners: {
            onstart: () => {
              this.emit("startSpeaking", [data])
              // console.log("Start utterance");
            },
            onend: () => {
              // console.log("End utterance");
            },
            onresume: () => {
              // console.log("Resume utterance");
            },
            onboundary: (event) => {
              this.extractWord(event);
            },
          },
        })
        .then(() => {
          // console.log("This is the end my friend!");
          this.emit("speechEnd", [data]);
        });
    } catch (error) {
      console.error("Error:", error);
      resultText.innerText = "Error occurred while generating.";
    }
  }

  extractWord(event) {
    const index = event.charIndex;
    const word = this.getWordAt(event.target.text, index);
    this.emit("word", [word]);
  }

  // Get the word of a string given the string and index
  getWordAt(str, pos) {
    // Perform type conversions.
    str = String(str);
    pos = Number(pos) >>> 0;

    // Search for the word's beginning and end.
    let left = str.slice(0, pos + 1).search(/\S+$/);
    let right = str.slice(pos).search(/\s/);

    // The last word in the string is a special case.
    if (right < 0) {
      return str.slice(left);
    }

    // Return the word, using the located bounds to extract it from the string.
    return str.slice(left, right + pos);
  }
}