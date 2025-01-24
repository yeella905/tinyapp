const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser()); // Make sure you have cookie-parser available
// Placeholder for user data storage
// const users = {};
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
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "user1ID" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "user2ID" }
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
    // Use user_id to find the user in the registered users
    const userId = req.cookies["user_id"];
    const user = usersregistered[userId];

    if (user) {
        // If user exists, render the page they should see
        console.log(urlDatabase); // Log to check if data is as expected
    const templateVars = { 
      urls: urlDatabase, 
      user: user
      // usersregistered[req.cookies["user_id"]] 
    };
        res.render("urls_index", templateVars);
    } else {
      // Redirect or render a different page if no username is found
      res.redirect('/login'); // Redirecting to a login page, for instance
    }
  });

  app.get("/urls/new", (req, res) => {
    const userId = req.cookies["user_id"];
    const user = usersregistered[userId];
    if (user) {
        res.render("urls_new", { user });
    } else {
      // Redirect or render a different page if no username is found
      res.redirect('/login'); // Redirecting to a login page, for instance
    }
  });
  
 app.get("/urls/:id", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = usersregistered[userId];
  const id = req.params.id;
  const longURL = urlDatabase[id]; // Correctly retrieve longURL using the provided id

  if (!longURL) {
    return res.status(404).send('URL not found or does not exist!');
  }

  // Pass all necessary variables into the template

  const templateVars = { id, longURL, user };
  console.log('Template Vars:', templateVars);
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
  

app.get("/register", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = usersregistered[userId];
  if (user) {
    res.redirect('/urls');
  }
  const templateVars = { user };
  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = usersregistered[userId];
  if (user) {
    res.redirect('/urls');
  }
  const templateVars = { user };
  res.render("login", templateVars);
});


  app.post("/hello", (req, res) => { //req is when the user goes to /hello //res is when you're
    const templateVars = { greeting: "Hello World!" , intro: "hi"}; //template variable should match the varible inside the ejs file
    res.render("hello_world", req.query); //rendering ejs files or showing the outout that's storing in the ejs file. looks for the file in qutation marks.
  
  });

  app.post("/urls", (req, res) => {
    const longURL = req.body.longURL; // Extract the long URL from the request body
    const shortID = generateRandomString(6); // Generate a random string for the URL slug
  
    urlDatabase[shortID] = { longURL: longURL, userID: req.cookies["user_id"] }; // Store in the database
  
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
    urlDatabase[shortURL] = { longURL: newLongURL, userID: req.cookies["user_id"] }; // Assuming 'urlDatabase' is where URLs are stored
    res.redirect('/urls');
  });

  app.post("/urls/:id/edit", (req, res) => {
    console.log(req.body); // Log the entire body object
    const shortURL = req.params.id;
    const newLongURL = req.body.longURL;
  
   // Update the URL object
   if (urlDatabase[shortURL]) { // Optional: check if shortURL exists
    urlDatabase[shortURL].longURL = newLongURL; // Update the longURL only
   }
    // Redirect back to the list or a success page
    res.redirect("/urls");
  });

  //cookie section 
// Example POST route for logging in
app.post('/login', (req, res) => {
    const { email, password } = req.body;

     // Check if the user exists
    for (const userId in usersregistered) {
      const user = usersregistered[userId];

      if (user.email === email) {
        if (user.password === password) {
        // Successful login: Set user_id cookie and redirect
        res.cookie('user_id', userId);  // Set the user_id cookie
        return res.redirect('/urls');
      } else {
        // Email found but password incorrect
        return res.status(403).send('login failed, password or email not found.');
      }
    }
  }

    res.status(401).send('Login failed');
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id'); // Clear the 'user_id' cookie
  res.redirect('/urls'); // Redirect the browser back to the /urls page after setting the cookie
});

// Declare the usersregistered object at a global scope level
const usersregistered = {
  userRandomID: {
    id: "user1",
    email: "user1@example.com",
    password: "456",
  },
  user2RandomID: {
    id: "user2",
    email: "user2@example.com",
    password: "123",
  },
  
};

//function to get user email
function getUserByEmail(email) {
  for (let userId in usersregistered) {
    if (usersregistered[userId].email === email) {
      return usersregistered[userId]; // Return the user object if found
    } 
  }
  return null; // Return null if no user is found
}

// Registration handler
app.post("/register", (req,res) => {

  const { email, password } = req.body;

  // Check for empty fields
  if (!email || !password) {
    return res.status(400).send('Email and password cannot be empty.');
  }

  if (password) {
    console.log("***");
  }
  // Use the helper function to see if the email already exists
  const existingUser = getUserByEmail(email);

  if (existingUser) {
    return res.status(400).send('Email already registered.');

  }


//1.generate user id from the function gererateRandomid
const newUserId = generateRandomid(6);

//2. Add the new users to the "userre"
usersregistered[newUserId] = {
  id: newUserId,
  email: email,
  password: password  //best practice to hash password
}
// 3. Set a cookie with the user ID
res.cookie("user_id", newUserId);
console.log(usersregistered);
  res.redirect('/urls');  // Redirect to the URLs page after successful registration

});


function generateRandomid(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomid = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomid += characters[randomIndex];
    
  }

  return randomid;
}

app.post("/login", (req,res) => {
  const { email, password } = req.body;

 // Look for the user with the given email
  for (let userId in usersregistered) {
    const user = usersregistered[userId];

    // Check if user exists with given email
    if (user.email === email) {

      // Validate the password
      if (user.password === password) {
        // Set the user_id cookie and redirect on success
        res.cookie("user_id", userId);
        return res.redirect('/urls');
      } else {
        // Respond with 403 if the password does not match
        return res.status(403).send('Password does not match');
      }
    }
  }

  // Respond with 403 if the email is not found
  return res.status(403).send('Email not found');
});
//test
//all the api 
  //.get(only for display)
  //.post(to create or update)
  //.put(to create or update but mostly for updating)
  //.patch (partial updates, updating existing resources)
  //.delete (to delete)

  //parsing 
 
 