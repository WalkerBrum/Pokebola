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
        pokeArticle.className = 'poke';

        // Tample string para substituir informações
        pokeArticle.innerHTML = `
            <img 
                src="${this.imagem}" alt="${this.nome}">
            <h3 id="name">${this.nome}</h3>
            <p class="old-value"><s></s>De R$ ${this.preco},00</s></p>
            <p class="new-value">R$ ${(this.preco * 0.80).toFixed(2).replace('.', ',')}</p>
            <div id="buy">
                <span><img src="images/pokebola.png"></span>
                <button>Comprar</button>
            </div>`;
        
        return pokeArticle;
    }
}

let page = 0;
let paginas = 0;

// Selecionando aa classes que serão modificada
const pokeList = document.querySelector(".poke-list");
const lastPage = document.querySelector(".last-page");
const nextPage = document.querySelector(".next-page");
const numPage = document.querySelector(".num-page");

// Consumindo API
async function getPokemons(page = 0) {

    // Mensagem enquanto carrega a página
    pokeList.innerHTML = '<div>Carregando Pokémons</div>';

    const limite = 20;
    const response =  await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limite}&offset=${limite * page}`);
    const json = await response.json();

    paginas = Math.ceil(json.count / limite);

    return json;
}
    
const listaPokemons = (pokemonsApi) => {
        
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
    
    countPage();

    // Executando a função para abrir o carrinho
    abrirCarrinho();

    // Executando a função para fechar o carrinho
    fecharCarrinho();
}

function temAnteriorPage(page) {

    if (page === 0) {
        lastPage.style.visibility = "hidden";
    } else {
        lastPage.style.visibility = "visible";
    } 
}

function temProximaPage(page) {

    if (page === (paginas - 1)) {
        nextPage.style.visibility = "hidden";
    } else {
        nextPage.style.visibility = "visible";
    }
}

function mudarPage() {
    
    nextPage.onclick = async () => {

        // A cada clique irá fazer uma consulta na API, pulando para próxima página com 20 novos pokémons 
        const response = await getPokemons(page += 1);
        listaPokemons(response.results);
    }

    lastPage.onclick = async () => {

        // A cada clique irá fazer uma consulta na API, voltando para a página dos 20 anteriores pokémons
        const response = await getPokemons(page -= 1);
        listaPokemons(response.results);
    }

    // Para voltar ao ínicio da página quando mudar de página
    window.scrollTo({top: 0, behavior: 'smooth'});
}

// Função para númerar a página
const countPage = () => {
    numPage.innerHTML = `${page+1}/${paginas}`;
 }

 // Função para abrir carrinho
const abrirCarrinho = () => {
    const openCar = document.querySelector("#abrir-carrinho");

    openCar.addEventListener('click', function(event) {

        // Evita qualquer comportamento padrão do link
        event.preventDefault();
        
        // Adicionando uma class no body
        document.body.className = "carrinho-aberto";
    })

    // Selecionando todas as div que contenha o id buy
    const buy = document.querySelectorAll('#buy');

    // Abrindo carrinho quando clicar no botom comprar
    buy.forEach((button) => {
        button.addEventListener('click', function(event) {
        
            event.preventDefault();
        
            document.body.className = "carrinho-aberto";       
        });
    })
}

// Função para fechar carrinho
const fecharCarrinho = () => {
    const closeCar = document.querySelector("#fechar-carrinho");

    closeCar.addEventListener('click', function(event) {
        event.preventDefault();

        document.body.className = '';
     }) 
    
     // Fechando carrinho quando apertar Esc
    document.addEventListener('keydown', function(event) {
        event.preventDefault();

        // Colocando valor da tecla em uma variável
        const tecla = event.keyCode;
        
        if (tecla === 27) {
            document.body.className = '';
        }
    }) 

    const continuarComprando = document.querySelector("#continuar-comprando")

    // Fechando carrinho quando clicar botão continuar comprando
    continuarComprando.addEventListener('click', function(event) {
        event.preventDefault();

        document.body.className = '';
    })
 }

// Executa quando a página termina de carregar
window.onload = async () => {

    // Executando função que chama API
    const response = await getPokemons(page);

    // Executando função que passa por cada pokemon
    listaPokemons(response.results);
}

