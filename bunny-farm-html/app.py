from flask import Flask, render_template, request, redirect, url_for, jsonify
import json
import os

app = Flask(__name__)

# Path to the JSON file
DATA_FILE = "data/bunnies.json"

# Ensure the data directory and file exist
os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, "w") as f:
        json.dump([], f)


def load_bunnies():
    with open(DATA_FILE, "r") as f:
        return json.load(f)


def save_bunnies(bunnies):
    # Save the list of bunnies to the JSON file
    with open(DATA_FILE, "w") as f:
        # Indent the JSON data for easier reading
        json.dump(bunnies, f, indent=4)


@app.route("/")
def index():
    bunnies = load_bunnies()
    return render_template("index.html", bunnies=bunnies)


# Map image filenames to CSS classes
image_classes = {
    "bear.png": "bear",
    "buffalo.png": "buffalo",
    "chick.png": "chick",
    "chicken.png": "chicken",
    "cow.png": "cow",
    "crocodile.png": "crocodile",
    "dog.png": "dog",
    "duck.png": "duck",
    "elephant.png": "elephant",
    "frog.png": "frog",
    "giraffe.png": "giraffe",
    "goat.png": "goat",
    "gorilla.png": "gorilla",
    "hippo.png": "hippo",
    "horse.png": "horse",
    "monkey.png": "monkey",
    "moose.png": "moose",
    "narwhal.png": "narwhal",
    "owl.png": "owl",
    "panda.png": "panda",
    "parrot.png": "parrot",
    "penguin.png": "penguin",
    "pig.png": "pig",
    "rabbit.png": "rabbit",
    "rhino.png": "rhino",
    "sloth.png": "sloth",
    "snake.png": "snake",
    "walrus.png": "walrus",
    "whale.png": "whale",
    "zebra.png": "zebra",
}


@app.route("/add_bunny", methods=["POST"])
def add_bunny():
    bunnies = load_bunnies()

    # Print the list of bunnies to the console
    print("")
    print("=========================")
    print("BUNNY LIST: ", bunnies)
    print("=========================")
    print("")

    # Print the form data to the console
    print("")
    print("=========================")
    print("FORM DATA: ", request.form)
    print("=========================")
    print("")

    name = request.form["name"]
    image = request.form["image"]

    # Log that we're creating the bunny
    print("")
    print("=========================")
    print("Creating bunny with name: ", name)
    print("=========================")
    print("")
    new_bunny = {
        "id": len(bunnies) + 1,
        "name": name,
        "image": image,  # Keep this if needed elsewhere
        "image_class": image_classes.get(image, ""),
        "stats": {
            "HP": 100,
            "MP": 50,
            "Energy": 75,
            "Love": 50,
            "Irritation": 0,
            "Age": 0,
        },
    }

    # Log the bunny before adding it to the list
    print("")
    print("=========================")
    print("NEW BUNNY: ", new_bunny)
    print("=========================")
    print("")
    bunnies.append(new_bunny)

    # Save the new list of bunnies
    save_bunnies(bunnies)
    return redirect(url_for("index"))


@app.route("/release_bunny/<int:bunny_id>", methods=["POST"])
def release_bunny(bunny_id):
    # Remove bunny from the list, and re-save the list of bunny
    bunnies = load_bunnies()
    for bunny in bunnies:
        if bunny["id"] == bunny_id:
            # Remove that bunny from the list
            bunnies.remove(bunny)
            break
    save_bunnies(bunnies)
    return redirect(url_for("index"))


@app.route("/increment_age/<int:bunny_id>", methods=["POST"])
def increment_age(bunny_id):
    bunnies = load_bunnies()
    for bunny in bunnies:
        if bunny["id"] == bunny_id:
            bunny["stats"]["Age"] += 1
            break
    save_bunnies(bunnies)
    return redirect(url_for("index"))


if __name__ == "__main__":
    app.run(debug=True)
