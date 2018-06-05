class Story {

  constructor() {
    this.startGame();
  }

  // démarre le jeu
  startGame() {
    let output = document.querySelector('.Output');
    document.querySelector('.startBtn').addEventListener('click', () => {
      output.innerHTML= "";
      return this.getData();
    });
  }
  
  // appel fetch pour récupérer les données dans le story.json
  getData() {
    fetch('./src/assets/js/story.json')
    .then((response) => response.json())
    .then(function(data) {
      return this.render(data, data[0])
    }.bind(this))
  }

  clearOutput() {
    document.querySelector('.Output').innerHTML = "";
    return;
  }

  // reçois le fichier JSON (data), l'index d'un objet correspondant à une situation (obj) et affiche les données dans le dom
  render(data, obj) {
    let output = document.querySelector('.Output');
    let cursor = 0;
    let statement;
    let next;
    
    let timer = setInterval( () => {
      statement = ` <p class="Output__renderedText"> ${ obj.text[cursor] } </p> `;
      output.innerHTML += statement;
      if(cursor === obj.text.length - 1){
        clearInterval(timer);
        if( obj.choices ){
          output.innerHTML += `
          <div class="Output__renderedChoicesBox">
          
            <button id="component-1" class="button button--1 Output__btn startBtn" data-choice="a">
              ${obj.choices.a.label}
            <span class="button__container">
              <span class="circle top-left"></span>
              <span class="circle top-left"></span>
              <span class="circle top-left"></span>
              <span class="button__bg"></span>
              <span class="circle bottom-right"></span>
              <span class="circle bottom-right"></span>
              <span class="circle bottom-right"></span>
            </span>
          </button>

          <button id="component-1" class="button button--1 Output__btn startBtn" data-choice="b">
              ${obj.choices.b.label}
            <span class="button__container">
              <span class="circle top-left"></span>
              <span class="circle top-left"></span>
              <span class="circle top-left"></span>
              <span class="button__bg"></span>
              <span class="circle bottom-right"></span>
              <span class="circle bottom-right"></span>
              <span class="circle bottom-right"></span>
            </span>
          </button>

          </div>
          `;

          document.querySelector('.Output__btn[data-choice="a"]').addEventListener('click', () => {
            this.clearOutput()
            next = obj.choices.a.next
            return this.getNextStep(data, next)
          });

          document.querySelector('.Output__btn[data-choice="b"]').addEventListener('click', () => {
            this.clearOutput()
            next = obj.choices.b.next
            return this.getNextStep(data, next)
          });

        }else{
          output.innerHTML += `<button class="Output__btn"> Suivant </button>`;
          document.querySelector('.Output__btn').addEventListener('click', () => {
            this.clearOutput()
            next = obj.next
            return this.getNextStep(data, next)
          })
        }
      }
      cursor++;
    }, 1000);
    document.querySelector('body').style.backgroundColor = obj.color;
  }

  getNextStep(data, next){
    for(let i=0; i<=data.length - 1; i++){
      if(data[i].id === next){
        console.log(data[i]);
        return this.render(data, data[i])
        
      }
    }
  }
}

let story = new Story();
