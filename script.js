class Pokemon {
    constructor(nome, url) {
        this.nome = nome;
        this.url = url;
        this.id = this.url.replace('https://pokeapi.co/api/v2/pokemon/', '').replace('/', '');
        this.imagem = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${this.id}.png`;
        this.preco = Math.floor(Math.random() * 100 + 101);
    }

    html () {
        // Criar um elemento
        const pokeArticle = document.createElement('article');
        // Selecionar a classe
        pokeArticle.className = 'poke'
        // Tample string para substituir informações
        pokeArticle.innerHTML = `
            <img 
                src="${this.imagem}" alt="${this.nome}">
            <h3>${this.nome}</h3>
            <p class="old-value"><s></s>De R$ ${this.preco},00</s></p>
            <p class="new-value">R$ ${(this.preco * 0.80).toFixed(2).replace('.', ',')}</p>
            <div>
                <span><img src="images/pokebola.png"></span>
                <button>Comprar</button>
            </div>`;
        
        return pokeArticle;
    }
}

// Consumindo API
async function getPokemons(page = 0) {
    const limite = 20;
    const response =  await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limite}&offset=${limite * page}`);
    const json = await response.json();
    paginas = Math.ceil(json.count / limite);
    return json;
}
    
let page = 0;

const listaPokemons = (pokemonsApi) => {
    // Selecionando a class que será modificada
    const pokeList = document.querySelector('.poke-list');
    
    //Limpando a lista de pokemons a cada consulta
    pokeList.innerHTML = "";

    // Gerando um array com os atibrutos desejados dos pokemons
    const pokemons = pokemonsApi.map((pokemon) => new Pokemon(pokemon.name, pokemon.url));
    
    // Passar por cada pokemon e adicionar no html
    pokemons.forEach((pokemon) => {
        const html = pokemon.html();
        pokeList.appendChild(html);
    });
        
    // Executando função para tirara a opção Página Anterior na paginação da primeira página
    temAnteriorPage(page);

    // Executando função para tirar a opção Próxima Página na paginação da primeira página
    temProximaPage(page)

    // Executando função para trocar de página
    mudarPage();
    
}

function temAnteriorPage(page) {
    // const lastPage = document.querySelector('.last-page');
    if (page === 0) {
        document.querySelector(".last-page").style.visibility = "hidden";
    } else {
        document.querySelector(".last-page").style.visibility = "visible";
    } 
}

function temProximaPage(page) {
    // const lastPage = document.querySelector('.last-page');
    if (page === (paginas - 1)) {
        document.querySelector(".next-page").style.visibility = "hidden";
    } else {
        document.querySelector(".next-page").style.visibility = "visible";
    }
}

function mudarPage() {
    document.querySelector(".next-page").onclick = async () => {

        // A cada clique irá fazer uma consulta na API, pulando para próxima página com 20 novos pokémons 
        const response = await getPokemons(page += 1);
        listaPokemons(response.results);
    }
    document.querySelector(".last-page").onclick = async () => {

        // A cada clique irá fazer uma consulta na API, voltando para a página dos 20 anteriores pokémons
        const response = await getPokemons(page -= 1);
        listaPokemons(response.results);
    }
}
// Executa quando a página termina de carregar
window.onload = async () => {
    // Executando função que chama API
    const response = await getPokemons(page);

    // Executando função que passa por cada pokemon
    listaPokemons(response.results);
}

