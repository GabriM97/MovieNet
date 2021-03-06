$(document).ready(function(){

  navLogoToHome();
  handleSideMenu();
  handleContentView();
  // handleNavSearch();

});

function navLogoToHome(){
  $("#logo-nav-bar").on("click", function(){
    $(".menu-voice").removeClass("active");
    $(".menu-voice:contains('Search')").remove();
    $(".menu-voice:contains('Home')").addClass("active");
    handleContentView();
  })
}


// -- CONTENT TITLE --
function handleContentView(){
  $("#content-view").empty();

  //SET CONTENT TITLE
  var content_title = $(".menu-voice.active").text();
  $("#content-view").append("<h2 id=\"content-title\">"+ content_title +"</h2>");

  switch(content_title){
    case "Home":
      $("#content-view").append('<div id="main-search"></div>');
      $("#main-search").append('<h2 id="search-title">Enter Movie title to search</h2>')
                       .append('<input type="text" class="nav-search" placeholder="Film title ...">');

      handleNavSearch();
      break;
    case "Search":
      // NOTHING ATM
      break;
  }
}

// -- SIDE MENU --
function handleSideMenu(){
  //HIDE MENU VOICES
  $(".menu-voice").not(".active").remove();

  //SWITCH SIDE MENU VOICE - ON CLICK EVENT
  $(".menu-voice").on("click", function(){
    $(".menu-voice").removeClass("active");
    $(this).addClass("active");
    if($(this).text() != "Search") $(".menu-voice").detach(":contains('Search')");
    handleContentView();
  });
}

// -- NAV SEARCH --
function handleNavSearch(){

  var top_nav_search = $("#top-nav-bar .nav-search").detach();
  $(top_nav_search).val("");

  $(".nav-search").on("focusin",function(){
    $(document).on("keypress", function(key){
      var keyCode = ( key.keyCode ? key.keyCode : key.which);
      if(keyCode == '13'){
        $(".menu-voice").removeClass("active");
        if($(".menu-voice:contains('Search')").length == 0){
          $(".menu-list").append('<div class="menu-voice active">Search</div>');
        }else{
          $(".menu-voice:contains('Search')").addClass("active");
        }

        var searchString = $(".nav-search").val();
        searchMovies(searchString, top_nav_search);
      }
    });
  });

  $(".nav-search").on("focusout",function(){
    $(document).off("keypress");
  });
}

// -- API REQUEST ON SEARCH--
function searchMovies(search, top_nav_search){
  $.ajax({
    url: "http://www.omdbapi.com",
    data: {
      apikey: "37308da5",
      s: search,
      page: "1"
    },
    type: "get"
  })

  .done(function(response){
    // console.log(response);

    $("#top-nav-bar #top-nav-body").append(top_nav_search);

    var main_content = $("#content-view");
    main_content.empty();
    main_content.append("<h2 id=\"content-subtitle\">Results for: "+search+"</h2>")

    var results_list = '<div id="list-results"></div>'
    main_content.append(results_list);
    if(response.Response == "False"){
      $("#list-results").append("<h2 id=\"content-subtitle\">MOVIE NOT FOUND</h2>");
      return false;
    }

    var row = '<div class="row"></div>';
    var max_elements = 0;
    var docs_width = $(document).width();
    if(docs_width <= 768){
      max_elements = 1;
    }else if(docs_width <= 915){
      max_elements = 2;
    }else if(docs_width <= 1120){
      max_elements = 3;
    }else if(docs_width <= 1355){
      max_elements = 4;
    }else  max_elements = 5;

    var cnt = 0;
    $("#list-results").append(row);
    response.Search.forEach(function(movie){
      if(movie.Poster != 'N/A'){
        if(cnt >= max_elements){
          cnt = 0;
          $("#list-results").append(row);
        }
        var movie =
        '<div class="col-1"> \
          <div id="'+ movie.imdbID +'" class="cover-container"> \
            <div class="movie-rating"><p class="rating-number">'+ movie.Year.replace("–"," ") +'</p></div> \
            <a href="#"><img class="movie-image" src="'+ movie.Poster +'" alt="'+ movie.Poster +'" onerror="imgError(this);"></a> \
            <h3 class="movie-title">'+ movie.Title +'</h3> \
            <p class="movie-category">'+ movie.Type +'</p> \
          </div> \
        </div>';

        $(".row").last().append(movie);
        cnt++;
      }
    });
  })

  .fail(function(){
    console.log("API ERROR!");
  });
}

// -- HANDLE IMG ERROR --
function imgError(image){
  image.src = "assets/img/img_not_available.png";
}
