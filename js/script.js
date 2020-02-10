//Milestone 1
// Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il  bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
// Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
// Titolo
// Titolo Originale
// Lingua
// Voto





// api_key
// f45eed1b51907eec504d83c2a1f86cae
$(document).ready(function () {
  $('#query-button').click(function () {
    var query = $('#query').val();
    resetSearch();
    getMovies(query);
    getTv(query);
  });
});


// Milestone 2

// Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di ricerca dovremo prendere sia i film che corrispondono alla query, sia le serie tv, stando attenti ad avere alla fine dei valori simili (le serie e i film hanno campi nel JSON di risposta diversi, simili ma non sempre identici)
// Qui un esempio di chiamata per le serie tv:
// https://api.themoviedb.org/3/search/tv?api_key=e99307154c6dfb0b4750f6603256716d&language=it_IT&query=scrubs



// Functions -------------------


// Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, così da permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5, lasciando le restanti vuote (troviamo le icone in FontAwesome).
// Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze piene (o mezze vuote :P)
// <i class="fas fa-star"></i> piena
// <i class="far fa-star"></i> vuota
function resetSearch() {
  $('.films').html('');
  $('.tvs').html('');
  $('#query').val('');
}

function getMovies(string) {
  var api_key = 'f45eed1b51907eec504d83c2a1f86cae';
  var url = 'https://api.themoviedb.org/3/search/movie';

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
        var films = data.results;
        printResult('film', films);
      } else {
        printNoResult($('.films'));
      }

    },
    error: function (request, state, errors) {
      console.log(errors);
    }
  });

}

function getTv(string) {
  var api_key = 'f45eed1b51907eec504d83c2a1f86cae';
  var url = 'https://api.themoviedb.org/3/search/tv';

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
        var tv = data.results;
        printResult('tv', tv);
      } else {
        printNoResult($('.tvs'));
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

// Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API (le flag non ci sono in FontAwesome).
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

    // console.log(thisFilm);
    // thisFilm.vote_average
    var context = {
      type: type,
      title: title,
      original_title: originalTitle,
      original_language: printLanguage(thisResult.original_language),
      vote_average: printStars(thisResult.vote_average)
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