const crypto = require("crypto");

/**
 * Generate a random string of a given length
 * @param {number} length - The length of the random string
 * @returns {string} - The random string
 */
function generateRandomString(length) {
  if (!length) length = 10;

  const characters = "AaBbCcDdEeFfGgHhKkLlMmNnXxSsQqSsTtUuZz";
  const id = process.pid;
  let string = "";

  for (let i = 0; i < length; i++) {
    string += characters.charAt(Math.floor(Math.random() * characters.length));

    const n = Math.floor(Math.random() * length);
    string += n;
  }

  const randomBuffer = crypto.randomBytes(length);
  const randomString = randomBuffer.toString("hex");

  string += randomString;
  string += Date.now().toString().slice(0, 6);

  string += id;

  return string;
}

module.exports = { generateRandomString };
