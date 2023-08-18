from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import assemblyai as aai
import openai
import re
import os 
import dotenv
import json
dotenv.load_dotenv(".env")
#  var = os.getenv('var_name')

app = Flask(__name__)
CORS(app)

@app.route('/get_qa_arr', methods=['POST'])
def process_data():
    # Get the API keys from the request headers
    assemblyAiKey = request.headers.get('assemblyAiKey')
    aai.settings.api_key = assemblyAiKey
    openAiKey = request.headers.get('openAiKey')
    openai.api_key = openAiKey
    
    # Check if both API keys are provided
    if assemblyAiKey is None or openAiKey is None:
        return jsonify({"error": "Both API keys are required"}), 400
    
    if assemblyAiKey and openAiKey:
        url = request.json.get('url')
        if url:
            print(f"Received url: {url}")
        else:
            return jsonify({"error": "Headers or url missing."}), 400
    

    # checks complete, AssemblyAi Api call below
    transcriber = aai.Transcriber()

    transcript = transcriber.transcribe(url)

    transcribed_text = transcript.text
    print(transcribed_text)

    # # Generate a question based on the summary
    prompt = f"Summarize the following text in a format of 6 Question and Answer with each question starting with Q: and each answer starting with A: with each separated by a newline\n{transcribed_text}"

    # Generate a response using the GPT-3.5 Turbo model
    response = openai.Completion.create(
        engine="text-davinci-003",  # GPT-3.5 Turbo engine
        prompt=prompt,
        max_tokens=1000  # Maximum number of tokens in the generated response
    )

    # Print the generated response
    print(response.choices[0].text.strip())
    extracted_text = response.choices[0].text.strip()

    lines = extracted_text.split('\n')

    # Find the index of the line that starts with "Q:"
    index_of_q = next((i for i, line in enumerate(lines) if line.startswith("Q:")), None)

    # If "Q:" is found, join the lines starting from that index
    if index_of_q is not None:
        extracted_text = '\n'.join(lines[index_of_q:])

    return jsonify({"result":extracted_text}), 200

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000)
