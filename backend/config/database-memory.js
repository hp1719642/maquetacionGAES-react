const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongod;

const connectDB = async () => {
    try {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        
        await mongoose.connect(uri);
        console.log('✅ MongoDB Memory Server Connected');
        console.log('📚 Base de datos en memoria funcionando');
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;