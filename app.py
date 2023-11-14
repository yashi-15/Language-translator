from flask import Flask, render_template, request, jsonify
from googletrans import Translator as ts
import pytesseract
from PIL import Image
import PyPDF2
from translate import Translator
from sentence_transformers import SentenceTransformer
from nltk import FreqDist, word_tokenize
from nltk.corpus import stopwords
import numpy as np

def calculate_similarity(original, translated):
    model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
    original_embedding = model.encode(original)
    translated_embedding = model.encode(translated)

    similarity = np.dot(original_embedding, translated_embedding) / (np.linalg.norm(original_embedding) * np.linalg.norm(translated_embedding))
    
    return similarity * 100

def extract_keywords(text):
    words = word_tokenize(text)
    words = [word.lower() for word in words if word.isalpha() and word.lower() not in stopwords.words('english')]
    freq_dist = FreqDist(words)
    keywords = freq_dist.most_common(5)
    
    return keywords

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/translatetext', methods=['POST'])
def translate():
    source_text = request.form.get('source_text')
    target_language = request.form.get('languageSelect')

    translator = ts()
    translated_text = translator.translate(source_text, dest=target_language).text

    keywords = extract_keywords(source_text)
    # print(keywords)
    keys = [item[0] for item in keywords]
    frequency = [item[1] for item in keywords]
    key_trans=[]
    for key in keys:
        trans=translator.translate(key, dest=target_language).text
        key_trans.append(trans)
    print(keys)
    print(frequency)
    print(key_trans)
    similarity = calculate_similarity(source_text, translated_text)
    print(similarity)
    response = {'translation': translated_text,'keys': keys, 'keystranslation': key_trans, 'frequency': frequency, 'similarity': similarity}

    return jsonify(response)

    # return jsonify({'translation': translated_text})





# doc 

@app.route('/translatedoc', methods=['POST'])
def translate_text():
    # Handle uploaded file (PDF or image)
    file = request.files['file']
    text = ""

    if file.filename.endswith('.pdf'):
        # Handle PDF file
        pdf_reader = PyPDF2.PdfFileReader(file)
        for page_num in range(pdf_reader.numPages):
            page = pdf_reader.getPage(page_num)
            text += page.extractText()
    elif file.filename.endswith(('.jpg', '.jpeg', '.png')):
        # Handle image file
        image = Image.open(file)
        text = pytesseract.image_to_string(image)
    else:
        return jsonify({'error': 'Unsupported file format'}), 400

    # Translate text to the desired language
    target_language = request.form['languageSelect']
    translator = Translator(to_lang=target_language)
    translated_text = translator.translate(text)
    # translator = ts()
    keywords = extract_keywords(text)
    print(translated_text)
    print(keywords)
    print(target_language)
    keys = [item[0] for item in keywords]
    frequency = [item[1] for item in keywords]
    key_trans=[]
    for key in keys:
        trans=translator.translate(key)
        key_trans.append(trans)    
    print(keys)
    print(frequency)
    print(key_trans)
    similarity = calculate_similarity(text, translated_text)
    print(similarity)
    response = {'translation': translated_text,'keys': keys, 'keystranslation': key_trans, 'frequency': frequency, 'similarity': similarity}
    return jsonify(response)
    # return jsonify({'translated_text': translated_text})


# doc 





if __name__ == "__main__":
    app.run(debug=True)
