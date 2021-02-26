const path = require('path');
let conn = require('./db');

module.exports = {

    getMenus(){

        return new Promise((resolve, reject)=>{

            conn.query(`
                SELECT * FROM tb_menus ORDER BY title
                `, (err, results)=>{

                    if (err) {
                    console.log('menus.js > getMenus(): err(', err, ')');    
                    reject(err);
                }
                resolve(results);
            });

        });

    },

    save(fields, files) {

        return new Promise((resolve, reject)=>{

            var splitTest = function (str) {
                return str.split('\\').pop().split('/').pop();
            }
            qPhoto = splitTest(files.photo.path);

            let query, queryPhoto = '' , params = [
                    fields.title,
                    fields.description,
                    fields.price
                ];

            if (files.photo.name) {

                queryPhoto = ',photo = ?';

                fields.photo = `images/${qPhoto}`;

                params.push(fields.photo);

            }

            if (parseInt(fields.id) > 0 ) {

                params.push(fields.id);

                query = `
                    UPDATE tb_menus 
                    SET title = ?,
                        description = ?,
                        price = ?
                        ${queryPhoto}
                    WHERE id = ?
                `;

            } else {

                if (!qPhoto) {
                    reject('Envie a foto do Prato.');
                }

                query = `
                    INSERT INTO tb_menus (title, description, price, photo) 
                    VALUES (?, ?, ?, ?)
                `;

            }

            conn.query(query, params,  (err, results)=>{

                if (err) {
                    console.log('menus.js > save(', fields, files, '): err(', err, ')');
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
                DELETE FROM tb_menus WHERE id = ?
            `, [
                id
            ], (err, results)=>{

                if (err) {
                    console.log('menus.js > delete(', id ,'): err(', err, ')');
                    reject(err);
                } else {
                    resolve(results);
                }
            });

        });
    }

}