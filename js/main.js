const search = document.getElementById('search');
const matchList = document.getElementById('match-list');
const main = document.getElementById('main');
var codes = [];

const init = async () => {
    const res = await fetch('../data/classcodes.json');
    codes = await res.json();
}
// Search classcodes.json and filter it
const searchClasscodes = async searchText => {
    //console.log(searchText);
    // Get matches to current text input
    let matches = codes.filter(code => {
        const regex = new RegExp(`^${searchText}`, 'gi');
        return code.id.match(regex) || code.code.match(regex) || code.klasnaam.match(regex);
    });
    if (searchText.length === 0) {
        matches = [];
    }
    outputHtml(matches);
    if (matches.length === 0) {
        const regexCase = new RegExp(`${searchText}`, 'gi');
        let newMatches = codes.filter(code => {
            return code.id.match(regexCase) || code.code.match(regexCase) || code.klasnaam.match(regexCase);
        });
        if (newMatches.length == 1) {
            search.value = newMatches[0].code
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
//Show results in HTML
const outputHtml = matches => {
    var html = "";
    if (matches.length > 0) {
        //console.log(matches);
        html = matches.map(match => `
            <div class="card card-body mb-2" onclick=selectCard("${match.code}")>
                <span class="text-primary">${match.code}</span>
            </div>
        `).join('');
    }
    matchList.innerHTML = html;
}

const selectCard = code => {
    //console.log(code);
    search.value = code;
}
//Checks if input is valid and redirects to api
const checkSubmit = async key => {
    if (key == 13) {
        if (searchClasscodes(search.value) && await correctCasing(search.value)) {
            showThanks();
            window.location.replace(`https://www.broodrooster.dev/windesheim/api/${search.value}`);
        } else if (searchClasscodes(search.value)) {
            alert("Ik kan deze klascode niet vinden. Is de klascode correct?")
        }
    }
}

const showThanks = () => {
    $('#thanks').modal()
}

function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");

    //
    // *** This styling is an extra step which is likely not required. ***
    //
    // Why is it here? To ensure:
    // 1. the element is able to have focus and selection.
    // 2. if element was to flash render it has minimal visual impact.
    // 3. less flakyness with selection and copying which **might** occur if
    //    the textarea element is not visible.
    //
    // The likelihood is the element won't even render, not even a
    // flash, so some of these are just precautions. However in
    // Internet Explorer the element is visible whilst the popup
    // box asking the user for permission for the web page to
    // copy to the clipboard.
    //

    // Place in top-left corner of screen regardless of scroll position.
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;

    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = '2em';
    textArea.style.height = '2em';

    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = 0;

    // Clean up any borders.
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';

    // Avoid flash of white box if rendered for any reason.
    textArea.style.background = 'transparent';


    textArea.value = text;

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
    } catch (err) {
        console.log('Oops, unable to copy');
    }

    document.body.removeChild(textArea);
}
const copyURL = async () => {
    if (searchClasscodes(search.value) && await correctCasing(search.value)) {
        search.value = await correctCasing(search.value)
        copyTextToClipboard(`https://www.broodrooster.dev/windesheim/api/${search.value}`);
        showThanks();
    } else if (searchClasscodes(search.value)) {
        alert("Ik kan deze klascode niet vinden. Is de klascode correct?");
    }
}

const copyLink = () => {
    copyTextToClipboard(`https://www.broodrooster.dev/windesheim/`);
}


search.addEventListener('keyup', () => searchClasscodes(search.value));
document.addEventListener('keypress', event => checkSubmit(event.keyCode));