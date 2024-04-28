let sentimentResult;
let charRNN;
let apiKey = "";

let videoId = "8lgg-pVjOok";
const maxResults = 2; //con 50 explota y con 25 o menos va bien 
/**extrañamanete con menos cometnarios los resultados son mejores y los textos mas  extensos */
function setup() {
  noCanvas();
  sentiment = ml5.sentiment('movieReviews', modelReady);
//  charRNN = ml5.charRNN('models/bolano/', modelReady);
//  charRNN = ml5.charRNN('models/darwin/', modelReady);
//  charRNN = ml5.charRNN('models/charlotte_bronte/', modelReady);

 //charRNN = ml5.charRNN('models/dubois/', modelReady);
  //charRNN = ml5.charRNN('models/hemingway/', modelReady);
charRNN = ml5.charRNN('models/shakespeare/', modelReady);
//  charRNN = ml5.charRNN('models/zora_neale_hurston/', modelReady);
//charRNN = ml5.charRNN('models/woolf/', modelReady);
 



statusEl = createP('Loading Model...');
    fetchComments();

//fetchComments(generateText);

}



function fetchComments() {

  fetch(`https://www.googleapis.com/youtube/v3/commentThreads?key=${apiKey}&videoId=${videoId}&part=snippet&maxResults=${maxResults}&textFormat=plainText`)
      .then(response => response.json())
    .then(data => {
      console.log(data);
      let commentsArray = []; //pone los comentarios en un array
      data.items.forEach(comment => {// por cada comentario
        const text = comment.snippet.topLevelComment.snippet.textDisplay;//se extrae el comentario de arriba(?)
        const textSize = text.length;//se obtiene el tamaño del comentario para generar un comentario  con charrnn del mismo tamaño

        charRNN.generate({ seed: text, length: textSize }, (err, results) => {
          if (err) {
            console.error('Error generating text:', err);//esto es mas que nada para ver si hay errores y que el codigo siga funcionanado si hay algun error 
          } else {
            console.log(results);//devuelve el comentario generado
            let input1 = createInput(text);//crea un campo de entreada de texto
            let input2 = createInput(results.sample);//crea un campo de entrada de texto con charrnn
       
              /**
            input1.attribute('readonly', '');
            input2.attribute('readonly', '');
            input1.style('color', 'black');
            input2.style('color', 'black');
 */
            const predictionOriginal = getSentiment(text);//se calcula el sentimiento del comentario original
            const predictionGenerated = getSentiment(results.sample);//se calcula el sentimiento del comentario charrnn
            
            // Cambio de colores para ser más agradables
            const colorOriginal = getColor(predictionOriginal.score);//se crea la variable colorOriginal que consiste ne obtener el color segun la puntiacion del sentimiento calculado
            const colorGenerated = getColor(predictionGenerated.score);
            input1.style('background-color', colorOriginal);//cambia el color de fondo
            input2.style('background-color', colorGenerated);
          }
        });
      });
    })
    .catch(error => console.error('Error getting comments:', error));
}

// Función para obtener el color basado en la puntuación de sentimiento
function getColor(score) {
  if (score < 0.2) {
    return 'red'; // Rojo
  } else if (score < 0.4) {
    return 'orangered'; // Rojo anaranjado
  } else if (score < 0.6) {
    return 'orange'; // Naranja
  } else if (score < 0.8) {
    return 'yellowgreen'; // Verde amarillento
  } else {
    return 'green'; // Verde
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


