
function renderGallery(element, index) {
    return `<div onclick="showOverlay(${index})" class="pokemon-card d-flex" id="pokemon-card-${index}">
                <div class="image-container">
                    <div class="type-color type1 flex-grow-1"></div>
                    <div class="type-color type2 flex-grow-1"></div>
                    <img src="${element.imageSmall}" class="card-img-top" alt="Bild des Pokémons">
                </div>
            </div>`
}

function renderCard(path1, path2, element) {
    return `<div class="card-content">
                <h5 class="card-title">#${element.id}  ${element.name}</h5>
                <div class="card-text" id="type-text">Typ: 
                <img src="${path1}" alt="">
                <img src="${path2}" alt="">
                </div>
            </div>`
}

function renderOverlayContent(pokemonDetails, progressBars, path1, path2) {
    return `
        <div class="big-image-container">
            <img id="big-image-${pokemonDetails.name}" src="${pokemonDetails.imageBig}" alt="${pokemonDetails.name}" class="big-image">
        </div>
        <div class="overlay-info">
            <h2>${pokemonDetails.name}</h2>

            <ul class="nav nav-tabs" id="pokemonTab" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="info-tab" data-bs-toggle="tab" data-bs-target="#info" type="button" role="tab" aria-controls="info" aria-selected="true">Information</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="stats-tab" data-bs-toggle="tab" data-bs-target="#stats" type="button" role="tab" aria-controls="stats" aria-selected="false">Stats</button>
                </li>
            </ul>

            <div class="tab-content mt-3" id="pokemonTabContent">
                <div class="tab-pane fade show active" id="info" role="tabpanel" aria-labelledby="info-tab">
                    <div class="information">
                        <div class="card-text" id="type-text">Typ: 
                            <img src="${path1}" alt="">
                            <img src="${path2}" alt="">
                        </div>    
                        <button onclick="toggleShiny('${pokemonDetails.name}')" class="btn btn-primary">Shiny</button>    
                        <span><strong>Height:</strong> ${pokemonDetails.height} m</span>
                        <span><strong>Weight:</strong> ${pokemonDetails.weight} kg</span>
                    </div>
                </div>
                <div class="tab-pane fade" id="stats" role="tabpanel" aria-labelledby="stats-tab">
                    <div class="pokemon-stats">
                        ${progressBars}
                    </div>
                </div>
                
            </div>

            <div class="overlay-bottom">
                <img onclick="showPreviousPokemon()" src="img/left-arrow.png" alt="">
                <button onclick="closeOverlay()" class="btn btn-secondary">Schließen</button>
                <img class="right-arrow" onclick="showNextPokemon()" src="img/left-arrow.png" alt="">
            </div>
        </div>
    `;
}


function renderProgressBars(name, value, color) {
    return `
        <div class="stat-container">
            <div class="me-3" style="width: 120px;">${name}: ${value}</div>
            <div class="progress flex-grow-1">
                <div class="progress-bar" role="progressbar" 
                     style="width: ${value / 255 * 100}%; background-color: ${color};" 
                     aria-valuenow="${value}" 
                     aria-valuemin="0" 
                     aria-valuemax="255">
                </div>
            </div>
        </div>
    `;
}