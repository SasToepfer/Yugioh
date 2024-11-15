// Arrays
let pokeData = [
];
let filterData = [
];
const typeColors = {
    "normal": '#A8A77A',
    "fighting": '#c22e28',
    "flying": '#a98ff3',
    "poison": '#a33ea1',
    "ground": '#e2bf65',
    "rock": '#b6a136',
    "bug": '#a6b91a',
    "ghost": '#735797',
    "steel": '#B7B7CE',
    "fire": '#ee8130',
    "water": '#6390f0',
    "grass": '#7ac74c',
    "electric": '#f7d02c',
    "psychic": '#f95587',
    "ice": '#96d9d6',
    "dragon": '#6f35fc',
    "dark": '#705746',
    "fairy": '#d685ad',
    "stellar": '#40B5A5',
    "unknown": '#68A090'
};

// Variables
const URL_BASE_API = "https://pokeapi.co/api/v2/"
const maxBaseStat = 255;
let currentAmountOfPokemonDisplayed = 0;
let currentOffset = 0;
let overlayPokemonIndex = 0;
let currentRenderArray = [];
let inputForm = "";

// init
async function init() {
    inputForm = document.getElementById("input-form-id");
    showLoadingScreen();
    await addNextBatchOfPokemonFromAPI(20);
    hideLoadingScreen();
    currentRenderArray = pokeData;
    renderPokeDex();
    inputForm.addEventListener('submit', submitForm);
}

function submitForm(event) {
    event.preventDefault();
}

async function loadWithOffset() {
    currentAmountOfPokemonDisplayed = 0;
    startNumber = document.getElementById("offset-input").value;
    endNumber = document.getElementById("amount-input").value;
    if (endNumber > startNumber) {
        currentOffset = startNumber;
        showAmount = endNumber - startNumber;
        showLoadingScreen();
        await addNextBatchOfPokemonFromAPI(showAmount);
        hideLoadingScreen();
        currentRenderArray = pokeData;
        renderPokeDex();
    }
}

// API response
async function getPokemonIndex(path = "") {
    let response = await fetch(URL_BASE_API + path);
    return responseToJson = await response.json();
}

// Get API URL
function loadPokemonCountPath(newPokemonCount) {
    currentAmountOfPokemonDisplayed += newPokemonCount;
    return "pokemon?limit=" + currentAmountOfPokemonDisplayed + "&offset=" + currentOffset;
}

// Get API Data
async function addNextBatchOfPokemonFromAPI(count) {
    let pokeResponse = await getPokemonIndex(loadPokemonCountPath(count));
    createPokedexArray(pokeResponse.results.length);
    for (let index = 0; index < pokeResponse.results.length; index++) {
        const pokemonDetails = pokeData[index];
        pokemonDetails.name = pokeResponse.results[index].name;
        let singlePokeResponse = await getPokemonIndex("pokemon/" + pokemonDetails.name + "/");
        writePokeData(index, singlePokeResponse);
    }
}


// Render Gallery
function renderPokeDex() {
    document.getElementById("pokedex-gallery").innerHTML = "";
    currentRenderArray.forEach((element, index) => {
        document.getElementById("pokedex-gallery").innerHTML += renderGallery(element, index);
        renderInfoCard(element, index);
        const cardElement = document.getElementById(`pokemon-card-${index}`);
        setPokemonTypeColors([element.type1, element.type2], cardElement);
    });
}

function showLoadingScreen() {
    const loadingscreen = document.getElementById('spinner-overlay');
    loadingscreen.style.display = 'flex';
}

function hideLoadingScreen() {
    const loadingscreen = document.getElementById('spinner-overlay');
    loadingscreen.style.display = 'none';
}

// Add more Pokemon to Gallery + Spinner
async function nextBatchOfPokemon(count) {
    showLoadingScreen();
    await addNextBatchOfPokemonFromAPI(count);
    hideLoadingScreen();
    currentRenderArray = pokeData;
    renderPokeDex();
}

// Make own array as dummy
function createPokedexArray(count) {
    pokeData = [];
    for (let index = 0; index < count; index++) {
        pokeData.push({ "id": index + 1, "imageSmall": "", "imageBig": "", "imageShiny": "", "name": "", "type1": "", "type2": "", "height": 0, "weight": 0, "hp": 0, "atk": 0, "def": 0, "spAtk": 0, "spDef": 0, "speed": 0 })
    }
}

// Handle Search Input
function filterPokemonDataFromName() {
    const loadMorePokemon = document.getElementById("next-batch-pokemon")
    const searchInput = document.getElementById("search-input");
    if (searchInput.value.length == 0) {
        currentRenderArray = pokeData;
        loadMorePokemon.disabled = false;
        document.getElementById("alert").style.display = "none";
        renderPokeDex();
    } else if (searchInput.value.length == 1 || searchInput.value.length == 2) {
            document.getElementById("alert").style.display = "block";
    } else {
        currentRenderArray = filterData;
        loadMorePokemon.disabled = true;
        document.getElementById("alert").style.display = "none";
        searchName = searchInput.value.toLowerCase();
        let foundNames = pokeData.filter(pokemon => pokemon.name.toLowerCase().includes(searchName))
        createFilterArray(foundNames);
    }
}

// Make Array from Filtered Objects and Render
function createFilterArray(tempArray) {
    for (let index = 0; index < tempArray.length; index++) {
        let normalDataIndex = tempArray[index].id - 1;
        let tempPokemonCopy = { ...pokeData[normalDataIndex] };
        filterData.push(tempPokemonCopy);
    }
    renderPokeDex();
}

