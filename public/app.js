$(document).ready(function () {


    $(".main-articles").empty();
    // Grab the articles as a json
    // Run an AJAX request for any unsaved headlines
    $.getJSON("/articles", function (data) {
        // For each note...
        for (var i = 0; i < data.length; i++) {
            var article = data[i];
            if (!article.saved) {
                // Increase the articleCount (track article # - starting at 1)
                var articleCount = i + 1;

                // Create the list group to contain the article and add the article content for each
                var $articleList = $("<ul class='list-group'>");
                $articleList.attr("data-_id", article._id);


                // Add the newly created element to the DOM
                $("#main-articles").append($articleList);

                var articleTitle = article.title;
                var articleContent = article.content;
                var articleLink = article.link;

                var $articleListItem = $("<li class='list-group-item'>");
                $articleListItem.append(
                    "<span class='label label-primary'>" +
                    articleCount +
                    "<strong> " +
                    articleTitle +
                    "</strong>" + "</span>" +
                    "<button type='button' class='btn btn-success' style ='float:right;' >SAVE ARTICLE</button>" +
                    "<br>" + "<br>" +
                    "<h2 class='content'>" + articleContent + "</h2>" + "<br>" +
                    "<div class=link-action>" + "<a href='" + articleLink + "'target='_blank'>" + "LINK TO ARTICLE" + "</a>" + "</div>"


                )
                // append <li> to <ul>
                $articleList.append($articleListItem);
            }

        };

    });

    $(document).on("click", "button", function () {
        console.log("Button CLICKED");
        var articleToSave = $(this)
            .parents(".list-group")
            .data();

        // Remove this article <ul> from page
        $(this)
            .parents(".list-group")
            .remove();


        articleToSave.saved = true;
        console.log(articleToSave._id);
        // Now make an ajax call for the Article
        $.ajax({
                method: "PUT",
                url: "/articles/" + articleToSave._id,
                data: articleToSave
            })

            .then(function (data) {
                console.log(data);
                // If the data was saved successfully
                if (data) {
                    // This will reload the entire list of articles
                    location.reload();
                }


            })

    });



});