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
        data.forEach(function(situations){
          output += `
            <ul>
                <li>id: ${id}</li>
                <li>situation: ${situation}</li>
            </ul>
          `;
        })
      })
  }
}

var story = new Story('lol', 9)
story.getData();
