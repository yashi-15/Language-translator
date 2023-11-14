function updateMeter(percentage) {
    const container = document.getElementById('gaugeContainer');
    const percentElement = document.getElementById('percent');
    const rotationAngle = (percentage / 100) * 180;
    container.style.setProperty('--rotation', `${rotationAngle}deg`);
    container.addEventListener('mouseover', () => {
        percentElement.textContent = `${percentage}%`;
  });
  container.addEventListener('mouseout', () => {
    percentElement.textContent = '0%';
  });
  }

function displayKeywords(keywords_list, translation_of_keys, freq_of_keys) {
    var keysContainer = document.getElementById('keys');
    keysContainer.innerHTML = '';

    for (var i = 0; i < keywords_list.length; i++) {
        var keyword = keywords_list[i];
        var translation = translation_of_keys[i];
        var frequency = freq_of_keys[i];

        var keywordElement = document.createElement('span');
        keywordElement.textContent = keyword;
        keywordElement.className = 'keyword';
        keywordElement.setAttribute('data-translation', translation);
        keywordElement.setAttribute('data-frequency', frequency);

        keywordElement.addEventListener('mouseover', showTooltip);
        keywordElement.addEventListener('mouseout', hideTooltip);

        keysContainer.appendChild(keywordElement);
    }
}

function showTooltip(event) {
    var keywordElement = event.target;
    var translation = keywordElement.getAttribute('data-translation');
    var frequency = keywordElement.getAttribute('data-frequency');

    var tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = 'Translation: ' + translation + ', Frequency: ' + frequency;

    document.body.appendChild(tooltip);

    var rect = keywordElement.getBoundingClientRect();
    tooltip.style.top = rect.top + window.scrollY + 'px';
    tooltip.style.left = rect.left + 'px';
}

function hideTooltip() {
    var tooltips = document.getElementsByClassName('tooltip');
    for (var i = 0; i < tooltips.length; i++) {
        tooltips[i].parentNode.removeChild(tooltips[i]);
    }
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

function showAccuracyandKeys() {
    document.getElementById('accu-key').style.display = 'flex';
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
        var accuracy= data.similarity;
        var freqKey = data.frequency;
        var keywords = data.keys;
        var keysTrans = data.keystranslation;
        displayKeywords(keywords,keysTrans,freqKey);
        updateMeter(accuracy);
        showAccuracyandKeys();
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
        console.log(data)
        document.getElementById('translated-text').textContent = data.translation;
        var accuracy= data.similarity;
        var freqKey = data.frequency;
        var keywords = data.keys;
        var keysTrans = data.keystranslation;
        displayKeywords(keywords,keysTrans,freqKey);
        updateMeter(accuracy);
        showAccuracyandKeys();
        scrollToOutput();
    })
    .catch(error => {
        console.error('Error:', error);
    })
    .finally(() => {
        hideLoading();
    });
}
