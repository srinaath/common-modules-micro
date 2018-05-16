const axios = require("axios");

class HTTPClient {
    constructor(accessToken=null, subscriptionKey) {
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': subscriptionKey,
            'Chipotle-CorrelationId': 'DD-alexa-' + new Date().toISOString()
        }

        if (accessToken) {
            headers.Authorization = accessToken
        }

        this.client = axios.create({
            baseURL: process.env.BASE_URL,
            timeout: 30000,
            headers: headers
        });
        console.log('ProcessEnv', process.env.BASE_URL);

        this.getEnvVar = () => {
            return process.env.BASE_URL;
        }

        if (process.env.TIME_REQUESTS === "true") {
            var startTime = null;

            // Add a request interceptor
            this.client.interceptors.request.use(function (config) {
                console.log('Starting Request', config);
                startTime = new Date().getTime();
                return config;
            }, function (error) {
                // Do something with request error
                return Promise.reject(error);
            });

            // Add a response interceptor
            this.client.interceptors.response.use(function (response) {
                // Do something with response data
                var endTime = new Date().getTime();
                console.log('Request time:', Math.abs((endTime - startTime) / 1000));
                return response;
            }, function (error) {
                // Do something with response error
                var endTime = new Date().getTime();
                console.log('Request time:', Math.abs((endTime - startTime) / 1000));
                return Promise.reject(error);
            });
        }
    }
}

module.exports = HTTPClient;