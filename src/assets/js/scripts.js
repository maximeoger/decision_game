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
    document.querySelector('body').style.backgroundColor = obj.color
    document.querySelector('.Game__img').setAttribute("src", obj.image)
    let output_txt = document.querySelector('.Output__txt')
    let output_btns = document.querySelector(".Output__btnsContainer")
    let cursor = 0
    let next
    let nextBtn
    let statement

    output_txt.scrollTop = 0;

    for (let i=0; i <= obj.text.length - 1 ; i++) {
      statement = `<p class="Output__renderedText"> ${ obj.text[i] } </p>`
      output_txt.innerHTML += statement
    }

    let timer = setInterval( () => {
      let currentTxt = document.querySelectorAll(".Output__renderedText")
      currentTxt[cursor].classList.add("--visible")
      
      output_txt.scrollTop += (currentTxt[cursor].clientHeight + 5)

      if(cursor === obj.text.length - 1){
        clearInterval(timer)

        if( obj.choices ){

          output_btns.innerHTML = `
          <div class="Output__renderedChoicesBox">
          
              <button data-choice="a" id="component-1" class="button button--1 Output__btn startBtn">
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

            <button data-choice="b" id="component-1" class="button button--1 Output__btn startBtn">
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

        }else if (obj.ending===true) {

          output_btns.innerHTML = `
            <button id="component-1" class="button button--1 Output__btn restartBtn">
            ${obj.label}
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
        `
      document.querySelector('.restartBtn').addEventListener('click', () => {
        this.clearOutput()
        return this.showMenu()
      })

        } else {
          output_btns.innerHTML = `
          <button id="component-1" class="button button--1 Output__btn nextBtn">
              ${obj.label}
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
          `
          document.querySelector('.nextBtn').addEventListener('click', () => {
            this.clearOutput()
            next = obj.next
            return this.getNextStep(data, next)
          })
        }

      }
      cursor++
    }, 1500)

  }

  showMenu() {
    document.querySelector('.Game__mainMenu').style.display = ""
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
