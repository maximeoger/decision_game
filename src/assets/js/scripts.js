class Story {
  constructor(bg, data) {
    this.bg = bg
    this.data = data
  }
  show() {
    console.log(this.bg, this.data)
  }
  getData() {
    fetch('./src/assets/js/story.json')
      .then((response) => response.json())
      .then((data) => {
        let output = '<h2>story</h2>';
        data.forEach(function(data){
          output += `
            <ul>
                <li>id: ${data.id}</li>
                <li>situation: ${data.situation[0]}</li>
            </ul>
          `;
        });
        document.querySelector('.output').innerHTML = output;
      })
  }
}

var story = new Story('lol', 9)
story.getData();

console.log('coucou');
