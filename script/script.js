// сделал рендер карт из массива для более удобного редактирования вопросов
// можно реализовать еще добавление из базы данных или что бы вопросы хранились где то на сервере,что бы пользователь не мог их просмотреть
const questions = [
    {
        question: "Что такое операционная система?",
        answers: [
            "Это просто программа на компьютере, как и другие - Word или Chrome",
            "Это показатель того, какой процессор используется на компьютере. Например, 32-битный или 64-битный",
            "Это набор взаимосвязанных программ, осуществляющих управление компьютером и взаимодействие с пользователем",
            'Нет такого понятия, есть понятие "файловая система"'
        ],
        correctIndex: 2
    },
    {
        question: "Является ли Android операционной системой?",
        answers: [
            "Да, это такая же ОС, как и другие, просто для мобильных девайсов",
            "Нет, операционные системы бывают только для ПК",
            "Нет, Android это программа, которая ставится на операционную систему девайса. ОС на разных девайсах разные",
            'Это домашняя страничка в настройках вашего браузера'
        ],
        correctIndex: 0
    },
    {
        question: "Что такое процессор компьютера?",
        answers: [
            "Это блок, внутри которого находится дисковод и много разъемов для монитора, клавиатуры и компьютерной мышки",
            "Это общее название всех комплектующих компьютера",
            "Это элемент компьютера, с помощью которого обрабатывается информация, находящаяся как в собственной памяти, так и в памяти других устройств",
            'Это суммарный показатель вычислительной мощности компьютера, например 2,7 ГГц'
        ],
        correctIndex: 2
    },
    {
        question: "Какие бывают разрядности у современных процессоров?",
        answers: [
            "32 и 64 бита",
            "12 и 32 бита",
            "15 и 32 бита",
            '86 и 64 бита'
        ],
        correctIndex: 0
    },
    {
        question: "Какой тип процессора чаще всего используют мобильные девайсы?",
        answers: [
            "iOS использует Intel, остальные используют AMD",
            "Чаще всего используют Intel",
            "Чаще всего используют AMD",
            'Чаще всего используют ARM'
        ],
        correctIndex: 3
    },
    {
        question: "Для чего компьютеру нужна RAM?",
        answers: [
            "Для быстрого доступа к данным",
            "Для долгосрочного хранения данных",
            "Для правильной фрагментации памяти",
            'Для дефрагментации данных'
        ],
        correctIndex: 0
    },
    {
        question: "Чем отличается HDD от SSD?",
        answers: [
            "HDD - это твердотельный накопитель без подвижных частей. Более дешевый, чем SSD. HDD работает быстрее",
            "HDD - это твердотельный накопитель без подвижных частей. Более дорогой, чем SSD. HDD работает быстрее",
            "SSD - это твердотельный накопитель без подвижных частей. Более дешевый, чем HDD. SSD работает быстрее",
            'SSD - это твердотельный накопитель без подвижных частей. Более дорогой, чем HDD. SSD работает быстрее"'
        ],
        correctIndex: 3
    },
    {
        question: "Как отличаются между собой USB?",
        answers: [
            "Бывают только USB 2.0 и 3.2",
            "Бывают только micro-USB и mini-USB",
            "USB отличаются по пропускной способности (micro-USB, mini-USB, lightning и т.д.) и форме (USB 2.0, USB 3.2)",
            'USB отличаются по форме (micro-USB, mini-USB, lightning и т.д.) и пропускной способности (USB 2.0, USB 3.2)'
        ],
        correctIndex: 3
    },
    {
        question: "Какой файловой системы не существует?",
        answers: ["Fat", "NTFS", "APFS", 'BolSFS'],
        correctIndex: 3
    }
];


const totalQuestions = questions.length;
let currentQuestionIndex = 0;
let results = [];
let wrongAnswersCount = 0;
//функция перемешивания 
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

shuffleArray(questions);

