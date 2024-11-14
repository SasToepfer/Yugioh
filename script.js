let pokeData = [
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

const URL_BASE_API = "https://pokeapi.co/api/v2/"
const maxBaseStat = 255;
let currentPokemonDisplayed = 0;

async function getPokemonIndex(path = "") {
    let response = await fetch(URL_BASE_API + path);
    return responseToJson = await response.json();
}

function loadPokemonCountPath(newPokemonCount) {
    currentPokemonDisplayed += newPokemonCount;

    return "pokemon?limit=" + currentPokemonDisplayed + "&offset=0";
}

async function init() {
    await addNextPokemonFromAPI(2);

    renderPokeDex();
}

async function nextPokemon() {
    await addNextPokemonFromAPI(2);

    renderPokeDex();
}

async function addNextPokemonFromAPI(count) {
    let pokeResponse = await getPokemonIndex(loadPokemonCountPath(count));

    createPokedexArray(pokeResponse.results.length);

    for (let index = 0; index < pokeResponse.results.length; index++) {
        const pokemonDetails = pokeData[index];
        pokemonDetails.name = pokeResponse.results[index].name;
        let singlePokeResponse = await getPokemonIndex("pokemon/" + pokemonDetails.name + "/");
        writePokeData(index, singlePokeResponse);
    }
}

function writePokeData (index, apiData) {
    const pokemonDetails = pokeData[index];
    pokemonDetails.type1 = apiData.types[0].type.name;
    pokemonDetails.type2 = apiData.types.length <= 1 ? "" : apiData.types[1].type.name;
    pokemonDetails.imageSmall = apiData.sprites.front_default;
    pokemonDetails.imageBig = apiData.sprites.other["official-artwork"].front_default;
    pokemonDetails.height = apiData.height;
    pokemonDetails.hp = apiData.stats[0].base_stat;
    pokemonDetails.atk = apiData.stats[1].base_stat;
    pokemonDetails.def = apiData.stats[2].base_stat;
    pokemonDetails.spAtk = apiData.stats[3].base_stat;
    pokemonDetails.spDef = apiData.stats[4].base_stat;
    pokemonDetails.speed = apiData.stats[5].base_stat;
    
}

function createPokedexArray(count) {
    pokeData = [];
    for (let index = 0; index < count; index++) {
        pokeData.push({ "id": index + 1, "imageSmall": "", "name": "", "type1": "", "type2": "", "height": 0, "weight": 0, "hp": 0, "atk":0, "def":0, "spAtk":0, "spDef":0, "speed":0 })
    }
}

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



function renderPokeDex() {
    document.getElementById("pokedex-gallery").innerHTML = "";
    pokeData.forEach((element, index) => {
        document.getElementById("pokedex-gallery").innerHTML +=
            `<div onclick="showOverlay(${index})" class="pokemon-card d-flex" id="pokemon-card-${index}">
                <div class="image-container">
                    <div class="type-color type1 flex-grow-1"></div>
                    <div class="type-color type2 flex-grow-1"></div>
                    <img src="${element.imageSmall}" class="card-img-top" alt="Bild des Pokémons">
                </div>
            </div>`;
        renderInfoCard(element, index);
        const cardElement = document.getElementById(`pokemon-card-${index}`);
        setPokemonTypeColors([element.type1, element.type2], cardElement);
    });
}

async function renderInfoCard(element, index) {
    let iconPath1 = await fetchTypeIconsPath(element.type1);
    let iconPath2 = "";
    if (element.type2 != "") {
        iconPath2 = await fetchTypeIconsPath(element.type2);
    }

    document.getElementById("pokemon-card-" + index).innerHTML += `
        <div class="card-content">
            <h5 class="card-title">${element.name}</h5>
            <div class="card-text" id="type-text">Typ: 
            <img src="${iconPath1}" alt="">
            <img src="${iconPath2}" alt="">
            </div>
        </div>`
}

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

function showOverlay(index) {
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'flex';
    const pokemonDetails = pokeData[index];
    const stats = createStats(index);
    const progressBars = createProgressBars(stats);
    overlay.querySelector('.overlay-content').innerHTML = renderOverlayContent(pokemonDetails, progressBars);
}

function closeOverlay() {
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
}

function createStats(index) {
    const pokemonDetails = pokeData[index];
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

function createProgressBars(stats) {
    let progressBars = '';
    for (const [statName, statValue] of Object.entries(stats)) {
        progressBars += `
            <div class="stat-container">
                <div class="me-3" style="width: 120px;">${statName}: ${statValue}</div>
                <div class="progress flex-grow-1">
                    <div class="progress-bar bg-info" role="progressbar" style="width: ${statValue / 255 * 100}%" aria-valuenow="${statValue}" aria-valuemin="0" aria-valuemax="255"></div>
                </div>
            </div>
        `;
    }
    return progressBars;
}

