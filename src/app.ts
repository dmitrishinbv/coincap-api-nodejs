import * as express from "express";
import * as request from "request";


const app = express();
const port = 3000;
const host = 'localhost';
const coincapHost = 'http://api.coincap.io';

app.get('/', (req, res) => {
    res.send('Welcome to coincap-api-nodejs!');
});


app.get('/rates', (req, res) => {

    if (!Object.keys(req.query).length) {
        request(
            coincapHost + '/v2/rates/',
            (err, response) => {
                if (err) return res.status(500).send({message: err});
                return res.json({data: JSON.parse(response.body)})
            }
        )

    } else if (Object.keys(req.query).length && req.query.currency) {
        request(
            coincapHost + '/v2/rates/' + req.query.currency,
            (err, response) => {
                if (err) return res.status(500).send({message: err});
                const data = JSON.parse(response.body);

                if (data.data && data.data.rateUsd) {
                    return res.json({usd: data.data.rateUsd})
                }

                return res.status(404).send({message: 'Not found'})
            }
        )

    } else {
        return res.status(400).send({message: 'Error: Param \'currency\' is required'})
    }
});


app.listen(port, host, () =>
    console.info(`Server running on : http://localhost:${port}`)
);

module.exports = app;