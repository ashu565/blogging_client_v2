import axios from "axios";
const url = "http://127.0.0.1:3000";
// const url = "https://blogger414.herokuapp.com";
const instance = axios.create({
  baseURL: url,
});

export default instance;