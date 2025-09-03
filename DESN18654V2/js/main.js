
const options = {
  food: [
    { name: 'Pizza', img: 'img/pizza.jpg', emoji: '🍕' },
    { name: 'Sushi', img: 'img/sushi.jpg', emoji: '🍣' },
    { name: 'Tacos', img: 'img/tacos.jpg', emoji: '🌮' },
    { name: 'Burger', img: 'img/burger.jpg', emoji: '🍔' },
    { name: 'Pasta', img: 'img/pasta.jpg', emoji: '🍝' },
    { name: 'Salad', img: 'img/salad.jpg', emoji: '🥗' }
  ],
  drink: [
    { name: 'Coffee', img: 'img/coffee.jpg', emoji: '☕' },
    { name: 'Tea', img: 'img/tea.jpg', emoji: '🍵' },
    { name: 'Soda', img: 'img/soda.jpg', emoji: '🥤' },
    { name: 'Smoothie', img: 'img/smoothie.jpg', emoji: '🍹' },
    { name: 'Milkshake', img: 'img/milkshake.jpg', emoji: '🥛' },
    { name: 'Water', img: 'img/water.jpg', emoji: '💧' }
  ],
  dessert: [
    { name: 'Ice Cream', img: 'img/ice_cream.jpg', emoji: '🍨' },
    { name: 'Cake', img: 'img/cake.jpg', emoji: '🎂' },
    { name: 'Brownie', img: 'img/brownie.jpg', emoji: '🍫' },
    { name: 'Cookies', img: 'img/cookies.jpg', emoji: '🍪' },
    { name: 'Cupcake', img: 'img/cupcake.jpg', emoji: '🧁' },
    { name: 'Tart', img: 'img/tart.jpg', emoji: '🥧' }
  ],
  entertainment: [
    { name: 'Watch a movie', img: 'img/movie.jpg', emoji: '🎬' },
    { name: 'Go for a walk', img: 'img/walk.jpg', emoji: '🚶' },
    { name: 'Play a game', img: 'img/game.jpg', emoji: '🎮' },
    { name: 'Visit a museum', img: 'img/museum.jpg', emoji: '🏛️' },
    { name: 'Attend a concert', img: 'img/concert.jpg', emoji: '🎤' },
    { name: 'Bowling', img: 'img/bowling.jpg', emoji: '🎳' }
  ]
};

let currentCategory = null;

document.querySelectorAll('.category-btn').forEach(button => {
  button.addEventListener('click', function() {
    currentCategory = this.dataset.category;
    generateRandom(currentCategory);
  });
});

function generateRandom(category) {
  const resultBox = document.getElementById('resultBox');
  const resultText = document.getElementById('resultText');
  const resultImage = document.getElementById('resultImage');
  const loader = document.querySelector('.result-loader');


  resultBox.classList.remove('hidden');
  resultBox.classList.add('visible');
  loader.style.display = 'block';
  resultImage.classList.remove('loaded');
  resultText.textContent = 'Choosing your perfect match...';

  setTimeout(() => {
    const choices = options[category];
    const randomChoice = choices[Math.floor(Math.random() * choices.length)];
    
    resultImage.onload = () => {
      loader.style.display = 'none';
      resultImage.classList.add('loaded');
      resultText.textContent = `${randomChoice.emoji} ${randomChoice.name}`;
      resultBox.classList.add('pop');
    };

    resultImage.src = randomChoice.img;
    
    resultImage.onerror = () => {
      loader.style.display = 'none';
      resultText.textContent = '🎉 Let\'s try something new!';
      resultImage.src = 'img/pizza.jpg';
    };
  }, 800);
}

function retrySelection() {
  if (currentCategory) {
    generateRandom(currentCategory);
  }
}