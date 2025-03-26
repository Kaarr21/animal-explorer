const animalInput = document.getElementById('animalInput');
const animalList = document.getElementById('animalList');
const factDisplay = document.getElementById('factDisplay');
const typeFilterButtons = document.querySelectorAll('.type-filter button');

let animalsData = [];

async function fetchAnimals() {
    try {
        const response = await fetch('db.json');
        const data = await response.json();
        animalsData = data.animals;
        renderAnimalList(animalsData);
    } catch (error) {
        console.error('Error fetching animal data:', error);
        animalList.innerHTML = '<li>Failed to load animals. Please try again later.</li>';
    }
}

function renderAnimalList(filteredAnimals) {
    animalList.innerHTML = '';
    filteredAnimals.forEach(animal => {
        const li = document.createElement('li');
        li.textContent = animal.name;
        li.dataset.id = animal.id;
        li.addEventListener('click', () => displayAnimalDetails(animal));
        animalList.appendChild(li);
    });
}

function displayAnimalDetails(animal) {
    factDisplay.innerHTML = '';
    const detailsHTML = `
        <div class="animal-details">
            <h2>${animal.name}</h2>
            ${animal.image ? `<img src="${animal.image}" alt="${animal.name}" class="animal-image">` : ''}
            <div class="animal-info">
                <h3>Interesting Facts:</h3>
                <ul>
                    ${animal.facts.map(fact => `<li>${fact}</li>`).join('')}
                </ul>
                <div class="animal-metadata">
                    <p><strong>Type:</strong> ${animal.type.charAt(0).toUpperCase() + animal.type.slice(1)}</p>
                    <p><strong>Animal ID:</strong> ${animal.id}</p>
                </div>
            </div>
        </div>
    `;

    factDisplay.innerHTML = detailsHTML;
}

animalInput.addEventListener('input', () => {
    const searchTerm = animalInput.value.toLowerCase();
    const filteredAnimals = animalsData.filter(animal => 
        animal.name.toLowerCase().includes(searchTerm)
    );
    renderAnimalList(filteredAnimals);
});

typeFilterButtons.forEach(button => {
    button.addEventListener('click', () => {
        typeFilterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const type = button.dataset.type;
        let filteredAnimals = animalsData;

        if (type !== 'all') {
            filteredAnimals = animalsData.filter(animal => animal.type === type);
        }

        renderAnimalList(filteredAnimals);
    });
});

fetchAnimals();