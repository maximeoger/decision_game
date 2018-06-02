class Story {

  constructor() {
   this.getData();
  }
  
  // appel fetch pour récupérer les données dans le story.json
  getData() {
    document.querySelector('.startBtn').addEventListener('click', () => {
      fetch('./src/assets/js/story.json')
        .then((response) => response.json())
        .then(function(data) {
          this.render(data)
        }.bind(this))
    })
  }

  mainMenu() {
    
  }

  // interprète les données récupérées dans getData et les affiche dans le dom
  render(data) {
    let output = document.querySelector('.Output');
    let statement;
    statement = `
      <p> ${ data[0].text[0] } </p>
    `;
    output.innerHTML = statement;
    document.querySelector('body').style.backgroundColor = data[0].color;
  }

  // enregistre les conséquences des réponses à la fin de chaque situation
  saveState() {

  }
}

var story = new Story();
