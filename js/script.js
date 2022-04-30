var allAnswers = [];
var allCAnswers = [];
var url = "./dados.json";
window.onload = async function () {

    var size = [window.width,window.height];  //public variable

    $(window).resize(function(){
    window.resizeTo(size[0],size[1]);
    });

    allCorrectAwnsers();
    let actualId = 0;

    $('.container').append('<h1 class="text-center" style="padding-top: 60px;color: white"> Ecnarf Quiz </h1>')
    var app = $("#app")
    app.append('<div class="position-absolute top-50 start-50 translate-middle box" id="box"></div>')
    var box = $("#box")


    // let pTitulo = dados['question'];
    let pTitulo = "A primeira pergunta é:"

    buscaDados(actualId)

    box.append(`<h3 class="text-center" id="enunciado"></h3>`)

    $('#enunciado').html(pTitulo)

    let boxPerguntas = '<div class="list-group"></div>'
    box.append(boxPerguntas);
    box.append('<input type="hidden" id="numero" value="0" />');

    let listPerguntas = ['Resposta 1', 'Resposta 2', 'Resposta 3', 'Resposta 4'];

    listPerguntas.forEach((pergunta, id) => {
        $(".list-group").append(`<div class="answer" id="answer${id}">${pergunta}</div>`)
    })



    box.append('<div class="btns-holder d-grid gap-2 d-sm-flex justify-content-sm-center"></div>');

    let btnProximo = '<button type="button" id="proximo" class="btn btn-success me-sd-2">Proximo</button>'
    $(".btns-holder").append(btnProximo);

    $("#proximo").on("click", (e) => {
        if (actualId < 9) {
            actualId = actualId + 1;
            allAnswers.push($(".selected").text())
            // console.log(allAnswers)
            buscaDados(actualId)
            // if(allAnswers[actualId - 1] == allCAnswers[actualId - 1])
            // console.log(allAnswers[actualId - 1])
            // console.log(tempResult)

        }
        if (actualId == 9) {
            $(e.target).css('display', 'none')
            $("#finalizar").css('display', 'block')
        }
    });

    let btnFinalizar = '<button type="button" id="finalizar" class="btn btn-primary" style="display: none;">Finalizar</button>'
    $(".btns-holder").append(btnFinalizar);

    $("#finalizar").on("click", (e) => {
        //ultima confirmação
        if (actualId >= 9) {
            allAnswers.push($(".selected").text())
            // let resultado = buscaDados(actualId)
            // console.log(resultado)
            let resultF = finalResult()
            box.html("").append('<div class="position-relative box-final"></div>')
            $(".box-final")
            .append('<h2 class="text-center middle" id="enunciado">Parabens, Você concluiu o Quiz!</h2>')
            .append(`<div class="text-center final"> ${resultF} </div>`)
        }
    });

    //    allData(0)
    // app.append('<div class="box">')

    // console.log(app)

}

function allCorrectAwnsers() {

    fetch(url)
        .then((response => {
            if (response.ok) {
                response.json().then(value => {
                    value.results.forEach((element) => {
                        allCAnswers.push(element.correct_answer);
                    })
                })
            } else {
                console.log('A rede não respondeu.');
            }

        }))
}


function nextStep() {

    // $("#numero").val(parseInt($("#numero").attr('value')) +1 )
    let id = parseInt($("#numero").attr('value'))
    // console.log(id);

    allAnswers.push($(".selected").text())

    let correct = allData(id)

    console.log(allAnswers)


    $("#numero").val(id + 1)

    // if( $(".selected").text() == correct){
    //     console.log('correto')
    // }

}

async function buscaDados(actualId) {
    fetch(url)
        .then((response => {
            if (response.ok) {
                response.json().then(value => {

                    let dados = value;

                    let lista;
                    $(".list-group").html("")

                    lista = dados.results[actualId].incorrect_answers;
                    lista.push(dados.results[actualId].correct_answer);

                    lista.sort(() => Math.random() - 0.5)

                    $('#enunciado').html(dados.results[actualId].question)

                    lista.forEach((pergunta, id) => {
                        $(".list-group").append(`<div class="answer" id="answer${id}">${pergunta}</div>`)
                    })

                    $(".answer").on("click", (e) => {
                        let selecionado = $(e.target)
                        let respostas = document.querySelectorAll(".answer")

                        respostas.forEach(element => {
                            if ($(element).hasClass('selected')) {
                                $(element).removeClass("selected")
                            }
                        })

                        selecionado.addClass("selected")

                    })
                    return dados.results[actualId].correct_answer;
                })
            } else {
                console.log('A rede não respondeu.');
            }

        }))
}

function finalResult() {
    let nQuestions = 0;
    let nAnswers = 0;
    allCAnswers.forEach((element) => {
        allAnswers.forEach((resp) => {
            if (element == resp) {
                nAnswers++;
            }
        })
        nQuestions++;
    })
    // console.log(`${nAnswers}/${nQuestions}`);
    return `${nAnswers}/${nQuestions}`;

}
