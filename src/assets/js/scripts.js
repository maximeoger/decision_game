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

  // interprète les données récupérées via getData et les affiche dans le dom
  render(data, situation) {
    let output = document.querySelector('.Output');
    let cursor = 0;
    let statement;
    let timer = setInterval( function () {
      statement = ` <p> ${ data[situation].text[cursor] } </p> `;
      output.innerHTML += statement;
      if(cursor === data[situation].text.length - 1){
        clearInterval(timer);
        if( data[situation].choices ){
          output.innerHTML += `
            <button class="Output__btn"> ${data[situation].choices.a} </button>
            <button class="Output__btn"> ${data[situation].choices.b} </button>
          `;
        }else{
          output.innerHTML += `<button class="Output__btn"> Suivant </button>`;
        }
      }
      cursor++;
    }, 1000)
    
    document.querySelector('body').style.backgroundColor = data[0].color;
  }

  engine() {

  }

  // enregistre les conséquences des réponses à la fin de chaque situation
  saveState() {
    
  }
}

var story = new Story();
