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

// Function to generate an ID for new users (aliasing generateRandomString)
const generateRandomid = (length) => generateRandomString(length);

  // Export all functions at once
  module.exports = {
    getUserByEmail,
    generateRandomString,
    urlsForUser,
    generateRandomid
  };
