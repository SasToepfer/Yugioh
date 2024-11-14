function renderOverlayContent(pokemonDetails, progressBars) {
    return `
        <img src="${pokemonDetails.imageBig}" alt="${pokemonDetails.name}" class="img-fluid mb-3">
        <h3>${pokemonDetails.name}</h3>
        <div class="pokemon-stats">
            ${progressBars}
        </div>
        <button onclick="closeOverlay()" class="btn btn-secondary mt-3">Schließen</button>
    `;
}
