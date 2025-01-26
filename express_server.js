const cookieSession = require('cookie-session')
const express = require("express");
const app = express();
// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

const bcrypt = require("bcryptjs");
const PORT = 8080; // default port 8080

//for cookie-session
app.set('trust proxy', 1) // trust first proxy
//for cookie-session
app.use(cookieSession({
  name: 'session',
  keys: ['your-secret-key1', 'your-secret-key2'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.listen(PORT, () => { //what port the server should run on
  console.log(`Example app listening on port ${PORT}!`);
});

//getUserByEmail function
const { getUserByEmail } = require('./helpers.js');

//function to form the short url
const { generateRandomString } = require('./helpers.js');

//function to return urls that were UserID is equal to the Id of current user
const { urlsForUser } = require('./helpers.js');

//function to generate an id for new users
const { generateRandomid } = require('./helpers.js');

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

app.set("view engine", "ejs"); //in this server the html rendering engine is going ot be ejs
//"view engine" is the html viewing engine

const urlDatabase = {
  "b2xVn2": { 
    longURL: "http://www.lighthouselabs.ca", 
    userID: "userRandomID" 
  },
  "9sm5xK": { 
    longURL: "http://www.google.com", 
    userID: "user2RandomID" }
};

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  });

  app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
  });


  //fetching 
  app.get("/urls", (req, res) => {
    // Use user_id to find the user in the registered users
    const userId = req.session.user_id; // Use req.session to get the user_id
    const user = usersregistered[userId];

    
  console.log("Viewing URLs - User ID from cookie: ", userId);
  console.log("Viewing URLs - User found: ", user);
    if (user) {
        console.log(urlDatabase); // Log to check if data is as expected
    // Fetch URLs for the logged-in userid
    const userUrls = urlsForUser(userId);
    const templateVars = { 
      urls: userUrls,  // Only the URLs belonging to the logged-in user
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
    const userId = req.session.user_id; // Use req.session to get the user_id
    const user = usersregistered[userId];
    if (user) {
        res.render("urls_new", { user });
    } else {
      // Redirect or render a different page if no username is found
      res.redirect('/login'); // Redirecting to a login page, for instance
    }
  });
  
 app.get("/urls/:id", (req, res) => {
  const userId = req.session.user_id; // Use req.session to get the user_id
  const user = usersregistered[userId];
  const id = req.params.id;
  const longURL = urlDatabase[id].longURL; // Correctly retrieve longURL using the provided id

  if (!user) {
    // If no user is logged in
    return res.status(403).send('You need to be logged in to view URLs.');
  }

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
    const longURL = urlDatabase[id].longURL; 
  
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
  const userId = req.session.user_id; // Use req.session to get the user_id
  const user = usersregistered[userId];

  // Log user and cookie status
  console.log("Register page - User ID from cookie: ", userId);
  console.log("Register page - User found: ", user);

  if (user) {
    console.log("Redirecting to /urls from register (already logged in).");
    res.redirect('/urls');
  }
  const templateVars = { user };
  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  const userId = req.session.user_id; // Use req.session to get the user_id
  const user = usersregistered[userId];

   // Log user and cookie status
   console.log("Login page - User ID from cookie: ", userId);
   console.log("Login page - User found: ", user);

  if (user) {
  console.log("Redirecting to /urls from login (already logged in).");
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
  
    urlDatabase[shortID] = { longURL: longURL, userID: req.session.user_id }; // Store in the database
  
    res.redirect(`/urls/${shortID}`); // Redirect to the new URL page
  });

  app.post('/urls/:id/delete', (req, res) => {
    const userId = req.session.user_id; // Use req.session to get the user_id
    const id = req.params.id;

    //checks for if ID exist
    if (!urlDatabase[id]) {
      return res.status(404).send('ID does not exist.');
    }

    // Check if the user is logged in
    if (!userId) {
      return res.status(404).send('You need to be logged in.');
    }

    // Check if the URL belongs to the logged-in user
    if (urlDatabase[id].userID !== userId) {
      return res.status(403).send('You do not have permission to edit this URL.');
    } 

    // Delete the URL if all checks pass
    delete urlDatabase[id];
    res.redirect('/urls');
  });

  app.post('/urls/:id', (req, res) => {
    const userId = req.session.user_id; // Use req.session to get the user_id
    const shortURL = req.params.id;
    const newLongURL = req.body.longURL; // Ensure 'longURL' matches the form input's name attribute
    urlDatabase[shortURL] = { longURL: newLongURL, userID: req.session.user_id }; // Assuming 'urlDatabase' is where URLs are stored

    // Check if the URL ID exists in the database
    if (!urlDatabase[shortURL]) {
     return res.status(404).send('URL not found.');
    }
    // Check if the user is logged in
    if (!userId) {
      return res.status(403).send('You need to be logged in.');
    }

    // Check if the URL belongs to the logged-in user
    if (urlDatabase[shortURL].userID !== userId) {
      return res.status(403).send('You do not have permission to edit this URL.');
    } 

    // Update the URL if all checks pass
    urlDatabase[shortURL].longURL = newLongURL;

    res.redirect('/urls');
  });

  app.post("/urls/:id/edit", (req, res) => {
    const userId = req.session.user_id; // Use req.session to get the user_id
    console.log(req.body); // Log the entire body object
    const shortURL = req.params.id;
    const newLongURL = req.body.longURL;
  
    // Check if the URL ID exists in the database
    if (!urlDatabase[shortURL]) {
     return res.status(404).send('URL not found.');
    }
    // Check if the user is logged in
    if (!userId) {
      return res.status(403).send('You need to be logged in.');
    }

    // Check if the URL belongs to the logged-in user
    if (urlDatabase[shortURL].userID !== userId) {
      return res.status(403).send('You do not have permission to edit this URL.');
    } 

   // Update the URL object
   if (urlDatabase[shortURL]) { // Optional: check if shortURL exists
    urlDatabase[shortURL].longURL = newLongURL; // Update the longURL only
   }
    // Redirect back to the list or a success page
    res.redirect("/urls");
  });

app.post('/logout', (req, res) => {
  req.session.user_id = null; // Clear the user_id from the session
  res.redirect('/urls'); // Redirect the browser back to the /urls page after setting the cookie
});

// Registration handler
app.post("/register", (req,res) => {

  const { email, password } = req.body;

  // Check for empty fields
  if (!email || !password) {
    return res.status(400).send('Email and password cannot be empty.');
  }

  // Use the helper function to see if the email already exists
  const existingUser = getUserByEmail(email, usersregistered);
  if (existingUser) {
    return res.status(400).send('Email already registered.');
  }

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10); // adjust as necessary

  // Generate a unique random ID for the new user
  let newUserId;
  do {
    newUserId = generateRandomid(6); //use function to generate random id
  } while (usersregistered[newUserId]); // Ensure the ID is unique

//2. Add the new users to the "user"
usersregistered[newUserId] = {
  id: newUserId,
  email: email,
  password: hashedPassword   //best practice to hash password
}
// 3. Set a cookie with the user ID
req.session.user_id = newUserId;
console.log(usersregistered);
  res.redirect('/urls');  // Redirect to the URLs page after successful registration
});

// Manually hash passwords for existing users in development
usersregistered['userRandomID'].password = bcrypt.hashSync('456', 10);
usersregistered['user2RandomID'].password = bcrypt.hashSync('123', 10);

// Example POST route for logging in
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Log incoming request data
  console.log('Login attempt with email:', email);

  // Use the getUserByEmail function to find the user
  const user = getUserByEmail(email, usersregistered);

    // Log the user object for debugging
    console.log('Found user:', user);

 // Check if the user was found using the helper function
    if (user) {
  
    // Log password comparison attempt
      console.log('Comparing password for user:', user.email);

      // If email exists, compare passwords
      if (bcrypt.compareSync(password, user.password)) {
        // Find the correct key in the usersregistered object
        const userIdKey = Object.keys(usersregistered).find(key => usersregistered[key].email === email);

        if (userIdKey) {
        req.session.user_id = userIdKey; // Correct assignment to use userIdKey
        console.log('Login successful for user:', user.email);
        return res.redirect('/urls');
      } else {
        console.log('Login failed: UserID key not found.');
        return res.status(500).send('Login failed: Internal error.');
      }
   } else {
     console.log('Login failed: Incorrect password for user:', user.email);
     return res.status(403).send('Login failed: Password is incorrect.');
   }
 }

 console.log('Login failed: Email not found.');
 return res.status(403).send('Login failed: Email not found.');
});

  //.get(only for display)
  //.post(to create or update)
  //.put(to create or update but mostly for updating)
  //.patch (partial updates, updating existing resources)
  //.delete (to delete)
console.log("Current usersregistered:", usersregistered);
