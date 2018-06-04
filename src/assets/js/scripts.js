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
      return this.render(data, 1)
    }.bind(this))
  }

  clearOutput() {
    document.querySelector('.Output').innerHTML = "";
    return;
  }

  // interprète les données récupérées via getData et les affiche dans le dom
  render(data, situation) {
    let output = document.querySelector('.Output');
    let cursor = 0;
    let statement;
    
    let timer = setInterval( () => {
      statement = ` <p class="Output__renderedText"> ${ data[situation].text[cursor] } </p> `;
      output.innerHTML += statement;
      if(cursor === data[situation].text.length - 1){
        clearInterval(timer);
        if( data[situation].choices ){
          output.innerHTML += `
          <div class="Output__renderedChoicesBox">
            <button class="Output__btn" data-choice="a"> ${data[situation].choices.a.label} </button>
            <button class="Output__btn" data-choice="b"> ${data[situation].choices.b.label} </button>
          </div>
          `;
          document.querySelector('.Output__btn[data-choice="a"]').addEventListener('click', () => {
            console.log(this)
            this.clearOutput();
            return this.render(data, 2)
          });
          document.querySelector('.Output__btn[data-choice="b"]').addEventListener('click', () => {
            console.log(this)
            this.clearOutput();
            return this.render(data, 3)
          });
        }else{
          output.innerHTML += `<button class="Output__btn"> Suivant </button>`;
        }
      }
      cursor++;
    }, 1000);
    document.querySelector('body').style.backgroundColor = data[0].color;
  }
}

let story = new Story();
