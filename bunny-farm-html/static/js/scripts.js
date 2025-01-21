// scripts.js

document.addEventListener('DOMContentLoaded', function () {
    const bunnyList = document.getElementById('bunny-list');
    const addBunnyForm = document.getElementById('add-bunny-form');
    const nameInput = document.getElementById('name');
    const imageSelect = document.getElementById('image');

    const images = ['bear.png', 'buffalo.png', 'chick.png', 'chicken.png', 'cow.png', 'crocodile.png', 'dog.png', 'duck.png', 'elephant.png', 'frog.png', 'giraffe.png', 'goat.png', 'gorilla.png', 'hippo.png', 'horse.png', 'monkey.png', 'moose.png', 'narwhal.png', 'owl.png', 'panda.png', 'parrot.png', 'penguin.png', 'pig.png', 'rabbit.png', 'rhino.png', 'sloth.png', 'snake.png', 'walrus.png', 'whale.png', 'zebra.png'];

    // Populate the image select options
    images.forEach(function (image) {
        const option = document.createElement('option');
        option.value = image;
        option.text = image.split('.')[0];
        imageSelect.appendChild(option);
    });

    // Fetch and display bunnies
    function fetchBunnies() {
        fetch('/api/bunnies')
            .then(response => response.json())
            .then(data => {
                displayBunnies(data);
            })
            .catch(error => console.error('Error fetching bunnies:', error));
    }

    function displayBunnies(bunnies) {
        // Clear current content
        bunnyList.innerHTML = '';

        bunnies.forEach(function (bunny) {
            const bunnyDiv = document.createElement('div');
            //bunnyDiv.classList.add('bunny');
            bunnyDiv.classList.add('animal');
            bunnyDiv.classList.add(bunny.image.split('.')[0]);

            const nameHeader = document.createElement('h3');
            nameHeader.textContent = bunny.name;

            const agePara = document.createElement('p');
            agePara.textContent = 'Age: ' + bunny.stats.Age + ' days';

            // Other stats
            const statsList = document.createElement('ul');
            for (const stat in bunny.stats) {
                if (stat !== 'Age') {
                    const statItem = document.createElement('li');
                    statItem.textContent = stat + ': ' + bunny.stats[stat];
                    statsList.appendChild(statItem);
                }
            }

            // Next Day button
            const incrementButton = document.createElement('button');
            incrementButton.textContent = 'Next Day';
            incrementButton.addEventListener('click', function () {
                incrementAge(bunny.id);
            });

            bunnyDiv.appendChild(nameHeader);
            bunnyDiv.appendChild(agePara);
            bunnyDiv.appendChild(statsList);
            bunnyDiv.appendChild(incrementButton);

            bunnyList.appendChild(bunnyDiv);
        });
    }

    // Add a new bunny
    addBunnyForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = nameInput.value.trim();
        const image = imageSelect.value;

        // Validate inputs
        if (name === '') {
            alert('Please enter a bunny name.');
            return;
        }

        fetch('/api/bunnies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name, image: image })
        })
            .then(response => response.json())
            .then(data => {
                // Clear the form
                addBunnyForm.reset();
                // Refresh the bunny list
                fetchBunnies();
            })
            .catch(error => console.error('Error adding bunny:', error));
    });

    // Increment bunny age
    function incrementAge(bunnyId) {
        fetch('/api/bunnies/' + bunnyId + '/increment_age', {
            method: 'POST'
        })
            .then(response => response.json())
            .then(data => {
                // Refresh the bunny list
                fetchBunnies();
            })
            .catch(error => console.error('Error incrementing age:', error));
    }

    // Initial fetch
    fetchBunnies();
});