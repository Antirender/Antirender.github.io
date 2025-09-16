const UNSPLASH_ACCESS_KEY = 'R8jTZCnGsEDsni0alTRYjeH-JIIdMQQfXB5UTBaW1Qc';
const options = {
  food: [
    { name: 'Pizza', searchTerm: 'pizza', emoji: '🍕' },
    { name: 'Sushi', searchTerm: 'sushi', emoji: '🍣' },
    { name: 'Tacos', searchTerm: 'tacos', emoji: '🌮' },
    { name: 'Burger', searchTerm: 'burger', emoji: '🍔' },
    { name: 'Pasta', searchTerm: 'pasta', emoji: '🍝' },
    { name: 'Salad', searchTerm: 'salad', emoji: '🥗' }
  ],
  drink: [
    { name: 'Coffee', searchTerm: 'coffee', emoji: '☕' },
    { name: 'Tea', searchTerm: 'tea', emoji: '🍵' },
    { name: 'Soda', searchTerm: 'soda', emoji: '🥤' },
    { name: 'Smoothie', searchTerm: 'smoothie', emoji: '🍹' },
    { name: 'Milkshake', searchTerm: 'milkshake', emoji: '🥛' },
    { name: 'Water', searchTerm: 'water', emoji: '💧' }
  ],
  dessert: [
    { name: 'Ice Cream', searchTerm: 'ice+cream', emoji: '🍨' },
    { name: 'Cake', searchTerm: 'cake', emoji: '🎂' },
    { name: 'Brownie', searchTerm: 'brownie', emoji: '🍫' },
    { name: 'Cookies', searchTerm: 'cookies', emoji: '🍪' },
    { name: 'Cupcake', searchTerm: 'cupcake', emoji: '🧁' },
    { name: 'Tart', searchTerm: 'fruit+tart', emoji: '🥧' }
  ],
  entertainment: [
    { name: 'Watch a movie', searchTerm: 'cinema', emoji: '🎬' },
    { name: 'Go for a walk', searchTerm: 'park', emoji: '🚶' },
    { name: 'Play a game', searchTerm: 'arcade', emoji: '🎮' },
    { name: 'Visit a museum', searchTerm: 'museum', emoji: '🏛️' },
    { name: 'Attend a concert', searchTerm: 'concert', emoji: '🎤' },
    { name: 'Bowling', searchTerm: 'bowling', emoji: '🎳' }
  ]
};

let currentCategory = null;

document.querySelectorAll('.category-btn').forEach(button => {
  button.addEventListener('click', function() {
    currentCategory = this.dataset.category;
    generateRandom(currentCategory);
  });
});
// Start of code from unsplash
async function getUnsplashImage(searchTerm) {
  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?client_id=${UNSPLASH_ACCESS_KEY}&query=${searchTerm}&orientation=landscape&fit=fill&w=400&h=300`
    );
    // End of code from unsplash
    if (!response.ok) throw new Error('Image not found');
    
    const data = await response.json();
    return data.urls.regular;
  } catch (error) {
    console.error('Error fetching image:', error);
    return `https://source.unsplash.com/random/400x300/?${searchTerm}`;
  }
}

async function generateRandom(category) {
  const resultBox = document.getElementById('resultBox');
  const resultText = document.getElementById('resultText');
  const resultImage = document.getElementById('resultImage');
  const loader = document.querySelector('.result-loader');


  resultBox.classList.remove('hidden');
  resultBox.classList.add('visible');
  loader.style.display = 'flex';
  resultImage.classList.remove('loaded');
  resultText.textContent = 'Choosing your perfect match...';
// Start of code from weekly tutorials
  try {
    const choices = options[category];
    const randomChoice = choices[Math.floor(Math.random() * choices.length)];
        // End of code from weekly tutorials
    const imageUrl = await getUnsplashImage(randomChoice.searchTerm);


    resultImage.src = imageUrl;
    resultImage.onload = () => {
      loader.style.display = 'none';
      resultImage.classList.add('loaded');
      resultText.textContent = `${randomChoice.emoji} ${randomChoice.name}`;
    };

    resultImage.onerror = () => {
      throw new Error('Image failed to load');
    };

  } catch (error) {
    loader.style.display = 'none';
    resultText.textContent = '🎉 Let\'s try something new!';
    resultImage.src = `https://source.unsplash.com/random/400x300/?${category}`;
  }
}

function retrySelection() {
  if (currentCategory) generateRandom(currentCategory);
}