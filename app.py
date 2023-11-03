from flask import Flask, render_template, request, jsonify
from googletrans import Translator as ts
import pytesseract
from PIL import Image
import PyPDF2
from translate import Translator

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

    return jsonify({'translation': translated_text})





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

    return jsonify({'translated_text': translated_text})


# doc 





if __name__ == "__main__":
    app.run(debug=True)
