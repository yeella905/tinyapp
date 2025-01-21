const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser()); // Make sure you have cookie-parser available
// Placeholder for user data storage
const users = {};
const PORT = 8080; // default port 8080
const a = 1;

app.listen(PORT, () => { //what port the server should run on
  console.log(`Example app listening on port ${PORT}!`);
});
//function to form the short url
function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }
  
  return randomString;
}

app.set("view engine", "ejs"); //in this server the html rendering engine is going ot be ejs
//"view engine" is the html viewing engine

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  });

  app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
  });

  app.get("/set", (req, res) => {
    res.send(`a = ${a}`); //sending data to user so the site loads and user sees an output
  });
  
  app.get("/fetch", (req, res) => {
    res.send(`a = ${a}`);
  });

  //fetching 
  app.get("/urls", (req, res) => {
    const templateVars = { urls: urlDatabase,
      username: req.cookies.username
     };
    res.render("urls_index", templateVars);
  });


  app.get("/urls/new", (req, res) => {
    const username = req.cookies['username'];
    if (username) {
      // Pass the username to your EJS template
      res.render("urls_new", { username });
    } else {
      // Redirect or render a different page if no username is found
      res.redirect('/login'); // Redirecting to a login page, for instance
    }
  });
  
 app.get("/urls/:id", (req, res) => {
    const username = req.cookies['username']; // Use quotes for the cookie name
    const id = req.params.id;
    const longURL = urlDatabase[id]; // Retrieve longURL using the short URL ID

    const templateVars = { id, longURL, username };
    res.render("urls_show", templateVars);
  });

  app.get("/u/:id", (req, res) => {
    const { id } = req.params;
    const longURL = urlDatabase[id]; // Assuming urlDatabase is your database object
  
    if (longURL) {
      res.redirect(longURL);
    } else {
      res.status(404).send('Short URL not found!');
    }
  });

  app.get('/someRoute', (req, res) => {
    let username = req.cookies['username']; // Adjust 'username' to your cookie's key
    res.render('your_template', { username: username });
  });
  
//to display the username on display
app.get("/urls", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    // ... any other vars
  };
  res.render("urls_index", templateVars);
});


app.get("/register", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    // ... any other vars
  };
  res.render("register", templateVars);
});



  app.post("/hello", (req, res) => { //req is when the user goes to /hello //res is when you're
    const templateVars = { greeting: "Hello World!" , intro: "hi"}; //template variable should match the varible inside the ejs file
    res.render("hello_world", req.query); //rendering ejs files or showing the outout that's storing in the ejs file. looks for the file in qutation marks.
  
  });

  app.post("/urls", (req, res) => {
    const longURL = req.body.longURL; // Extract the long URL from the request body
    const shortID = generateRandomString(6); // Generate a random string for the URL slug
  
    urlDatabase[shortID] = longURL; // Store in the database
  
    res.redirect(`/urls/${shortID}`); // Redirect to the new URL page
  });
 

  app.post('/urls/:id/delete', (req, res) => {
    const id = req.params.id;
    delete urlDatabase[id]; // Assuming urlDatabase is your database object
    res.redirect('/urls');
  });

  
  app.post('/urls/:id', (req, res) => {
    const shortURL = req.params.id;
    const newLongURL = req.body.longURL; // Ensure 'longURL' matches the form input's name attribute
    urlDatabase[shortURL] = newLongURL; // Assuming 'urlDatabase' is where URLs are stored
    res.redirect('/urls');
  });

  //cookie section 
// Example POST route for logging in
app.post('/login', (req, res) => {
    // Capture the username from the request body
    const username = req.body.username;

    // Set a cookie named 'username' with the value submitted in the form
    res.cookie('username', username);

    // Redirect the browser back to the /urls page after setting the cookie
    res.redirect('/urls');
});

app.post('/logout', (req, res) => {

  res.clearCookie('username'); // Clear the 'username' cookie

  // Redirect the browser back to the /urls page after setting the cookie
  res.redirect('/urls');
});


app.post("/register", (req,res) => {

  const { email, password } = req.body;

    // Check if the email has already been registered
  if (users[email]) {
    return res.status(400).send('Email already registered.');
  } 
   // Hash the password and store User (consider using bcrypt for hashing in a real app)
   users[email] = { email, password };

  res.redirect('/urls');  // Redirect to the URLs page after successful registration

});


//all the api 
  //.get(only for display)
  //.post(to create or update)
  //.put(to create or update but mostly for updating)
  //.patch (partial updates, updating existing resources)
  //.delete (to delete)

  //parsing 