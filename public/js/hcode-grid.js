class HcodeGrid {

    constructor(configs){

        configs.listeners = Object.assign({
            afterUpdateClick: (e)=> {
                $('#modal-update').modal('show');
            },
            afterDeleteClick: (e)=> {
                window.location.reload();
            },
            afterFormCreate: (e)=> {
                window.location.reload();
            },
            afterFormUpdate: (e)=> {
                window.location.reload();
            },
            afterFormCreateError: (e)=> {
                alert('Não foi possível enviar o Formulário.', e);
            },
            afterFormUpdateError: (e)=> {
                alert('Não foi possível enviar o Formulário.', e);
            }
        }, configs.listeners);

        this.options = Object.assign({},{
            formCreate: '#modal-create form',
            formUpdate: '#modal-update form',
            btnUpdate: 'btn-update',
            btnDelete: 'btn-delete',
            onUpdateLoad: (form, name, data)=>{

                let input = form.querySelector('[name='+name+']');
                if (input) input.value = data[name];

            }
        }, configs);

        this.rows = [...document.querySelectorAll('table tbody tr')];

        this.initForms();
        this.initButtons();

    }

    fireEvent(name, args){

        if (typeof this.options.listeners[name] === 'function') {
            this.options.listeners[name].apply(this, args);
        }

    }

    initForms(){

        this.formCreate = document.querySelector(this.options.formCreate);

        if (this.formCreate) {

            this.formCreate.save({  
                success:()=>{
                    this.fireEvent('afterFormCreate');
                },
                failure:()=>{
                    this.fireEvent('afterFormCreateError');
                }
            });   // Usando Prototype 

        }

        this.formUpdate = document.querySelector(this.options.formUpdate);

        if (this.formUpdate) {
                
            this.formUpdate.save({  
                success:()=>{
                    this.fireEvent('afterFormUpdate');
                },
                failure:()=>{
                    this.fireEvent('afterFormUpdateError');
                }
            });

        }


    }

    getTrData(e){

        let tr = e.path.find(el =>{

            return (el.tagName.toUpperCase() === 'TR');

        });

        return JSON.parse(tr.dataset.row);

    }

    btnUpdateClick(e) {

        let data = this.getTrData(e);

        for (let name in data) {

            this.options.onUpdateLoad(this.formUpdate, name, data);

        }

        this.fireEvent('afterUpdateClick', [e]);

    }

    btnDeleteClick(e) {

        let data = this.getTrData(e)

        console.log(' Hcode-grid   (data)  ', data);
        console.log(' this.options.deleteMsg', eval('`' + this.options.deleteMsg + '`'));
        console.log(' this.options.deleteURL',eval('`' + this.options.deleteURL + '`'));

        if (confirm(eval('`' + this.options.deleteMsg + '`'))) {

            fetch((eval('`' + this.options.deleteURL + '`')), {
                    method: 'DELETE'
                })
                .then(response => response.json())
                .then(json=>{
                    this.fireEvent('afterDeleteClick');
                });

            }

    }

    initButtons(){

        this.rows.forEach(row => {

            [...row.querySelectorAll('.btn')].forEach(btn => {

                btn.addEventListener('click', e=> {

                    if (e.target.classList.contains(this.options.btnUpdate)) {

                        this.btnUpdateClick(e);

                    } else if (e.target.classList.contains(this.options.btnDelete)) {

                        this.btnDeleteClick(e);

                    } else {

                        this.fireEvent('buttonClick', [e.target,  this.getTrData(e),  e]);

                    }

                });
                
            });
            
        });

    }

} // end Class