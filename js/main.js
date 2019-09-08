const search = document.getElementById('search');
const matchList = document.getElementById('match-list');

// Search classcodes.json and filter it
const searchClasscodes = async searchText => {
    const res = await fetch('../data/classcodes.json');
    const codes = await res.json();
    //console.log(searchText);
    // Get matches to current text input
    let matches = codes.filter(code => {
        const regex = new RegExp(`^${searchText}`, 'gi');
        return code.id.match(regex) || code.code.match(regex) || code.klasnaam.match(regex);
    });
    if(searchText.length === 0){
        matches = [];
    }
    outputHtml(matches);
    if(matches.length === 0){
        return false;
    } else if(matches.length > 0){
        return true;
    }
}

//Show results in HTML
const outputHtml = matches => {
    if(matches.length > 0){
        //console.log(matches);
        const html = matches.map(match => `
            <div class="card card-body mb-4" onclick=selectCard("${match.code}")>
                <span class="text-primary">${match.code}</span>
            </div>
        `).join('');

        matchList.innerHTML = html;

        
    }
}

const selectCard = code => {
    //console.log(code);
    search.value = code;
}
//Checks if input is valid and redirects to api
const checkSubmit = key => {
    if(key == 13){
        if(searchClasscodes(search.value)){
            window.location.replace(`https://www.broodrooster.dev/windesheim/api/${search.value}`);
        }
    }
}

search.addEventListener('keyup', () => searchClasscodes(search.value));
document.addEventListener('keypress', event => checkSubmit(event.keyCode));