// инициализация полосы прогресса 
function initializeProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    progressBar.style.width = '0%';
    progressText.textContent = 1;
    //отображение количетсва слайдов для progressBar
    const progressSlideText = document.getElementById('progress__slide-text');
    progressSlideText.textContent = questions.length;
}
//функция отвечающая за показ вариантов ответа 
function showQuestion() {
    const question = questions[currentQuestionIndex];
    document.querySelector('.question').textContent = question.question;

    const answersContainer = document.getElementById('answers-container');
    const shuffledAnswers = shuffleArray([...question.answers]);
    const correctAnswerIndex = shuffledAnswers.indexOf(question.answers[question.correctIndex]);

    answersContainer.innerHTML = shuffledAnswers.map((answer, index) => `
        <div class="test__answer">
            <input type="radio" name="answer" id="answer${index}" value="${index}">
            <label for="answer${index}">${answer}</label>
        </div>
    `).join('');

    // передаем shuffledAnswers и correctAnswerIndex в обработчик
    document.querySelectorAll('input[name="answer"]').forEach(radio => {
        radio.addEventListener('change', () => {
            const selectedAnswer = getSelectedAnswer();
            if (selectedAnswer !== null) {
                document.querySelectorAll('input[name="answer"]').forEach(r => r.disabled = true);
                processAnswer(selectedAnswer, correctAnswerIndex, shuffledAnswers);
            }
        });
    });
}



// получения правильного ответа 
function getSelectedAnswer() {
    const checkedAnswer = document.querySelector('input[name="answer"]:checked');
    return checkedAnswer ? parseInt(checkedAnswer.value) : null;
}

// проверка ответов и обновление элементов 
function processAnswer(userAnswerIndex, correctAnswerIndex, shuffledAnswers) {
    const isCorrect = userAnswerIndex === correctAnswerIndex;
    const userAnswer = shuffledAnswers[userAnswerIndex]; 
    console.log(userAnswer)

    if (!isCorrect) wrongAnswersCount++;

    results.push({ question: questions[currentQuestionIndex].question, isCorrect, userAnswer });


    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    progressText.textContent = `${Math.min(currentQuestionIndex + 2, totalQuestions)}`;

    currentQuestionIndex++;
    setTimeout(() => currentQuestionIndex < questions.length ? showQuestion() : showResults(), 1000);
}
// показ результатов теста
function showResults() {
    const testBlock = document.querySelector('.test');
    const answerBlock = document.querySelector('.answer');

    testBlock.classList.remove('active');
    answerBlock.classList.add('active');

    const correctCount = results.filter(result => result.isCorrect).length;
    let title, message, messageCaption;

    switch (correctCount) {
        case totalQuestions: title = "Поздравляем!"; message = "Вы правильно ответили на все вопросы!"; messageCaption = "Вы действительно отлично разбираетесь в IT!"; break;
        case 0: title = "Упс :("; message = "Вы неправильно ответили на все вопросы."; messageCaption = "Нужно подучить теорию."; break;
        default: title = "Хороший результат!"; message = `Вы ответили правильно на ${correctCount} вопрос(ов).`; messageCaption = "Так держать!";
    }

    answerBlock.innerHTML = `
        <h2>${title}</h2>
        <p>${message}</p>
        <p>${messageCaption}</p>
        ${generateResultsBreakdown(results)}
        <button class="answer__button">Пройти еще раз</button>
    `;

    const answerButton = answerBlock.querySelector('.answer__button');

    // Добавляем класс "active", если есть хотя бы один неправильный ответ
    if (wrongAnswersCount > 0) {
        answerButton.classList.add('active');
    }

    answerButton.addEventListener('click', restartQuiz);
}
// перезапуск теста
function restartQuiz() {
    currentQuestionIndex = 0;
    wrongAnswersCount = 0;
    results = [];

    const testBlock = document.querySelector('.test');
    const answerBlock = document.querySelector('.answer');

    testBlock.classList.add('active');
    answerBlock.classList.remove('active');
    shuffleArray(questions);
    initializeProgressBar();
    showQuestion();
}
// получение блоков с ответами
function generateResultsBreakdown(results) {
    return results.map((result, index) => {
        const question = questions[index];
        return `
            <div class="answer__block ${result.isCorrect ? 'correct' : 'incorrect'}">
                <h3 class="answer__title">${question.question}</h3>
                <p class="answer__text">${result.userAnswer}</p>
            </div>`;
    }).join('');
} 

initializeProgressBar();
showQuestion();