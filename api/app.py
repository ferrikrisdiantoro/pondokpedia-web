import os
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"

from flask import Flask, request, jsonify
from transformers import AutoTokenizer, TFAutoModel
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import json
import os

app = Flask(__name__)
CORS(app)

# Load tokenizer dan model IndoBERT base (untuk embedding)
tokenizer = AutoTokenizer.from_pretrained("indobenchmark/indobert-base-p1")
model = TFAutoModel.from_pretrained("indobenchmark/indobert-base-p1")

# Load FAQ dan embedding
faq_path = 'faq.json'
embedding_path = 'faq_embeddings.npy'

if not os.path.exists(faq_path) or not os.path.exists(embedding_path):
    raise FileNotFoundError("File faq.json atau faq_embeddings.npy tidak ditemukan. Jalankan script embedding terlebih dahulu.")

with open(faq_path, 'r', encoding='utf-8') as f:
    faq_data = json.load(f)

faq_embeddings = np.load(embedding_path)  # shape (N, hidden_dim)

def get_embedding(text):
    inputs = tokenizer(text, padding='max_length', truncation=True, max_length=128, return_tensors='tf')
    outputs = model(inputs)
    last_hidden_state = outputs.last_hidden_state
    mask = tf.cast(tf.math.not_equal(inputs['input_ids'], 0), tf.float32)
    mask = tf.expand_dims(mask, axis=-1)
    summed = tf.reduce_sum(last_hidden_state * mask, axis=1)
    counted = tf.reduce_sum(mask, axis=1)
    embedding = summed / counted
    return embedding[0].numpy()

def cosine_similarity(a, b):
    a_norm = a / np.linalg.norm(a)
    b_norm = b / np.linalg.norm(b, axis=1, keepdims=True)
    return np.dot(b_norm, a_norm)

@app.route('/get_answer', methods=['POST'])
def get_answer():
    data = request.get_json()
    query = data.get('text', '')
    if not query:
        return jsonify({'error': 'Teks tidak boleh kosong.'}), 400

    query_emb = get_embedding(query)
    similarities = cosine_similarity(query_emb, faq_embeddings)
    best_idx = np.argmax(similarities)
    best_score = similarities[best_idx]

    # Threshold minimal similarity bisa diatur, misal 0.6
    if best_score < 0.6:
        return jsonify({'answer': "Maaf, saya tidak menemukan jawaban yang sesuai."})

    answer = faq_data[best_idx]['Answer']
    question = faq_data[best_idx]['Question']

    return jsonify({
        'question': question,
        'answer': answer,
        'similarity': float(best_score)
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)

