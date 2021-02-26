var conn = require('./../inc/db');
var menus = require('./../inc/menus');
var emails = require('./../inc/emails');
var reservations = require('./../inc/reservations');
var contacts = require('./../inc/contacts');
var express = require('express');
var router = express.Router();

module.exports = function(io){

  /* GET home page. */
  router.get('/', function(req, res, next) {

    menus.getMenus().then(results =>{

      res.render('index', {
        title: 'Restaurante Saboroso!',
        menus: results,
        isHome: true
      });

    });

  });

  router.get('/contacts', function(req, res, next){

    console.log('>>>>   router.get(/contacts, req=', req);

    contacts.render(req, res);

  });

  router.post('/contacts', function(req, res, next){

    console.log('>>>>   router.post(/contacts, req=', req);

    if (!req.body.name) {
        contacts.render(req, res, "Digite seu Nome");
    } else if (!req.body.email) {
        contacts.render(req, res, "informe um E-mail para contato!");
    } else if (!req.body.message) {
        contacts.render(req, res, "Digite sua Mensagem!");
    } else {
      
        console.log('>router.post>>>  req.body(', req.body);

        contacts.save(req.body).then(results =>{

          console.log('>router.post>>>       contacs.save(', req.body,') results(', results);

          req.body = {};

          io.emit('dashboard update',': save: contacts');

          contacts.render(req, res, null ,"Mensagem enviada com sucesso!");

      }).catch(err=>{

        console.log('>router.post>>>       contacs.save(', req.body,') reject(', err);

          contacts.render(req, res, err.message);

      });

    }

  });

  router.get('/services', function(req, res, next){

    res.render('services', {
        title: 'Serviços >Restaurante Saboroso!',
        background: 'images/img_bg_1.jpg',
        h1: 'É um prazer poder servir!'
      });

  });

  router.get('/menus', function(req, res, next){

    menus.getMenus().then(results=>{

      res.render('menus', {
          title: 'Menus >Restaurante Saboroso!',
          background: 'images/img_bg_1.jpg',
          h1: 'Saboreie nosso menu!',
          menus: results
        });

    });

  });

  router.get('/reservations', function(req, res, next){

    reservations.render(req, res, "", "");

  });

  router.post('/reservations', function(req, res, next){

    console.log(' index.js >router.post/reservations >>>  req.body(', req.body);

    if (!req.body.name) {
        reservations.render(req, res, "Digite seu Nome");
    } else if (!req.body.email) {
        reservations.render(req, res, "informe um E-mail para contato!");
    } else if (!req.body.people) {
        reservations.render(req, res, "informe o número de pessoas!");
    } else if (!req.body.date) {
        reservations.render(req, res, "informe a Data da Reserva!");
    } else if (!req.body.time) {
        reservations.render(req, res, "informe o horário da Reserva!");
    } else {

      reservations.save(req.body).then(results=>{

        req.body = {};
        io.emit('dashboard update',': save: reservations');
        reservations.render(req, res, null ,"Reserva realizada com sucesso!");

      }).catch(err=>{

        reservations.render(req, res, err.message);

      });

    }

  });

  router.post("/subscribe", function(req, res, next){

    emails.save(req).then(results=>{
      io.emit('dashboard update',': save: subscribe');
      res.send(results);

    }).catch(err=>{

      res.send(err);

    });

  });

  
  return router;

};
