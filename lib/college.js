const axios = require('axios');
const API = 'https://api.data.gov/ed/collegescorecard/v1/schools.json';
const KEY = 'yxVBwWELlQzwCh9rMciyEQK92F40am06o1oW6iKL';

exports.getCollegeById = (id) => {
  return axios.get(API, {
    params: {
      api_key: KEY,
      fields: 'id,school,location,latest',
      per_page: 1,
      id,
    }
  }).then(
    ({ data }) => {
      return data.results[0];
    },
    e => {
      console.log(e.response.data);
      throw new Error(e.response.data.errors[0].message);
    }
  )
};

exports.searchByName = (query) => {
  return axios.get(API, {
    params: {
      api_key: KEY,
      'school.name': query,
      fields: 'id,school.name',
      per_page: 10
    }
  }).then(({ data }) => data.results);
};
