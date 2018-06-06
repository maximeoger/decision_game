class Story {

  constructor() {
    this.startGame()
  }

  // démarre le jeu
  startGame() {
    document.querySelector('.startBtn').addEventListener('click', () => {
      this.clearOutput()
      document.querySelector('.Game__mainMenu').style.display = "none"
      return this.getData()
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
    document.querySelector('.Output__txt').innerHTML = ""
    document.querySelector('.Output__btnsContainer').innerHTML = ""
    return;
  }

  // reçois le fichier JSON (data), l'index d'un objet correspondant à une situation (obj) et affiche les données dans le dom
  render(data, obj) {
    let output_txt = document.querySelector('.Output__txt')
    let output_btns = document.querySelector('.Output__btnsContainer')
    let cursor = 0
    let statement
    let next
    
    let timer = setInterval( () => {
      statement = ` <p class="Output__renderedText"> ${ obj.text[cursor] } </p> `
      output_txt.innerHTML += statement
      if(cursor === obj.text.length - 1){
        clearInterval(timer)
        if( obj.choices ){

          output_btns.innerHTML = `
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
          `

          document.querySelector('.Output__btn[data-choice="a"]').addEventListener('click', () => {
            this.clearOutput()
            next = obj.choices.a.next
            return this.getNextStep(data, next)
          })

          document.querySelector('.Output__btn[data-choice="b"]').addEventListener('click', () => {
            this.clearOutput()
            next = obj.choices.b.next
            return this.getNextStep(data, next)
          })

        }else{
          output_btns.innerHTML = `<button id="nextBtn" class="Output__btn"> ${obj.label} </button>`
          document.getElementById('nextBtn').addEventListener('click', () => {
            this.clearOutput()
            next = obj.next
            return this.getNextStep(data, next)
          })
        }
      }

      cursor++

    }, 100)

    document.querySelector('body').style.backgroundColor = obj.color

    if(obj.ending === true){
      console.log(obj)
      output_btns.innerHTML = `<button id="restartBtn" class="Output__btn"> ${obj.label} </button>`
      document.getElementById('restartBtn').addEventListener('click', () => {
        console.log('lol')
        //this.clearOutput()
        //return this.showMenu()
      })
    }
  }

  showMenu() {
    //document.querySelector('.Game__mainMenu').style.display = ""
    console.log(document.querySelector('.Game__mainMenu').style.display)
  }

  getNextStep(data, next){
    for(let i=0; i<=data.length - 1; i++){
      if(data[i].id === next){
        return this.render(data, data[i])
      }
    }
  }

}

let story = new Story()
