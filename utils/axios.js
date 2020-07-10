"use strict";
const axios = require("axios");

const get = async (url) => {
    
  return new Promise(async (resolve, reject) => {
    try {
      let response = await axios.get(url);
      resolve(response);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

module.exports = { get };
