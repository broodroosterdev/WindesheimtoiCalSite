const search = document.getElementById('search');
const success = document.getElementById('success');
const thanks = document.getElementById('thanks');
var codes = [];

const init = async () => {
    const res = await fetch('../data/classcodes.json');
    codes = await res.json();
}
// Search classcodes.json and filter it
const searchClasscodes = async searchText => {
    //console.log(searchText);
    // Get matches to current text input
    const regex = new RegExp(`^${searchText}`, 'gi');
    let matches = codes.filter(code => {
        const regex = new RegExp(`^${searchText}`, 'gi');
        return code.id.match(regex) || code.code.match(regex) || code.klasnaam.match(regex);
    });
    if (searchText.length === 0) {
        matches = [];
    }
    if (matches.length === 0) {
        if (matches.length == 1) {
            search.value = matches[0].code
        }
        return false;
    } else if (matches.length > 0 && searchText !== "") {
        if (searchText.length > 2) {
            let correctCase = await correctCasing(searchText)
            if (correctCase) {
                search.value = correctCase
            }
        }
        return true;
    }
}

const checkCasing = async classcode => {
    const regex = new RegExp(`(?:^|\W)${classcode}(?:$|\W)`, 'g');
    let correctCases = codes.filter(code => {
        return code.id.match(regex) || code.code.match(regex) || code.klasnaam.match(regex);
    })
    return correctCases.length > 0
}
const correctCasing = async classcode => {
    if (!classcode) return;
    const regex = new RegExp(`(?:^|\W)${classcode}(?:$|\W)`, 'gi');
    let correctCases = codes.filter(code => {
        return code.id.match(regex) || code.code.match(regex) || code.klasnaam.match(regex);
    })
    if (correctCases[0]) {
        return correctCases[0].code
    }
}

//Checks if input is valid and redirects to api
const checkSubmit = async key => {
    if (key == 13) {
        if (searchClasscodes(search.value) && await correctCasing(search.value)) {
            showThanks("Je bestand is gedownload!");
            window.location.replace(`https://www.broodrooster.dev/windesheim/api/${search.value}`);
        } else if (searchClasscodes(search.value)) {
            alert("Ik kan deze klascode niet vinden. Is de klascode correct?")
        }
    }
}

const showThanks = (text) => {
    success.innerText = text;
    var modal = new Modal(thanks, {});
    modal.show();
}

function copyTextToClipboard(text) {
    var aux = document.createElement("input");
    aux.setAttribute("value", text);
    document.body.appendChild(aux);
    aux.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
    } catch (err) {
        console.log('Oops, unable to copy');
    }
    document.body.removeChild(aux);
}

const copyURL = async () => {
    if (searchClasscodes(search.value) && await correctCasing(search.value)) {
        search.value = await correctCasing(search.value)
        copyTextToClipboard(`https://www.broodrooster.dev/windesheim/api/${search.value}`);
        showThanks("De link is gekopieerd!");
    } else if (searchClasscodes(search.value)) {
        alert("Ik kan deze klascode niet vinden. Is de klascode correct?");
    }
}

const copyLink = () => {
    copyTextToClipboard(`https://www.broodrooster.dev/windesheim/`);
}


search.addEventListener('keyup', () => searchClasscodes(search.value));
document.addEventListener('keypress', event => checkSubmit(event.keyCode));