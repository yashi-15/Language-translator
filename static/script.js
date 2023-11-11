function displayKeywords(keywords_list) {
    var keysContainer = document.getElementById('keys');
    keysContainer.innerHTML = '';

    keywords_list.forEach(function (keyword) {
        var keywordElement = document.createElement('span');
        keywordElement.textContent = keyword;
        keywordElement.className = 'keyword';

        keysContainer.appendChild(keywordElement);
    });
}

function scrollToOutput() {
    const outputElement = document.getElementById('translated-text');
    const outputPosition = outputElement.offsetTop;
    const scrollToPosition = outputPosition - (window.innerHeight) + (outputElement.offsetHeight / 2);
    window.scrollTo({
        top: scrollToPosition,
        behavior: 'smooth' 
    });
}

function showLoading() {
    document.getElementById('loading').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function translateText() {
    const sourceText = document.getElementById('source-text').value;
    const targetLanguage = document.getElementById('languageSelect').value;

    showLoading();

    fetch('/translatetext', {
        method: 'POST',
        body: new URLSearchParams({
            'source_text': sourceText,
            'languageSelect': targetLanguage
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        document.getElementById('translated-text').textContent = data.translation;
        var keywords = data.keys
        displayKeywords(keywords);
        document.getElementById('key-frequency').textContent = data.frequency;
        scrollToOutput();
    })
    .catch(error => console.error('Error:', error))

    .finally(() => {
        hideLoading();
    });
}



function translateDocument() {
    const fileInput = document.getElementById('fileInput');
    const languageSelect = document.getElementById('languageSelect');

    const file = fileInput.files[0];
    const targetLanguage = languageSelect.value;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('languageSelect', targetLanguage);

    console.log("Form Data:", formData);  
    
    showLoading();

    fetch('/translatedoc', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        document.getElementById('translated-text').textContent = data.translation;
        var keywords = data.keys
        displayKeywords(keywords);
        document.getElementById('key-frequency').textContent = data.frequency;
        scrollToOutput();
    })
    .catch(error => {
        console.error('Error:', error);
    })
    .finally(() => {
        hideLoading();
    });
}
