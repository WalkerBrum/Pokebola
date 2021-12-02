class Pokemon {
    constructor(id, nome, url, image) {
        this.id = id;
        this.nome = nome;
        this.url = url;
        this.image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${this.id}.svg`;;
    }
}

async function getPokemons() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon/');
        const json = await response.json();

        const pokemons = json.results.map((poke) => {
            const id = poke.url.replace('https://pokeapi.co/api/v2/pokemon/', '').replace('/', '');
            return new Pokemon(id, poke.name, poke.url);
        })

        return pokemons;
    } catch(error){
        console.log(error);
    }
}

async() => {
    const pokemonDiv = document.querySelector('#pokemons');
    const pokemons = getPokemons();

    pokemons.forEach(function(pokemon) {
        pokemonDiv.innerHTML += `
            <img src="${pokemon.image}"/>,
            <h3>${pokemon.nome}</h3>
        `;
    });
}