// Fill array from Api
function writePokeData(index, apiData) {
    const pokemonDetails = pokeData[index];
    pokemonDetails.type1 = apiData.types[0].type.name;
    pokemonDetails.type2 = apiData.types.length <= 1 ? "" : apiData.types[1].type.name;
    pokemonDetails.imageSmall = apiData.sprites.front_default;
    writePokeDataOverlayBase(index, apiData);
    writePokeDataOverlayStats(index, apiData);
}

function writePokeDataOverlayBase(index, apiData) {
    const pokemonDetails = pokeData[index];
    pokemonDetails.imageBig = apiData.sprites.other["official-artwork"].front_default;
    pokemonDetails.imageShiny = apiData.sprites.other["official-artwork"].front_shiny;
    pokemonDetails.height = apiData.height;
    pokemonDetails.weight = apiData.weight;
}

function writePokeDataOverlayStats(index, apiData) {
    const pokemonDetails = pokeData[index];
    pokemonDetails.hp = apiData.stats[0].base_stat;
    pokemonDetails.atk = apiData.stats[1].base_stat;
    pokemonDetails.def = apiData.stats[2].base_stat;
    pokemonDetails.spAtk = apiData.stats[3].base_stat;
    pokemonDetails.spDef = apiData.stats[4].base_stat;
    pokemonDetails.speed = apiData.stats[5].base_stat;
}

// Get Icon URL
async function fetchTypeIconsPath(type) {
    let pathIndex = 0;
    if (type != "unknown") {
        pathIndex = Object.keys(typeColors).indexOf(type) + 1
    } else {
        pathIndex = 10001;
    }
    let pokeResponseType = await getPokemonIndex("type/" + pathIndex);
    let path = pokeResponseType.sprites["generation-iii"].xd.name_icon;
    return path;
}

// Check Icon Types
async function checkIconTypes(type) {
    return type !="" ? await fetchTypeIconsPath(type) : "";
}

// Render Single Pokemon Card
async function renderInfoCard(element, index) {
    let iconPath1 = await checkIconTypes(element.type1);
    let iconPath2 = await checkIconTypes(element.type2);
    element.id = parseInt(element.id) + parseInt(currentOffset);
    document.getElementById("pokemon-card-" + index).innerHTML += renderCard(iconPath1, iconPath2, element);
}

// Set Background Color
function setPokemonTypeColors(types, cardElement) {
    const imageContainer = cardElement.querySelector('.image-container');
    const type1Element = imageContainer.querySelector('.type1');
    const type2Element = imageContainer.querySelector('.type2');
    if (types[1] != "") {
        type1Element.style.backgroundColor = typeColors[types[0]];
        type2Element.style.backgroundColor = typeColors[types[1]];
    } else {
        type1Element.style.backgroundColor = typeColors[types[0]];
        type2Element.style.backgroundColor = typeColors[types[0]];
    }
}

// Open Big Card
async function showOverlay(index) {
    overlayPokemonIndex = index;
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'flex';
    const pokemonDetails = currentRenderArray[index];
    const stats = createStats(index);
    const progressBars = createProgressBars(stats);
    const type1 = await checkIconTypes(currentRenderArray[index].type1);
    const type2 = await checkIconTypes(currentRenderArray[index].type2);
    overlay.querySelector('.overlay-content').innerHTML = "";
    overlay.querySelector('.overlay-content').innerHTML = renderOverlayContent(pokemonDetails, progressBars, type1, type2);
    overlay.querySelector('.overlay-content').style.backgroundColor = typeColors[pokemonDetails.type1];
}

// Hide Big Card
function closeOverlay() {
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
}

// Stat array for Progress Bars
function createStats(index) {
    const pokemonDetails = currentRenderArray[index];
    const stats = {
        "HP": pokemonDetails.hp,
        "ATK": pokemonDetails.atk,
        "DEF": pokemonDetails.def,
        "SP-ATK": pokemonDetails.spAtk,
        "SP-DEF": pokemonDetails.spDef,
        "SPEED": pokemonDetails.speed
    };
    return stats;
}

// Make Progress Bars
function createProgressBars(stats) {
    let progressBars = '';
    for (const [statName, statValue] of Object.entries(stats)) {
        let color = getProgressColor(statValue);
        progressBars += renderProgressBars(statName, statValue, color);
    }
    return progressBars;
}

// Progress Bar Color
function getProgressColor(value) {
    let green = Math.round((value / 255) * 255);
    let red = 255 - green;
    return `rgb(${red}, ${green}, 0)`;
}

// Next Big Pokemon Card
async function showNextPokemon() {
    if (overlayPokemonIndex == currentRenderArray.length - 1 && currentRenderArray != filterData) {
        await nextBatchOfPokemon(1);
        newIndex = overlayPokemonIndex + 1;
    } else if (overlayPokemonIndex <= currentRenderArray.length - 2) {
        newIndex = overlayPokemonIndex + 1;
    }
    showOverlay(newIndex);
}

// Prev Big Pokemon Card
function showPreviousPokemon() {
    if (overlayPokemonIndex != 0) {
        newIndex = overlayPokemonIndex - 1;
        showOverlay(newIndex);
    }
}

// Make big image Shiny
function toggleShiny(name) {
    const imageRef = document.getElementById("big-image-"+ name);
    currentRenderArray.forEach(element => {
        if (element.name == name) {
            imageRef.src = imageRef.src == element.imageBig ? element.imageShiny : element.imageBig;
        }
    });
}

