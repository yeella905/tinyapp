const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const a = 1;

app.set("view engine", "ejs"); //in this server the html rendering engine is going ot be ejs
//"view engine" is the html viewing engine

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello!");
}); //app.get (API ROUTES)

app.listen(PORT, () => { //what port the server should run on
  console.log(`Example app listening on port ${PORT}!`);
});

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

  app.get("/urls", (req, res) => {
    const templateVars = { urls: urlDatabase };
    res.render("urls_index", templateVars);
  });

  app.post("/hello", (req, res) => { //req is when the user goes to /hello //res is when you're
    const templateVars = { greeting: "Hello World!" , intro: "hi"}; //template variable should match the varible inside the ejs file
    res.render("hello_world", req.query); //rendering ejs files or showing the outout that's storing in the ejs file. looks for the file in qutation marks.
  
  });

  app.get("/urls/new", (req, res) => {
    res.render("urls_new");
  });

 app.get("/urls/:id", (req, res) => {
    const id = req.params.id;
    const longURL = urlDatabase[id]; // Retrieve longURL using the short URL ID

    const templateVars = { id, longURL };
    res.render("urls_show", templateVars);
  });

//all the api 
  //.get(only for display)
  //.post(to create or update)
  //.put(to create or update but mostly for updating)
  //.patch (partial updates, updating existing resources)
  //.delete (to delete)

/**
*@param {}
*@param {}
*@return {}
*/