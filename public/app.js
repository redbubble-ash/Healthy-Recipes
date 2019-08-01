

// function getResult(){

    $(".main-articles").empty();
    
    $.getJSON("/articles", function(data) {
        // For each note...
        for (var i = 0; i < data.length; i++) {
            var article = data[i];

            // Increase the articleCount (track article # - starting at 1)
            var articleCount = i + 1;

            // Create the list group to contain the article and add the article content for each
            var $articleList = $("<ul>");
            $articleList.addClass("list-group");
           
            // Add the newly created element to the DOM
            $(".main-articles").append($articleList);

            var articleTitle = article.title;
            var articleContent = article.content;
            var articleLink = article.link;

            var $articleListItem = $("<li class='list-group-item'>");
            $articleListItem.append(
                "<span class='label label-primary'>" +
                articleCount +
                "<strong> " +
                articleTitle +
                "</strong>" +
                "</span>" + "<br>" + "<br>" +
                "<h2 class='content'>" + articleContent + "</h2>" + "<br>" +
               "<div class=link-action>" + "<a href='" + articleLink + "'target='_blank'>" + "LINK TO ARTICLE" + "</a>" + "</div>" 


            )
             // append <li> to <ul>
            $articleList.append($articleListItem);



        }
      });
    
// }


// getResult();

