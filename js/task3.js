const questions = [
    {
        question: "Если человека назвали мордофиля, то это…",
        options: [
            {text: "Значит, что он тщеславный", isCorrect: true},
            {text: "Значит, что у него лицо как у хряка", isCorrect: false},
            {text: "Значит, что чумазый", isCorrect: false}
        ],
        explanation: "Ну зачем же вы так... В Этимологическом словаре русского языка Макса Фасмера поясняется, что мордофилей называют чванливого человека. Ну а «чванливый» — это высокомерный, тщеславный"
    },
    {
        question: "«Да этот Ярополк — фуфлыга!» Что не так с Ярополком?",
        options: [
            {text: "Он маленький и невзрачный", isCorrect: true},
            {text: "Он тот еще алкоголик", isCorrect: false},
            {text: "Он не держит свое слово", isCorrect: false}
        ],
        explanation: "Точно! Словарь Даля говорит, что фуфлыгой называют невзрачного малорослого человека. А еще так называют прыщи"
    },
    {
        question: "Если человека прозвали пятигузом, значит, он…",
        options: [
            {text: "Не держит слово", isCorrect: true},
            {text: "Изменяет жене", isCorrect: false},
            {text: "Без гроша в кармане", isCorrect: false}
        ],
        explanation: "Может сесть сразу на пять стульев. Согласно Этимологическому словарю русского языка Макса Фасмера, пятигуз — это ненадежный, непостоянный человек"
    },
    {
        question: "Кто такой шлындра?",
        options: [
            {text: "Бродяга", isCorrect: true},
            {text: "Нытик", isCorrect: false},
            {text: "Обманщик", isCorrect: false}
        ],
        explanation: "Да! В Словаре русского арго «шлындрать» означает бездельничать, шляться"
    }
];

// равновероятно перемешивает массив 
function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
    return array;
}

var current_question = -1;                  // текущий номер вопроса (индексация с 0), -1 - тестирование не началось
var questionsArray = shuffle(questions);    // перемешиваем вопросы
var responded = true;                       // true - вопрос отвечен
var correctAnswered = 0;                    // число правильно отвеченных вопросов

// перемешиваем список ответов для каждого вопроса
for (let i = 0; i < questionsArray.length; i++)
    questionsArray[i].options = shuffle(questionsArray[i].options);

//проверка нажатия на кнопку "Вопрос"
document.getElementById('start').onclick = function() {
    // если на вопрос ответили - можно переходить к следующему
    if (responded)
    {
        responded = false;                  // вопрос не отвечен
        current_question++;                 // текущий вопрос (индексация с 0)

        // изменяем надпись кнопки
        let toChangeButtonText = document.querySelector('button');
        toChangeButtonText.innerHTML = `Вопрос (${current_question + 1}/${questions.length})`;

        showNewQuestion();  // вызов функции, добавляющей на страницу вопрос и варианты ответов
    }
};

function writeQuestion() {
    // получаем текст вопроса, ответы и объяснение для текущего вопроса
    current_element = questionsArray[current_question];

    // выводим на страницу текст вопроса
    let toWriteQuestion = document.getElementById('questions');
    HTMLcommand = `
        <li>
            <div class="text_img">
                <div class="text_block">${current_element.question}</div>
                <div class="img_block"></div>
            </div>
        </li>
    `;
    toWriteQuestion.insertAdjacentHTML('beforeend', HTMLcommand);
}

// вывод вариантов ответа с предварительной очисткой блока
function writeOptions() {
    // получаем список ответов
    let options = current_element.options;

    // очищаем поле для ответов
    document.getElementById('options').innerHTML='';

    // выводим вопросы на страницу
    for (let i = 0; i < options.length; i++)
    {
        let toWriteOption = document.getElementById('options');
        HTMLcommand = `
            <div id="${i}" class="text_block">${current_element.options[i].text}</div>
        `;
        toWriteOption.insertAdjacentHTML('beforeend', HTMLcommand);
    }
}

// выводит на страницу вопрос и ответы к нему
function showNewQuestion() {
    if (current_question < questions.length)
    {
        writeQuestion();
        writeOptions();

        // функция следит за кликами пользователя
        document.getElementById('options').addEventListener("click", (e) => {
            // пользователь нажал на блок, находящийся в контейнере для вопросов
            if (e.target.className=="text_block")
            {
                // выбрали ответ впервые
                if (responded==false)
                {
                    // "трясём" выбранный ответ
                    trembling(e.target);

                    // получаем список всех ответов
                    let answers = document.querySelectorAll('.right_block .text_block');
                    let nodes = document.querySelectorAll('.left_block .text_img .img_block');
                    let toShowPicture = nodes[nodes.length - 1];
                    
                    // для каждого ответа устанавливаем анимацию согласно заданию
                    answers.forEach((div, id) => { 
                        // анимация срабатывает для каждого ответа через 0-200 мс
                        setTimeout(() => {
                            animateOption(e, div, id, toShowPicture) ;
                        }, Math.random()*200);                    
                    });
                }

                // текущий вопрос отвечен
                responded = true;
            }
        });
    } else 
        theEnd();

}

function animateOption(e, div, id, toShowPicture) {
    if (e.target.id == id)
        {
            if (questionsArray[current_question].options[e.target.id].isCorrect)
            {
                div.classList.add('scalling');
                div.insertAdjacentHTML('beforeend',' <br> <br>' + questionsArray[current_question].explanation);
                toShowPicture.classList.add('like');
                correctAnswered++;

                // исчезновение ответа
                div.classList.add('correct');
            }
            else 
            {
                toShowPicture.classList.add('dislike');
                div.classList.add('uncorrect');
                div.classList.add('moving_opacity');
            }
        } else
            // остальные случаи 
            div.classList.add('moving_opacity');
}

// "трясёт" элемент в течение 0.15 секунды
function trembling(elem) {
    var id = setInterval(anim, 10);
    var pos = 1;
    var iteration = 0;
    function anim() {
        elem.style.left = `${pos}px`;
        pos *= -1;
        iteration++;
        if (iteration == 15) clearInterval(id);
    }
}

function theEnd() {
    let toChangeButtonText = document.querySelector('button');
    // меняем текст кнопки
    toChangeButtonText.innerHTML = `Вопросы кончились`;
    // отключаем кнопку
    toChangeButtonText.setAttribute("disabled", "disabled");
    // на вопрос нельзя ответить
    responded=true;

    document.getElementById('options').innerHTML='';

    let toShowStatistic = document.querySelector('.result');
    toShowStatistic.innerHTML = `Вы ответили правильно на ${correctAnswered} из ${questions.length}`;

    let questionClick = document.querySelector('.left_block');
    questionClick.addEventListener("click", (e) => {
        let questionNumber;
        for (let i = 0; i < questions.length; i++)
            if (questions[i].question == e.target.innerHTML) 
                {
                    questionNumber = i;
                    break;
                }
        
        // получаем верный ответ для конкретного вопроса
        let correctAnswer = "";
        for (let option of questions[questionNumber].options)
        {
            if (option.isCorrect)
            {
                correctAnswer = option.text;
                break;
            }
        }

        // в случае, если верный ответ не найден, ничего не происходит
        if (correctAnswer != "")
        {
            document.getElementById('options').innerHTML='';

            let toWriteOption = document.getElementById('options');
            HTMLcommand = `
                <div class="text">${correctAnswer}</div>
            `;
            toWriteOption.insertAdjacentHTML('beforeend', HTMLcommand);
        }
    });
}