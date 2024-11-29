// Arrays
let YugiData = [];
// Elemente für die Buttons und die Frage
let gameQuestionElement = "";
let leftCard = "";
let rightCard = "";
let leftButton;
let equalButton;
let rightButton;
let score = 0;
let currentQuestionIndex = -1;
let lastQuestionIndex = -1;
let selectedQuestionType = "all";
let questions = [
    "Does the right Cards <b>Name</b> have more, equal or less <b>charakters</b>?",
    "Does the right Card have more, equal or less <b>atk</b>?",
    "Does the right Card have more, equal or less <b>def</b>?",
    "Does the right Card have more, equal or less <b>level</b>?",
    "Does the right Card have earlier,equal or later <b>release Date</b>?"
]

// Variables
const URL_BASE_API = "https://db.ygoprodeck.com/api/v7/cardinfo.php?&misc=yes"

// init
async function init() {

    showLoadingScreen();
    await GetNameArrayFromApi();
    loadRandomCards();
    setGlobalvariables();
    setQuestion();
    hideLoadingScreen();
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

function setGlobalvariables() {
    gameQuestionElement = document.getElementById('game-question');
    leftButton = document.getElementById('left-button');
    equalButton = document.getElementById('equal-button');
    rightButton = document.getElementById('right-button');
    document.getElementById("question-select").addEventListener("change", (event) => {
        selectedQuestionType = event.target.value;
        console.log(`Selected question type: ${selectedQuestionType}`);
    });
}

// API response
async function getYugiIndex() {
    let response = await fetch(URL_BASE_API);
    return responseToJson = await response.json();

}

// Get API Data
async function GetNameArrayFromApi() {
    let yugiResponse = await getYugiIndex();

    createYugiArray(yugiResponse.data.length);
    for (let index = 0; index < yugiResponse.data.length; index++) {
        const yugiDetails = YugiData[index];
        const ApiDetails = yugiResponse.data[index];
        yugiDetails.name = ApiDetails.name;
        yugiDetails.atk = ApiDetails.atk;
        yugiDetails.def = ApiDetails.def;
        yugiDetails.level = ApiDetails.level;
        yugiDetails.type = ApiDetails.type;
        yugiDetails.date = ApiDetails.misc_info[0]?.tcg_date;
        yugiDetails.imageBig = ApiDetails.card_images[0].image_url;
    }
    YugiData = YugiData.filter(card =>
        card.date !== undefined &&
        card.type !== 'Spell Card' &&
        card.type !== 'Trap Card' &&
        card.type !== 'Link Monster' &&
        card.type !== 'Skill Card'
    );

}

// Make own array as dummy
function createYugiArray(count) {
    YugiData = [];
    for (let index = 0; index < count; index++) {
        YugiData.push({ "id": index + 1, "type": "", "imageSmall": "", "imageBig": "", "name": "", "date": "", "level": 0, "atk": 0, "def": 0, })
    }
}

function showLoadingScreen() {
    const loadingscreen = document.getElementById('spinner-overlay');
    loadingscreen.style.display = 'flex';
}

function hideLoadingScreen() {
    const loadingscreen = document.getElementById('spinner-overlay');
    loadingscreen.style.display = 'none';
}

function adjustOverlay() {
    const overlays = document.querySelectorAll('.card-overlay');

    overlays.forEach(overlay => {
        const cardImage = overlay.nextElementSibling; 
        if (cardImage.complete) {
            const overlayHeight = cardImage.clientHeight * 0.2;
            overlay.style.height = `${overlayHeight}px`;
        } else {
            cardImage.onload = () => {
                const overlayHeight = cardImage.clientHeight * 0.2;
                overlay.style.height = `${overlayHeight}px`;
            };
        }
    });
}

function loadRandomCards() {
    // Karten aus dem Array holen
    leftCard = YugiData[getRandomInt(YugiData.length)];
    rightCard = YugiData[getRandomInt(YugiData.length)];
    // Bilder und Daten setzen
    document.getElementById("left-image").src = leftCard.imageBig;
    document.getElementById("left-image").alt = leftCard.name;
    document.getElementById("release-left").innerHTML = leftCard.date;
    document.getElementById("right-image").src = rightCard.imageBig;
    document.getElementById("right-image").alt = rightCard.name;

}

function setQuestion() {
    // Prüfen, ob eine spezifische Frage ausgewählt wurde
    if (selectedQuestionType === "all") {
        // Zufällige Frage aus allen Fragen auswählen
        do {
            currentQuestionIndex = getRandomInt(questions.length);
        } while (currentQuestionIndex === lastQuestionIndex); // Keine Wiederholung
    } else {
        // Spezifische Frage basierend auf dem Dropdown auswählen
        const questionMapping = {
            nameLength: 0,
            atk: 1,
            def: 2,
            level: 3,
            releaseDate: 4
        };
        currentQuestionIndex = questionMapping[selectedQuestionType];
    }

    // Frage anzeigen
    lastQuestionIndex = currentQuestionIndex; // Aktualisiere letzte Frage
    gameQuestionElement.innerHTML = questions[currentQuestionIndex];
}

function checkAnswer(buttonParam) {
    let answer = false;
    switch (buttonParam) {
        case "less": answer = checkAnswerForLess(); break;
        case "equal": answer = checkAnswerForEqual(); break;
        case "greater": answer = checkAnswerForGreater(); break;
    }
    displayAnswer(answer);
    disabledButtons(true);
}

function checkForRightAnswer() {
    if (checkAnswerForLess()) {
        return currentQuestionIndex != 4 ? "less" : "earlier";
    } else if (checkAnswerForEqual()) {
        return "equal"
    } else {
        return currentQuestionIndex != 4 ? "higher" : "later";
    }
}

function displayAnswer(bool) {
    const rightCardOverlayTop = document.getElementById("top-overlay");
    const rightCardOverlayBottom = document.getElementById("bottom-overlay");
    const scoreText = document.getElementById("score");
    const releaseText = document.getElementById("release-right");

    gameQuestionElement.innerHTML = bool ? "Correct" : "Wrong " + checkForRightAnswer();
    document.getElementById("next-button").innerHTML = `<button class="game-button" onclick="nextQuestion()">Next</button>`;
    if (bool) {
        gameQuestionElement.classList.add("c-green");
    } else {
        gameQuestionElement.classList.add("c-red");
        score = 0;
    }
    scoreText.innerHTML = score + " points";
    releaseText.innerHTML = rightCard.date;
    rightCardOverlayTop.classList.add("d-none");
    rightCardOverlayBottom.classList.add("d-none");
}

function hideAnswer() {
    const rightCardOverlayTop = document.getElementById("top-overlay");
    const rightCardOverlayBottom = document.getElementById("bottom-overlay");
    const releaseText = document.getElementById("release-right");
    releaseText.innerHTML = `xxxx-xx-xx`;
    rightCardOverlayTop.classList.remove("d-none");
    rightCardOverlayBottom.classList.remove("d-none");
    gameQuestionElement.classList.remove("c-green");
    gameQuestionElement.classList.remove("c-red");
    document.getElementById("next-button").innerHTML = "";
}

function disabledButtons(bool) {
    leftButton.disabled = bool;
    equalButton.disabled = bool;
    rightButton.disabled = bool;
}

function nextQuestion() {
    hideAnswer();
    moveCardsAndLoadNew();
    setQuestion();
    disabledButtons(false);
}

function setScore(bool) {
    if (bool) {
        score++;
        return true;
    } else {
        return false;
    }
}

function checkAnswerForLess() {
    switch (currentQuestionIndex) {
        case 0: return setScore(leftCard.name.length > rightCard.name.length);
        case 1: return setScore(leftCard.atk > rightCard.atk);
        case 2: return setScore(leftCard.def > rightCard.def);
        case 3: return setScore(leftCard.level > rightCard.level);
        case 4: return setScore(leftCard.date > rightCard.date);
        default:
            break;
    }
}

function checkAnswerForEqual() {
    switch (currentQuestionIndex) {
        case 0: return setScore(leftCard.name.length == rightCard.name.length);
        case 1: return setScore(leftCard.atk == rightCard.atk);
        case 2: return setScore(leftCard.def == rightCard.def);
        case 3: return setScore(leftCard.level == rightCard.level);
        case 4: return setScore(leftCard.date == rightCard.date);
        default:
            break;
    }
}

function checkAnswerForGreater() {
    switch (currentQuestionIndex) {
        case 0: return setScore(leftCard.name.length < rightCard.name.length);
        case 1: return setScore(leftCard.atk < rightCard.atk);
        case 2: return setScore(leftCard.def < rightCard.def);
        case 3: return setScore(leftCard.level < rightCard.level);
        case 4: return setScore(leftCard.date < rightCard.date);
        default:
            break;
    }
}



function moveCardsAndLoadNew() {

    const leftCardImage = document.getElementById("left-image");
    const rightCardImage = document.getElementById("right-image");



    // Neue Karte für die rechte Seite auswählen
    leftCard = rightCard;
    rightCard = YugiData[Math.floor(Math.random() * YugiData.length)];

    // Die rechte Karte übernimmt die linke Position
    leftCardImage.src = leftCard.imageBig;
    leftCardImage.alt = leftCard.name;
    document.getElementById("release-left").innerHTML = leftCard.date;

    // Neue Karte für die rechte Seite laden
    rightCardImage.src = rightCard.imageBig;
    rightCardImage.alt = rightCard.name;
    // document.getElementById("release-right").innerHTML = rightCard.date;
}
