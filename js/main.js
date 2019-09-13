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
    if(matches.length === 0 && searchText !== ""){
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
            <div class="card card-body mb-2" onclick=selectCard("${match.code}")>
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
const copyURL = () => {
    if(searchClasscodes(search.value)){
        copyTextToClipboard(`https://www.broodrooster.dev/windesheim/api/${search.value}`);
    }
     
}

const redirectTikkie = () => {
    window.location.href = "https://tikkie.me/pay/hmqsk64id5scn4ve9he8";
}

const redirectiCalInfo = () => {
    window.location.href = "https://www.broodrooster.dev/windesheim/icalinfo.html"
}

search.addEventListener('keyup', () => searchClasscodes(search.value));
document.addEventListener('keypress', event => checkSubmit(event.keyCode));