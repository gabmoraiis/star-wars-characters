let currentPageUrl = 'https://swapi.dev/api/people/'

window.onload = async () =>{
    try{
        await loadCharacters(currentPageUrl);
    } catch (error) {
        console.log(error);
        alert('Erro ao carregar cards.');
    }

    const nextButton = document.getElementById('next-button');
    const backButton = document.getElementById('back-button');
    
};

async function loadCharacters(url) {
    const mainContent = document.getElementById('main-content')
    mainContent.innerHTML = ''; // Limpar os cards anteriores. 

    try{
        const response = await fetch(url);
        const responseJson = await response.json();

        responseJson.results.forEach((character) => {
            const card = document.createElement("div");
            card.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')`
            card.className = "cards";

            const characterNameBG = document.createElement("div");
            characterNameBG.className = "character-name-bg";

            const characterName = document.createElement("span");
            characterName.className = "character-name";
            characterName.innerText = `${character.name}`;

            characterNameBG.appendChild(characterName);
            card.appendChild(characterNameBG);
            mainContent.appendChild(card);

            card.onclick = () => {
                const modal = document.getElementById("modal");
                modal.style.visibility = "visible";

                const modalContent = document.getElementById("modal-content");
                modalContent.innerHTML = '';

                const characterImage = document.createElement("div");
                characterImage.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')`;
                characterImage.className = "character-image";

                const modalCharacterName = document.createElement("span");
                modalCharacterName.className = "character-info";
                modalCharacterName.innerText = `Nome: ${character.name}`;

                const modalCharacterHeight = document.createElement("span");
                modalCharacterHeight.className = "character-info";
                modalCharacterHeight.innerText = `Altura: ${convertHeight(character.height)}`;

                const modalCharacterMass = document.createElement("span");
                modalCharacterMass.className = "character-info";
                modalCharacterMass.innerText = `Peso: ${convertMass(character.mass)}`;

                const modalCharacterEyeColor = document.createElement("span");
                modalCharacterEyeColor.className = "character-info";
                modalCharacterEyeColor.innerText = `Cor dos Olhos: ${convertEyeColor(character.eye_color)}`;

                const modalCharacterBirth = document.createElement("span");
                modalCharacterBirth.className = "character-info";
                modalCharacterBirth.innerText = `Nascimento: ${convertBirthYear(character.birth_year)}`;

                modalContent.appendChild(characterImage);
                modalContent.appendChild(modalCharacterName);
                modalContent.appendChild(modalCharacterHeight);
                modalContent.appendChild(modalCharacterMass);
                modalContent.appendChild(modalCharacterEyeColor);
                modalContent.appendChild(modalCharacterBirth);
            }

        
        });

        const nextButton = document.getElementById('next-button');
        const backButton = document.getElementById('back-button');

        /* nextButton.disabled = !responseJson.next; A propriedade desabilitado do botão next só será true
        quando a chave "next" do documento JSON não tiver sendo recebida da API (Consultar documentação pra
        entender melhor). */

        nextButton.style.visibility = responseJson.next? "visible" : "hidden"; /* Operador ternário
        "?" questiona se está sendo recebido o "previous" da API, caso esteja, ela deixa o botão back visível,
        caso não esteja, ele deixa o botão invisível. */
        
        backButton.style.visibility = responseJson.previous? "visible" : "hidden"; /* Operador ternário
        "?" questiona se está sendo recebido o "previous" da API, caso esteja, ela deixa o botão back visível,
        caso não esteja, ele deixa o botão invisível. */

        currentPageUrl = url; /* Serve para armazenar a URL atual nessa variável, pois quando o usuário
        clicar no next ou previous a URL vai mudar e atualizar a variável sempre com a URL da página atual. */ 

    } catch(error) {
        alert('Erro ao carregar os personagens.');
        console.log(error);
    }
}

async function loadNextPage() {
    if (!currentPageUrl) return; /* Prevenção de erro, caso a URL da nova requisição que será feita abaixo
    não exista. */
    try {
        const response = await fetch(currentPageUrl);
        const responseJson = await response.json();
        
        await loadCharacters(responseJson.next);

    } catch (error) {
        console.log(error);
        alert('Erro ao carregar a próxima página.')
    }
}

async function loadPreviousPage() {
    if (!currentPageUrl) return; /* Prevenção de erro, caso a URL da nova requisição que será feita abaixo
    não exista. */
    try {
        const response = await fetch(currentPageUrl);
        const responseJson = await response.json();
        
        await loadCharacters(responseJson.previous);

    } catch (error) {
        console.log(error);
        alert('Erro ao carregar a página anterior.')
    }
}

function hideModal() {
    const modal = document.getElementById("modal");
    modal.style.visibility = "hidden";
}

function convertEyeColor(eyeColor) {

    const cores = {
        blue: "Azul",
        brown: "Castanho",
        green: "Verde",
        yellow: "Amarelo",
        black: "Preto",
        pink: "Rosa",
        red: "Vermelho",
        orange: "Laranja",
        hazel: "Avela",
        unknown: "Desconhecida"
    }

    return cores[eyeColor.toLowerCase()] || eyeColor;
}

function convertHeight(height){
    if(height === "unknown"){
        return "Desconhecida";
    } else {
        height = (height / 100).toFixed(2);
    }
    
    return `${height} metros`;
}

function convertMass(mass){
    if(mass === "unknown"){
        return "Desconhecida";
    }
    
    return `${mass} kg`;
}   

function convertBirthYear(birthYear){
    if(birthYear === "unknown"){
        return "Desconhecido";
    }

    return birthYear;
}