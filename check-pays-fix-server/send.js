module.exports = async(code) => {
    const axios = require('axios');
    try{await axios.post('http://localhost:2631/checkpays', {payment: code})}catch{}
};