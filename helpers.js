// Helper function to get user by email
const getUserByEmail = (email, database) => {
for (const user in database) {
{ if (database[user].email === email) {
return database[user];
}
} }
return undefined;
};

//function to generate a random string of specified length
const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
    }
    
    return randomString;
  }

// Function to return URLs for a specific user
const urlsForUser = (id, urlDatabase) => { //id represents the current login user
  const userUrls = {};
  for (let urlId in urlDatabase) {
    if (urlDatabase[urlId].userID === id) {
      userUrls[urlId] = urlDatabase[urlId];
    }
  }
    return userUrls;
};


  //function to gereate an id for new users
const generateRandomid = (email, database) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomid = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomid += characters[randomIndex];
      
    }
    return randomid;
  };


  // Export all functions at once
  module.exports = {
    getUserByEmail,
    generateRandomString,
    urlsForUser,
    generateRandomId
  };

// //function to get user email
// function getUserByEmail(email) {
//     for (let userKey in usersregistered) {
//       const user = usersregistered[userKey];
//       if (user.email === email) {
//       return user;
//       } 
//     }
//     return null; // Return null if no user is found
//   }

// //function to form the short url
// function generateRandomString(length) {
//     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     let randomString = '';
    
//     for (let i = 0; i < length; i++) {
//       const randomIndex = Math.floor(Math.random() * characters.length);
//       randomString += characters[randomIndex];
//     }
    
//     return randomString;
//   }
  
// function urlsForUser(id) { //id represents the current login user
//     const userUrls = {};
  
//     for (let urlId in urlDatabase) {
//       if (urlDatabase[urlId].userID === id) {
//         userUrls[urlId] = urlDatabase[urlId];
//       }
//     }
//     return userUrls;
//   }

// //function to gereate an id for new users
// function generateRandomid(length) {
//     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     let randomid = '';
    
//     for (let i = 0; i < length; i++) {
//       const randomIndex = Math.floor(Math.random() * characters.length);
//       randomid += characters[randomIndex];
      
//     }
//     return randomid;
//   };