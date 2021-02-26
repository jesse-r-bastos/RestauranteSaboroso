const { resolveInclude } = require('ejs');
const express = require('express');
const { use } = require('.');
const admin = require('./../inc/admin');
const menus = require('./../inc/menus');
const emails = require('./../inc/emails');
const users = require('./../inc/users');
const contacts = require('./../inc/contacts');
const reservations = require('./../inc/reservations');
const moment = require('moment');
const router = express.Router();

module.exports = function(io) { 

    moment.locale('pt-BR');

    router.use(function(req, res, next){

        if (['/login'].indexOf(req.url) === -1 && !req.session.user) {
            res.redirect('/admin/login');
        } else {
            next();
        }

    });

    router.use(function(req, res, next){

        req.menus = admin.getMenus(req);

        next();

    });

    router.get("/logout", function(req, res, next){

        delete req.session.user;

        res.redirect('/admin/login');

    });

    router.get("/", function(req, res, next){

        admin.dashboard().then(data =>{

            res.render('admin/index', admin.getParams(req, {
                data
            }));

        }).catch(err=>{

            console.error(err);

        });

    });

    router.get('/dashboard', function(req, res, next) {

        reservations.dashboard().then(data=>{

            res.send(data);

        });

    });

    router.post('/login', function(req, res, next) {

        console.log("post/login > email:", req.body.email, " > password:", req.body.password);

        if (!req.body.email){
            users.render(req, res, 'Informe o email!');
        } else if (!req.body.password) {
            users.render(req, res, 'Informe a password!');
        } else {

            users.login(req.body.email, req.body.password).then(user=>{

                req.session.user = user;
                io.emit('dashboard update',': post(/login');
                res.redirect('/admin');

            }).catch(err=>{
                
                users.render(req, res, err.message || err);

            });

        }
        
    });

    router.get("/login", function(req, res, next){

        users.render(req, res, null);

    });

    router.get("/contacts", function(req, res, next){

        contacts.getContacts().then(data=>{

            res.render('admin/contacts', admin.getParams(req, {
                data
            }));

        });

    });

    router.delete('/contacts/:id', function(req, res, next){

        contacts.delete(req.params.id).then(results=>{
            io.emit('dashboard update',': delete: contacts');
            res.send(results);
        }).catch(err=>{
            res.send(err);
        });

    });

    router.get("/emails", function(req, res, next){

        emails.getEmails().then(data=>{

            res.render('admin/emails', admin.getParams(req, {
                data
            }));

        });

    });

    router.delete('/emails/:id', function(req, res, next){

        emails.delete(req.params.id).then(results=>{
            io.emit('dashboard update',': delete: emails');            
            res.send(results);          
        }).catch(err=>{
            res.send(err);
        });

    });

    router.get("/menus", function(req, res, next){

        menus.getMenus().then(data=>{
        
            res.render('admin/menus', admin.getParams(req, {
                data
            }));

        });
        
    });

    router.post("/menus", function(req, res, next){

        menus.save(req.fields, req.files).then(results=>{
            io.emit('dashboard update',': save: menus');
            res.send(results);
        }).catch(err=>{
            res.send(err);
        });
        
    });

    router.delete('/menus/:id', function(req, res, next){

        menus.delete(req.params.id).then(results=>{
            io.emit('dashboard update',': delete: menus');
            res.send(results);           
        }).catch(err=>{
            res.send(err);
        });

    });

    router.delete("/reservations/:id", function(req, res, next){

        reservations.delete(req.params.id).then(results=>{
            io.emit('dashboard update',': delete: reservations');
            res.send(results);           
        }).catch(err=>{
            res.send(err);
        });

    });

    router.get("/reservations", function(req, res, next){

        let start = (req.query.start) ? req.query.start : moment().subtract(1, 'year').format('YYYY-MM-DD');
        let end = (req.query.end) ? req.query.end : moment().format('YYYY-MM-DD');

        reservations.getReservations(req).then(pag=>{

            res.render('admin/reservations', admin.getParams(req, {
                date: {
                    start,
                    end
                },
                data: pag.data,
                moment,
                links: pag.links,
                tPages: pag.totalPages
            }));

        });

    });

    router.get("/reservations/chart", function(req, res, next){

        req.query.start = (req.query.start) ? req.query.start : moment().subtract(1, 'year').format('YYYY-MM-DD');
        req.query.end = (req.query.end) ? req.query.end : moment().format('YYYY-MM-DD');

        reservations.chart(req).then(chartData=>{

            res.send(chartData);

        });

    });

    router.post("/reservations", function(req, res, next){

        console.log(' admin.js >router.post/reservations >>>  req.body(', req.body);

        reservations.save(req.fields, req.files).then(results=>{
            io.emit('dashboard update',': save: reservations');
            res.send(results);          
        }).catch(err=>{
            res.send(err);
        });
        
    });

    router.get("/users", function(req, res, next){

        users.getUsers().then(data =>{

            res.render('admin/users', admin.getParams(req, {
                data
            }));

        });

    });

    router.post("/users", function(req, res, next){

        users.save(req.fields).then(results=>{
            io.emit('dashboard update',': save: users');
            res.send(results);           
        }).catch(err=>{
            res.send(err);
        });

    });

    router.post('/users/password-change', function(req, res, next){

        users.changePassword(req).then(results=>{
            io.emit('dashboard update',': changePassword: users');
            res.send(results);
        }).catch(err=>{
            res.send({
                error: err
            });

        }); 

    });

    router.delete("/users/:id", function(req, res, next){

        users.delete(req.params.id).then(results=>{
            io.emit('dashboard update',': delete: users');
            res.send(results);
        }).catch(err=>{
            res.send(err);
        });

    });

    return router;
};
