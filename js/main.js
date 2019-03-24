$(document).ready(function(){

  handleSideMenu();

  handleNavSearch();

  // apiRequest();

});

// -- SIDE MENU --
function handleSideMenu(){
  //HIDE MENU VOICES
  $(".menu-voice").not(".active").remove();

  //SET CONTENT TITLE
  var content_title = $(".menu-voice.active").text();
  $("#main-search").before("<h2 id=\"content-title\">"+content_title+"</h2>");

  //SWITCH SIDE MENU VOICE - ON CLICK EVENT
  $(".menu-voice").on("click", function(){
    $(".menu-voice").removeClass("active");
    $(this).addClass("active");

    //SET CONTENT TITLE - ON CLICK EVENT
    var content_title = $(this).text();
    $("#content-title").text(content_title);
  });
}

// -- NAV SEARCH --
function handleNavSearch(){

  var top_nav_search = $("#top-nav-bar .nav-search").detach();

  $(".nav-search").on("focusin",function(){
    $(document).on("keypress", function(key){
      var keyCode = ( key.keyCode ? key.keyCode : key.which);
      if(keyCode == '13'){
        var searchString = $(".nav-search").val();
        apiRequest(searchString);
      }
    });
  });

  $(".nav-search").on("focusout",function(){
    $(document).off("keypress");
  });
}

// -- API REQUEST --
function apiRequest(search){
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
    console.log(response);
    $(".menu-voice.active").text("Search");
    var main_content = $("#content-view");
    main_content.empty();
    main_content.append("<h2 id=\"content-title\">Results for: "+search+"</h2>")
    response.Search.forEach(function(movie){
      if(movie.Poster != 'N/A'){
        var movie =
        '<div class="col-1"> \
          <div id="'+ movie.imdbID +'" class="cover-container"> \
            <div class="movie-rating"><p class="rating-number">'+ movie.Year +'</p></div> \
            <a href="#"><img class="movie-image" src="'+ movie.Poster +'" alt="'+ movie.Poster +'"></a> \
            <h3 class="movie-title">'+ movie.Title +'</h3> \
            <p class="movie-category">'+ movie.Type +'</p> \
          </div> \
        </div>';
        main_content.append(movie);
      }
    });
  })

  .fail(function(){
    console.log("API ERROR!");
  })

}
