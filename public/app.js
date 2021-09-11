let app = {

    //**ATTRIBUTS**/

    resultTrue : 0,
    resultFalse : 0,
    arrayQuestionsFalse : [],

    gameContainer : document.querySelector("#game_container"),
    buttonPlay : document.querySelector('#button_play'),
    eventPlay : document.querySelector('#event_play'),
    nextBtn : document.querySelector('#next_btn'),
    resultBtn : document.querySelector('#result_btn'),
    retryBtn : document.querySelector('#retry_btn'),

    //**INITIALISATION**/

    init : () => {
        app.buttonPlay.addEventListener('click', app.play);
        app.nextBtn.addEventListener('click', app.nextQuestion);
        app.resultBtn.addEventListener('click', app.getResult);
    },

    //**METHODES**/

    //mélange des questions
    shuffle : (array) => {
        let currentIndex = array.length, temporaryValue, randomIndex;
        //Tableau non vide
        while (0 !== currentIndex) {
            //Récup un élément
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            //Mélange
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    },

    //lancement du jeu
    play : () => {
        app.buttonPlay.classList.add('d-none');
        app.eventPlay.classList.remove('d-none');
        app.createGame(0);
    },

    //création du template du jeu
    createGame : (idQuestion) => {
        //question
        let question = quizzList[idQuestion].question;
        app.createGameTemplate(idQuestion, question);
        //réponses
        let answersLength = quizzList[idQuestion].answers.length;
        for(let answerNumber = 0; answerNumber < answersLength; answerNumber++) {
            app.createAnswerTemplate(quizzList[idQuestion].answers[answerNumber].answer, answerNumber);
        }
    },

    //ajout de la question dans le template
    createGameTemplate : (idQuestion, question) => {
        let gameTemplate = document.querySelector("#game_template");
        //clonage
        let cloneTemplateGame = document.importNode(gameTemplate.content, true);
        app.gameContainer.appendChild(cloneTemplateGame);
        let gameQuestion = document.querySelector('#game_question');
        //insertion des valeurs
        gameQuestion.innerText = question;
        gameQuestion.value = idQuestion;
    },

    //ajout des réponses de la question sélectionnée
    createAnswerTemplate : (answer, answerNumber) => {
        let answerContainer = document.querySelector('#answer_container');
        let answerTemplate = document.querySelector("#answer_template");
        //clonage
        let cloneTemplateAnswer = document.importNode(answerTemplate.content, true);
        answerContainer.appendChild(cloneTemplateAnswer);
        //identification unique de la réponse
        let answerItem = document.querySelector('.answer_item');
        answerItem.classList.add('answer_item_'+ answerNumber);
        answerItem.classList.remove('answer_item');
        let answerItemValue = document.querySelector('.answer_item_'+ answerNumber);
        //insertion des valeurs
        answerItemValue.innerText = answer;
        answerItemValue.value = answerNumber;

        answerItemValue.addEventListener('click', app.checkAnswer);
    },

    //vérification de la réponse cliquée
    checkAnswer : (evt) => {
        let answerId = evt.target.value;
        let gameQuestion = document.querySelector('#game_question');
        //si la question est à "true" dans le tableau quizz
        if (quizzList[gameQuestion.value].answers[answerId].correct) {
            app.resultTrue++;
        } else {
            app.arrayQuestionsFalse.push(quizzList[gameQuestion.value].question);
            app.resultFalse++;
        }
        
        evt.target.classList.add('bg-secondary');
        //rendre le clic impossible sur toutes les réponses
        app.removeAllAnswersListeners();
        //retrait de la question dans le tableau afin de ne plus pouvoir la poser
        app.removeQuestion(gameQuestion.value);
        if(quizzList.length !== 0) {
            //s'il reste des questions à poser
            app.nextBtn.classList.remove('d-none');
        } else {
            app.resultBtn.classList.remove('d-none');
        }
    },

    //retrait des listener sur les réponses
    removeAllAnswersListeners : () => {
        let listAnswerSelector = document.querySelectorAll('.event_remove');
        listAnswerSelector.forEach(element => 
            element.removeEventListener('click', app.checkAnswer)
        );
    },

    //retrait de la question dans le tableau quizz
    removeQuestion : (randomQuestionId) => {
        quizzList.splice(randomQuestionId, 1);
    },

    //question suivante
    nextQuestion : () => {
        app.nextBtn.classList.add('d-none');
        app.gameContainer.innerText = ""
        app.createGame(0);
    },

    //lorsqu'il n'y a plus de questions à poser
    getResult : () => {
        app.resultBtn.classList.add('d-none');
        app.gameContainer.innerText = "";
        app.createResultTemplate();
        let showCorrects = document.querySelector("#show_corrects");
        let showErrors = document.querySelector("#show_errors");
        showCorrects.innerText = app.resultTrue;
        showErrors.innerText = app.resultFalse;
        //liste des questions à afficher dans le tableau erreur
        let questionsFalse = document.querySelector('#questions_false');
        app.arrayQuestionsFalse.forEach(element => app.addQuestionItemForResult(element, questionsFalse),);
    },
    
    //template du résultat
    createResultTemplate : () => {
        let resultTemplate = document.querySelector("#result_template");
        let cloneTemplateResult = document.importNode(resultTemplate.content, true);
        app.gameContainer.appendChild(cloneTemplateResult);
        app.retryBtn.classList.remove('d-none');
    },

    //rajout de chaque question dans une nouvelle balise "li" pour le tableau des résultats
    addQuestionItemForResult : (element, questions) => {
        let newLiTag = document.createElement("li");
        newLiTag.classList.add('list-group-item', 'fst-italic', 'li_style');
        newLiTag.appendChild(document.createTextNode(element));
        questions.appendChild(newLiTag);
    },
}

//équivalent: quizzList : [...quizz];
let quizzList = app.shuffle([].concat(quizz));

app.init();
