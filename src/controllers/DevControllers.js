const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

//index:  lista  desenvolvedores
//show: unico desenvolvedor 
//store: Criar 
//update: Alterar 
//destroy: Deletar

module.exports = {
    
    async index(request, response){
        const devs = await Dev.find();

        return response.json(devs);
    },

    async store(request, response) {
        //console.log(request.body);
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_username });

        if (!dev) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
        
            //console.log(apiResponse.data);
        
            const { name = login, avatar_url, bio } = apiResponse.data;
        
            const techsArray = parseStringAsArray(techs);
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };
        
                dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            })

            //filtrar as conexões que estão há no máximo 10 km de distância
            // e que o novo dev tenha pelo menis um das tecnologias filtradas
            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray,
            )

            sendMessage(sendSocketMessageTo, 'new-dev', dev);
        }
     
        
        //console.log(name, avatar_url, bio, github_username);
     
        return response.json(dev);
     }, 
};