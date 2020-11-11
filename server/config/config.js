// Puerto

process.env.PORT = process.env.PORT || 3000;


// Entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Vencimiento del Token
process.env.CADUCIDAD_TOKEN = '48h';

// SEED De autenticación

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// Base de datos

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.DB_URL;
}

process.env.URLDB = urlDB;


// Google Client ID

process.env.CLIENT_ID = process.env.CLIENT_ID || '1080061552521-e3k1h3uvso18tcludl9lfh7shl9bv53o.apps.googleusercontent.com';