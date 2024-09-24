const jsonServer = require('json-server');
const middleware = jsonServer.defaults();
const server = jsonServer.create();

server.use(middleware);
server.use(jsonServer.bodyParser);

const deliveryData = require('./data/delivery');

server.get('/api/delivery', (req, res, next) => {
    res.status(200).send(deliveryData.getDeliveries);
});

server.listen('3000', () => {
    console.log('JSON server listening on port 3000');
});