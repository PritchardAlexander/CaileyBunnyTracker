from flask import Flask, jsonify, request, send_from_directory
import json
import os

app = Flask(__name__, static_url_path='', static_folder='static')

DATA_FILE = 'data/bunnies.json'

# Ensure the data directory and file exist
os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w') as f:
        json.dump([], f)

def load_bunnies():
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def save_bunnies(bunnies):
    with open(DATA_FILE, 'w') as f:
        json.dump(bunnies, f, indent=4)

# Serve the main index.html
@app.route('/')
def index():
    return app.send_static_file('index.html')

# API endpoint to get the list of bunnies
@app.route('/api/bunnies', methods=['GET'])
def get_bunnies():
    bunnies = load_bunnies()
    return jsonify(bunnies)

# API endpoint to add a new bunny
@app.route('/api/bunnies', methods=['POST'])
def add_bunny():
    bunnies = load_bunnies()
    data = request.get_json()
    name = data.get('name')
    image = data.get('image')

    # Generate a new ID
    next_id = max([bunny['id'] for bunny in bunnies], default=0) + 1

    new_bunny = {
        'id': next_id,
        'name': name,
        'image': image,
        'stats': {
            'HP': 100,
            'MP': 50,
            'Energy': 75,
            'Love': 50,
            'Irritation': 0,
            'Age': 0
        }
    }
    bunnies.append(new_bunny)
    save_bunnies(bunnies)
    return jsonify(new_bunny), 201

# API endpoint to increment bunny's age
@app.route('/api/bunnies/<int:bunny_id>/increment_age', methods=['POST'])
def increment_age(bunny_id):
    bunnies = load_bunnies()
    for bunny in bunnies:
        if bunny['id'] == bunny_id:
            bunny['stats']['Age'] += 1
            save_bunnies(bunnies)
            return jsonify(bunny)
    return jsonify({'error': 'Bunny not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)