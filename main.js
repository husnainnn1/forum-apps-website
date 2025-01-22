module.exports = function(app, appData) {

    // Handle our routes
    app.get('/',function(req,res){
        res.render('index.ejs', appData)
    });

    //about route
    app.get('/about',function(req,res){
        res.render('about-page.ejs', appData);
    });

    //topics route
    app.get('/topics', function(req, res) {
        let sqlquery = "SELECT * FROM topic"; // query database to get all the topics
        //execute sql query
        db.query(sqlquery, (err, result) => {
            //if code doesn't run it'll show this 
            if (err) {
                return console.error(err.message);
            }
            //makes a newData variable
            //combines the current appData and the result of existing topics
            let newData = Object.assign({}, appData, {existingTopics:result});
            console.log(newData)
            //renders this in the topics file
            res.render("topics.ejs", newData)
        });
    });
    //search route for search-topics extension
    app.get('/search',function(req,res){
        res.render("search-topics.ejs", appData);
    });

    //search result for extension search-topics
    app.get('/search-result', function (req, res) {
        //searching in the database
        let sqlquery = `SELECT * FROM topic WHERE topic_name LIKE '%${req.query.keyword}%'`;
        //execute code
        db.query(sqlquery, (err, result) => {
            if(err){
                //if code doesn't run it'll run this 
                return res.redirect("./")
            }
            let newData = Object.assign({}, appData, {existingTopics:result});
            console.log(newData)
            res.render("topics.ejs", newData)
        });
    });

    //new user route 
    app.get('/adduser', function (req,res) {
        res.render('new-user.ejs', appData);
    });   

    //useradded route
    app.post('/useradded', function (req,res) {
        // saving data in database
        let sqlquery = "INSERT INTO user(full_name, username, email) VALUES (?,?,?)";
        // execute sql query
        let newrecord = [req.body.name, req.body.username, req.body.email];
        db.query(sqlquery, newrecord, (err, result) => {
            //if code doesn't run it'll show this 
            if (err) {
            return console.error(err.message);
        }
        else {
            //sends this to the html page when /useradded is run
            res.send(' This user is added to database, Name: '+ req.body.name + ' Username: '+ req.body.username + ' Email: ' + req.body.email);
        }
        });
    }); 

    //users list route
    app.get('/users', function(req, res) {
        let sqlquery = "SELECT * FROM user"; // query database to get all the users
        //execute sql query
        db.query(sqlquery, (err, result) => {
            //if code doesn't run it'll show this 
            if (err) {
                return console.error(err.message);
            }
            //makes a newData variable
            //combines the current appData and the result of existing users
            let newData = Object.assign({}, appData, {existingUsers:result});
            console.log(newData)
            //renders this in the list file
            res.render("users.ejs", newData)
        });
    });

    // Add a New Post page
    app.get("/addpost", function (req, res) {
        // Set the initial values for the form
        let initialvalues = { username: "", topic: "", title: "", content: "" };
        // Pass the data to the EJS page and view it
        return renderAddNewPost(res, initialvalues, "");
    });

    // Helper function to
    function renderAddNewPost(res, initialvalues, errormessage) {
        let data = Object.assign({}, appData, initialvalues, {
            errormessage: errormessage,
        });
        console.log(data);
        res.render("newpost-page.ejs", data);
        return;
    }


    // Add a New Post page form handler
    app.post("/newpostadded", function (req, res) {
    let user_id = -1;
    let topic_id = -1;

    // Get the user id from the user name
    let sqlquery = `SELECT * FROM user WHERE username = ?`;
    db.query(sqlquery, [req.body.username], (err, result) => {
        if (err) {
        return console.error(err.message);
        }
        if (result.length == 0) {
            return renderAddNewPost(res, req.body, "Can't find that user");
        }
        user_id = result[0].user_id;
        console.log("user is " + user_id);

      // Get the topic id from the topic title
      sqlquery = `SELECT * FROM topic WHERE topic_name = ?`;
      db.query(sqlquery, [req.body.topic], (err, result) => {
        if (err) {
          return console.error(err.message);
        }
        if (result.length == 0) {
          return renderAddNewPost(res, req.body, "Can't find that topic");
        }
        topic_id = result[0].topic_id;
        console.log("topic is " + topic_id);

        // Check the user is a member of the topic
        sqlquery = `SELECT COUNT(*) as countmembership FROM membership WHERE user_id=? AND topic_id=?;`;
        db.query(sqlquery, [user_id, topic_id], (err, result) => {
            if (err) {
                return console.error(err.message);
            }
            if (result[0].countmembership == 0) {
                return renderAddNewPost(
                  res,
                  req.body,
                  "User is not a member of that topic"
                );
            }

            // Everything is in order so insert the post
            sqlquery = `CALL add_post (now(), ?, ?, ?, ?)`;
            let newrecord = [req.body.title, req.body.content, user_id, topic_id];
            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                    return console.error(err.message);
                } else res.send("Your post has been added to forum");
            });
        });
      });
    });
  });

    // View Posts page
    app.get("/viewposts", function (req, res) {
        let sqlquery = "SELECT * FROM posts";
        // Run the query
        db.query(sqlquery, (err, result) => {
            if (err) {
                return res.redirect("./");
            }
            // Pass results to the EJS page and view it
            let data = Object.assign({}, appData, { posts: result });
            console.log(data);
            res.render("existing-posts.ejs", data);
        });
    });

    //search for posts
    app.get("/search-posts", function (req, res) {
        res.render("search-posts.ejs", appData);
    });

    //form handler for existing-posts
    app.get("/search-posts-results", function (req, res) {
        //searching in the database
        let term = "%" + req.query.keywordposts + "%";
        let sqlquery = `SELECT * FROM posts WHERE post_title LIKE '${term}'`;
    
        db.query(sqlquery, [term, term], (err, result) => {
          if (err) {
            return res.redirect("./");
          }
    
          let data = Object.assign({}, appData, { posts: result });
          console.log(data);
          res.render("existing-posts.ejs", data);
        });
    });

    app.get("/topic/:topicname", (req, res) => {
        let topicname = req.params.topicname;
        let sqlquery = `SELECT * FROM topics WHERE topic_name LIKE '${topicname}'`;
    
        // Run the query
        db.query(sqlquery, (err, result) => {
          if (err) {
            return res.redirect("./");
          }
    
          // Pass results to the EJS page and view it
          let data = Object.assign({}, appData, { forumName: 'Forum Flow', posts: result });
          console.log(data);
          res.render("existing-posts.ejs", data);
        });
    });

};