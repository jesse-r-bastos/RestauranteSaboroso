class HcodeFileReader {

    constructor(inputEl, imgEL) {

        this.inputEl = inputEl;
        this.imgEL = imgEL;

        this.initInputEvent();

    }

    initInputEvent() {

        document.querySelector(this.inputEl).addEventListener('change', e=>{

            this.reader(e.target.files[0]).then(result =>{

                document.querySelector(this.imgEL).src = result;

            });

        });

    }

    reader(file) {

        return new Promise((resolve, reject)=>{

            let reader = new FileReader();

            reader.onload = function () {

                resolve(reader.result);

            }

            reader.onerror = function () {

                reject('HcodeFileReader:  reader.onerror >> Não foi possível ler a imagem.');
                
            }

            reader.readAsDataURL(file);

        });

    }

}