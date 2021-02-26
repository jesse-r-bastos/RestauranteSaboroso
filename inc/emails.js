var conn = require('./db');

module.exports = {

    render(req, res, error, success) {

        res.render('emails', {
            title: 'Emails »Restaurante Saboroso!',
            background: 'images/img_bg_3.jpg',
            h1: 'Fale conoscoi!',
            body: req.body,
            error,
            success
            });

    },

    save(req) {

        return new Promise((resolve, reject)=>{

            if (!req.fields.email) {

                reject('Preencha o Email.');

            } else {

                conn.query(`
                INSERT INTO tb_emails (email) VALUES(?)
                `, [
                        req.fields.email
                    ], (err, results)=>{

                        if (err) {
                            reject(err.message);
                        } else {
                            resolve(results);
                        }
                });
            }

        });
            
    },
    
    getEmails(){

        return new Promise((resolve, reject)=>{

            conn.query(`
                SELECT * FROM tb_emails ORDER BY register DESC
                `, (err, results)=>{

                    if (err) { 
                        reject(err);
                    } else {
                        resolve(results);
                    }

            });

        });

    },

    delete(id) {

        return new Promise((resolve, reject)=>{

            conn.query(`
                DELETE FROM tb_emails WHERE id = ?
            `, [
                id
            ], (err, results)=>{

                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });

        });
    }

};