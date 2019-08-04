$(document).ready(function () {

    // Whenever someone clicks a saved button
    $(document).on("click", "button", function () {
        console.log("Button CLICKED");

        // Save the id from the p tag
        var thisId = $(this).attr("data-id");

        // Now make an ajax call for the Article
        $.ajax({
                method: "GET",
                url: "/articles/" + thisId
            })

            .then(function (data) {
                console.log(data);

                var $articleList = $("<ul>");
                $articleList.addClass("list-group");
                $("#saved-articles").append($articleList);
                var $articleListItem = $("<li class='list-group-item'>");
                $articleListItem.append(
                    "<span class='label label-primary'  data-id='" + data._id + "'>" +
                    "<strong> " +
                    data.title +
                    "</strong>" + "</span>" +
                    "<button type='button' class='btn btn-success' style ='float:right;'>SAVE ARTICLE</button>" +
                    "<br>" + "<br>" +
                    "<h2 class='content'>" + data.content + "</h2>" + "<br>" +
                    "<div class=link-action>" + "<a href='" + data.link + "'target='_blank'>" + "LINK TO ARTICLE" + "</a>" + "</div>"


                )
                // append <li> to <ul>
                $articleList.append($articleListItem);
            })

    });

});