const express = require('express');
const cors = require('cors');
require('dotenv').config();
const simsonpsRouter = require('./routes/simsonps');

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        
        this.basePath = '/api/v1';
        this.simsonpsPath = `${this.basePath}/simsonps`;

        this.middlewares();
        this.routes();
    }
    middlewares(){
        this.app.use(cors());
        this.app.use(express.json());
    }
    routes (){
        this.app.use(this.simsonpsPath, simsonpsRouter);
    }
    listen(){
        this.app.listen(this.port, () =>{
            console.log('listening on port ${this.port}');
        });
    }
}
module.exports = Server;