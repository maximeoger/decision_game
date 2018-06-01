class Story {

  constructor() {
    this.getData();
  }

  getData() {
    document.querySelector('button').addEventListener('click', () => {
      fetch('./src/assets/js/story.json')
        .then((response) => response.json())
        .then((data) => {
          this.init(data);
        })
    })
  }

  init(data) {
    let output;
    data.forEach(function(data){
      output = `<p> ${data.situation[0]} </p>`;
    });
    document.querySelector('.output').innerHTML = output;
  }

  engine() {

  }

  chooseA(){
    alert('a');
  }

  chooseB(){
    alert('b');
  }

}

var story = new Story();
