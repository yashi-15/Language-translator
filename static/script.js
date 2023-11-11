function translateText() {
    const sourceText = document.getElementById('source-text').value;
    const targetLanguage = document.getElementById('languageSelect').value;

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
        document.getElementById('keys').textContent = data.keys;
        document.getElementById('key-frequency').textContent = data.frequency;

    })
    .catch(error => console.error('Error:', error));
}



function translateDocument() {
    const fileInput = document.getElementById('fileInput');
    const languageSelect = document.getElementById('languageSelect');
    const translatedTextDiv = document.getElementById('translated-text');

    const file = fileInput.files[0];
    const targetLanguage = languageSelect.value;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('languageSelect', targetLanguage);

    console.log("Form Data:", formData);  // Log form data for debugging

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
        console.log(data); // Log the response for debugging
        translatedTextDiv.innerText = 'Translated Text:\n\n' + data.translated_text;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
