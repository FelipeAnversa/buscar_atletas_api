import axios from "axios";

const api = axios.create({
    baseURL: "https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p="
});

export default api