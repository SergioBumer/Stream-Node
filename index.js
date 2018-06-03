//Propiedades del server en Node.
var express = require('express');
var app = express();
//Manejo de rutas
var path = require('path');
//Streaming
var mediaserver = require('mediaserver');
//Carga de archivos
var multer = require('multer');
//Acceder a archivos de la computadora
var fs = require('fs');
//Definicion de las opciones del multer
var opciones_multer = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'canciones'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
//Generación de las propiedades de carga de canciones
var upload = multer({ storage: opciones_multer });
//Uso de main.js
app.use(express.static('public'));
//Uso de Jquery
app.use('/jquery', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));
//Carga de archivo HTML
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});
//Obtención de las canciones en el archivo JSON Microservicio
app.get('/canciones', function (req, res) {
    fs.readFile(path.join(__dirname, 'canciones.json'), 'utf8', function (err, canciones) {
        if (err) throw err;
        res.json(JSON.parse(canciones));


    })
});
//Reproduccion de las canciones Microservicio
app.get('/canciones/:nombre', function (req, res) {
    var cancion = path.join(__dirname, 'canciones', req.params.nombre);
    console.log(req.params.nombre);
    mediaserver.pipe(req, res, cancion);
});
//Carga de las canciones al servidor Microservicio
app.post('/canciones', upload.single('cancion'), function (req, res) {
    var archivoCanciones = path.join(__dirname, 'canciones.json');
    var nombre = req.file.originalname;
    fs.readFile(archivoCanciones, 'utf8', function (err, archivo) {
        if (err) throw err;
        var canciones = JSON.parse(archivo);
        canciones.push({ nombre: nombre });
        console.log(canciones);
        fs.writeFile(archivoCanciones, JSON.stringify(canciones), function (err) {
            if (err) throw err;
            res.sendFile(path.join(__dirname, '/index.html'));
        });
    });
});
//Puerto y reproduccion del microservicio.
app.listen(3000, function () {
    console.log('Aplicación corriendo');
});