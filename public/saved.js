$(document).ready(function () {


    // $(document).on("click", ".btn.delete", handleArticleDelete);
    $(document).on("click", ".notes.btn", handleArticleNotes);
    $(document).on("click", ".btn.save", handleNoteSave);
    $(document).on("click", ".btn.note-delete", handleNoteDelete);
    $(document).on("click", ".delete.btn", handleSavedDelete);

    // Grab the articles as a json
    // Run an AJAX request for any unsaved headlines
    $.getJSON("/articles", function (data) {
        // For each note...
        for (var i = 0; i < data.length; i++) {
            var article = data[i];
            // only load unsaved articles
            if (article.saved) {
                // Increase the articleCount (track article # - starting at 1)
                var articleCount = i + 1;

                // Create the list group to contain the article and add the article content for each
                var $articleList = $("<ul class='list-group'>");
                $articleList.attr("data-_id", article._id);


                // Add the newly created element to the DOM
                $("#saved-articles").append($articleList);

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
                    "<button type='button' class='delete btn btn-success' style ='float:right; background-color: red;' >DELECT FROM SAVED</button>" +
                    "<button type='button' class='notes btn btn-success' style ='float:right;' >ARTICLE NOTES</button>" +
                    "<br>" + "<br>" +
                    "<h2 class='content'>" + articleContent + "</h2>" + "<br>" +
                    "<div class=link-action>" + "<a href='" + articleLink + "'target='_blank'>" + "LINK TO ARTICLE" + "</a>" + "</div>"


                )
                // append <li> to <ul>
                $articleList.append($articleListItem);
            }

        };

    });

    function handleArticleNotes(event) {
        // This function handles opening the notes modal and displaying our notes
        // We grab the id of the article to get notes for from the card element the delete button sits inside
        var currentSavedArticle = $(this)
            .parents(".list-group")
            .data();

        console.log(currentSavedArticle);
        // Grab any notes with this headline/article id
        $.get("/articles/" + currentSavedArticle._id).then(function (data) {
            console.log(data)
            // Constructing our initial HTML to add to the notes modal
            var modalText = $("<div class='container-fluid text-center'>").append(
                $("<h4>").text("Notes For Article: " + currentSavedArticle._id),
                $("<hr>"),
                $("<ul class='list-group note-container'>"),
                $("<textarea placeholder='New Note' rows='4' cols='60'>"),
                $("<button class='btn btn-success save'>Save Note</button>")
            );
            console.log(modalText)
            // Adding the formatted HTML to the note modal
            bootbox.dialog({
                message: modalText,
                closeButton: true
            });
            var noteData = {
                _id: currentSavedArticle._id,
                newData: data || []
            };
            console.log('noteData:' + JSON.stringify(noteData))
            // Adding some information about the article and article notes to the save button for easy access
            // When trying to add a new note
            $(".btn.save").data("article", noteData);
            // renderNotesList will populate the actual note HTML inside of the modal we just created/opened
            renderNotesList(noteData);
        });



    }

    function renderNotesList(data) {
        // This function handles rendering note list items to our notes modal
        // Setting up an array of notes to render after finished
        // Also setting up a currentNote variable to temporarily store each note
        var notesToRender = [];
        var currentNote;
        if (!data.newData.note) {
            // If we have no notes, just display a message explaining this
            currentNote = $("<li class='list-group-item'>No notes for this article yet.</li>");
            notesToRender.push(currentNote);
        } else {
            // Constructs an li element to contain our noteText and a delete button
            currentNote = $("<li class='list-group-item note'>")
                .text(data.newData.note.noteText)
                .append($("<button class='btn btn-danger note-delete' style='float:right'>x Delete Notes</button>"));
            // Store the note id on the delete button for easy access when trying to delete
            currentNote.children("button").data("_id", data.newData.note._id);
            // Adding our currentNote to the notesToRender array
            notesToRender.push(currentNote);
        }
        // Now append the notesToRender to the note-container inside the note modal
        $(".note-container").append(notesToRender);
    }



    function handleNoteSave() {
        // This function handles what happens when a user tries to save a new note for an article
        // Setting a variable to hold some formatted data about our note,
        // grabbing the note typed into the input box
        // var noteData;
        var thisId = $(this).data("article")._id;
        var newNote = $(".bootbox-body textarea")
            .val()
            .trim();
        // Run a POST request to change the note, using what's entered in the inputs
        $.ajax({
                method: "POST",
                url: "/articles/" + thisId,
                data: {
                    // Value taken from note textarea
                    noteText: newNote
                }
            })
            // With that done
            .then(function (data) {
                // Log the response
                console.log(data);
                // When complete, close the modal
                bootbox.hideAll();
            });

    }

    function handleNoteDelete() {
        // This function handles the deletion of notes
        // First we grab the id of the note we want to delete
        // We stored this data on the delete button when we created it
        var noteToDelete = $(this).data("_id");
        // Perform an DELETE request to "/api/notes/" with the id of the note we're deleting as a parameter
        $.ajax({
            url: "/api/notes/" + noteToDelete,
            method: "DELETE"
        }).then(function () {
            // When done, hide the modal
            bootbox.hideAll();
        });
    }

    function handleSavedDelete() {
        var articleSaved = $(this)
            .parents(".list-group")
            .data();

        // Remove this article <ul> from page
            $(this)
            .parents(".list-group")
            .remove();

       
        console.log("articleSaved:" +JSON.stringify(articleSaved));
        // Now make an ajax call for the Article
        $.ajax({
                method: "PUT",
                url: "/articles/" + articleSaved._id,
                data: articleSaved
            })

            .then(function (data) {
                console.log(data);
                // If the data was saved successfully
                if (data) {
                    // This will reload the entire list of articles
                    // location.reload();
                }


            })

    }
});