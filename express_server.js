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
    // Use user_id to find the user in the registered users
    const userId = req.cookies["user_id"];
    const user = usersregistered[userId];
    // Pass the user object to the template
    const templateVars = { urls: urlDatabase, user };
    res.render("urls_index", templateVars);
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
  
//to display the username on display
app.get("/urls", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = usersregistered[userId];

  const templateVars = { user };
  res.render("urls_index", templateVars);
});


app.get("/register", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = usersregistered[userId];

  const templateVars = { user };
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
 
    const { email, password } = req.body;
     // Check if the user exists
    for (const userId in usersregistered) {
      const user = usersregistered[userId];
      if (user.email === email && user.password === password) {
        res.cookie('user_id', userId);  // Set the user_id cookie
        return res.redirect('/urls');
      }
    }
    res.status(401).send('Login failed');
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id'); // Clear the 'username' cookie
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

// Registration handler
app.post("/register", (req,res) => {
  const { email, password } = req.body;

  let emailExists = false;
  for (let userId in usersregistered) {
    if (usersregistered[userId].email === email) {
      emailExists = true;
      break;
    }
  }
  
  if (emailExists) {
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


//test
//all the api 
  //.get(only for display)
  //.post(to create or update)
  //.put(to create or update but mostly for updating)
  //.patch (partial updates, updating existing resources)
  //.delete (to delete)

  //parsing 