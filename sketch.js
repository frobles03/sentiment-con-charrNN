let sentimentResult;
let charRNN;
let apiKey = "";

let videoId = "8lgg-pVjOok";


function setup() {
  noCanvas();
  sentiment = ml5.sentiment('movieReviews', modelReady);
//  charRNN = ml5.charRNN('models/bolano/', modelReady);
//  charRNN = ml5.charRNN('models/darwin/', modelReady);
//  charRNN = ml5.charRNN('models/charlotte_bronte/', modelReady);

//  charRNN = ml5.charRNN('models/dubois/', modelReady);
  charRNN = ml5.charRNN('models/hemingway/', modelReady);
//charRNN = ml5.charRNN('models/shakespeare/', modelReady);
//  charRNN = ml5.charRNN('models/zora_neale_hurston/', modelReady);
//charRNN = ml5.charRNN('models/woolf/', modelReady);
 



statusEl = createP('Loading Model...');
    fetchComments();

//fetchComments(generateText);

}



function fetchComments() {

  fetch(`https://www.googleapis.com/youtube/v3/commentThreads?key=${apiKey}&videoId=${videoId}&part=snippet&maxResults=2&textFormat=plainText`)
      .then(response => response.json())
    .then(data => {
      console.log(data);
      let commentsArray = [];
      data.items.forEach(comment => {
        const text = comment.snippet.topLevelComment.snippet.textDisplay;
        const textSize = text.length;

        charRNN.generate({ seed: text, length: textSize }, (err, results) => {
          if (err) {
            console.error('Error generating text:', err);
          } else {
            console.log(results);
            let input1 = createInput(text);
            let input2 = createInput(results.sample);
            input1.attribute('readonly', '');
            input2.attribute('readonly', '');
            input1.style('color', 'black');
            input2.style('color', 'black');

            const predictionOriginal = getSentiment(text);
            const predictionGenerated = getSentiment(results.sample);
            
            // Cambio de colores para ser más agradables
            const colorOriginal = getColor(predictionOriginal.score);
            const colorGenerated = getColor(predictionGenerated.score);
            input1.style('background-color', colorOriginal);
            input2.style('background-color', colorGenerated);
          }
        });
      });
    })
    .catch(error => console.error('Error getting comments:', error));
}

// Función para obtener el color basado en la puntuación de sentimiento
function getColor(score) {
  if (score < 0.4) {
    return 'red';
  } else if (score < 0.6) {
    return 'yellow';
  } else {
    return 'green';
  }
}







function getSentiment(text) {
  const prediction = sentiment.predict(text);
  return prediction;
}

function modelReady() {
  // model is ready
  statusEl.html('model loaded');
}


