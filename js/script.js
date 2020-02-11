//Milestone 1
// Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il  bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
// Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
// Titolo
// Titolo Originale
// Lingua
// Voto
// Milestone 2

// Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di ricerca dovremo prendere sia i film che corrispondono alla query, sia le serie tv, stando attenti ad avere alla fine dei valori simili (le serie e i film hanno campi nel JSON di risposta diversi, simili ma non sempre identici)
// Qui un esempio di chiamata per le serie tv:
// https://api.themoviedb.org/3/search/tv?api_key=e99307154c6dfb0b4750f6603256716d&language=it_IT&query=scrubs

// Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, così da permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5, lasciando le restanti vuote (troviamo le icone in FontAwesome).
// Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze piene (o mezze vuote :P)
// <i class="fas fa-star"></i> piena
// <i class="far fa-star"></i> vuota

// Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API (le flag non ci sono in FontAwesome).

// api_key
// f45eed1b51907eec504d83c2a1f86cae



// Milestone 3:
// In questa milestone come prima cosa aggiungiamo la copertina del film o della serie al nostro elenco.
//Ci viene passata dall’API solo la parte finale dell’URL, questo perché poi potremo generare da quella porzione di URL tante dimensioni diverse. Dovremo prendere quindi l’URL base delle immagini di TMDB: https://image.tmdb.org/t/p/ per poi aggiungere la dimensione che vogliamo generare (troviamo tutte le dimensioni possibili a questo link: https://www.themoviedb.org/talk/53c11d4ec3a3684cf4006400) per poi aggiungere la parte finale dell’URL passata dall’API.
// Esempio di URL che torna la copertina di BORIS:
// https://image.tmdb.org/t/p/w185/s2VDcsMh9ZhjFUxw77uCFDpTuXp.jpg


$(document).ready(function () {
  $('#query-button').click(function () {
    search();
  });

  $('#query').keypress(function (event) {
    if(event.which == 13) {
      search();
    }
  })
});


// Functions -------------------

function search() {
  var query = $('#query').val();
  resetSearch();

  var api_key = 'f45eed1b51907eec504d83c2a1f86cae';

  var urlMovie = 'https://api.themoviedb.org/3/search/movie';
  var urlTv = 'https://api.themoviedb.org/3/search/tv';

  var typeMovie = 'film';
  var typeTv = 'tv';

  getData(query, api_key, urlMovie, typeMovie, '.films');
  getData(query, api_key, urlTv, typeTv, '.tvs');
}

function resetSearch() {
  $('.films').html('');
  $('.tvs').html('');
  $('#query').val('');
}

function getData(string, api_key, url, type, container) {
  $.ajax({
    url: url,
    method: 'GET',
    data: {
      api_key: api_key,
      query: string,
      language: 'it-IT'
    },
    success: function(data) {
      //controllo che ci siano risultati
      if(data.total_results > 0) {
        var results = data.results;
        printResult(type, results);
      } else {
        printNoResult($(container));
      }

    },
    error: function (request, state, errors) {
      console.log(errors);
    }
  });

}

function printStars (num) {
  num = Math.ceil(num / 2);
  var string = '';

  for (var i = 1; i <= 5; i++) {
    if(i <= num ) {
      string += '<i class="fas fa-star"></i>';
    } else {
      string += '<i class="far fa-star"></i>';
    }
  }

  return string
}

function printLanguage(string) {
  var availableLangs = [
    'en',
    'it'
  ];

  if(availableLangs.includes(string)) {
    string = '<img class="lang" src="img/' + string + '.svg" alt="en">';
  }

  return string;
}

// Esempio di risposta della API per search Movie
//           "title": "Ritorno al futuro",
//           "original_title": "Back to the Future",
//           "original_language": "en",
//           "vote_average": 8.2,

// Esempio di risposta della API per search TV
//             "original_name": "Scrubs",
//             "name": "Scrubs",
//             "vote_average": 7.9,
//             "original_language": "en",

function printResult(type, results) {
  var source = $('#film-template').html();
  var template = Handlebars.compile(source);
  var title;
  var originalTitle;

  for (var i = 0; i < results.length; i++) {
    var thisResult = results[i];

    if(type == 'film') {
      originalTitle = thisResult.original_title;
      title = thisResult.title;
      var container = $('.films');
    } else if (type == 'tv'){
      originalTitle = thisResult.original_name;
      title = thisResult.name;
      var container = $('.tvs');
    }

    var posterImage;
    var urlBaseImage = 'https://image.tmdb.org/t/p/w342';

    if(thisResult.poster_path == null) {
      posterImage = '<img src="img/default-poster.png" alt="'+ title +'">'
    } else {
        posterImage = '<img src="' + urlBaseImage + thisResult.poster_path + '" alt="'+ title +'">'
    }
    console.log(posterImage);

    // console.log(thisFilm);
    // thisFilm.vote_average
    var context = {
      type: type,
      title: title,
      original_title: originalTitle,
      original_language: printLanguage(thisResult.original_language),
      vote_average: printStars(thisResult.vote_average),
      poster: posterImage
    };

    var html = template(context);

    container.append(html);
  }
}

function printNoResult(container) {
  var source = $('#noresult-template').html();
  var template = Handlebars.compile(source);
  var html = template();
  container.append(html);
}
