const options = {
  food: [
    { name: 'Pizza', img: 'img/pizza.jpg' },
    { name: 'Sushi', img: 'img/sushi.jpg' },
    { name: 'Tacos', img: 'img/tacos.jpg' },
    { name: 'Burger', img: 'img/burger.jpg' },
    { name: 'Pasta', img: 'img/pasta.jpg' },
    { name: 'Salad', img: 'img/salad.jpg' }, 
  ],
  drink: [
    { name: 'Coffee', img: 'img/coffee.jpg' },
    { name: 'Tea', img: 'img/tea.jpg' },
    { name: 'Soda', img: 'img/soda.jpg' },
    { name: 'Smoothie', img: 'img/smoothie.jpg' },
    { name: 'Milkshake', img: 'img/milkshake.jpg' },
    { name: 'Water', img: 'img/water.jpg' }, 
  ],
  dessert: [
    { name: 'Ice Cream', img: 'img/ice_cream.jpg' },
    { name: 'Cake', img: 'img/cake.jpg' },
    { name: 'Brownie', img: 'img/brownie.jpg' },
    { name: 'Cookies', img: 'img/cookies.jpg' },
    { name: 'Cupcake', img: 'img/cupcake.jpg' },
    { name: 'Tart', img: 'img/tart.jpg' }, 
  ],
  entertainment: [
    { name: 'Watch a movie', img: 'img/movie.jpg' },
    { name: 'Go for a walk', img: 'img/walk.jpg' },
    { name: 'Play a game', img: 'img/game.jpg' },
    { name: 'Visit a museum', img: 'img/museum.jpg' },
    { name: 'Attend a concert', img: 'img/concert.jpg' },
    { name: 'Bowling', img: 'img/bowling.jpg' }, 
  ],
};

function generateRandom(category) {
  const choices = options[category];
  const randomChoice = choices[Math.floor(Math.random() * choices.length)];

  const resultBox = document.getElementById('resultBox');
  const resultText = document.getElementById('resultText');
  const resultImage = document.getElementById('resultImage');

  resultBox.classList.remove('hidden');
  resultImage.src = randomChoice.img;
  resultImage.alt = randomChoice.name;
  resultImage.classList.remove('hidden');
  resultText.textContent = randomChoice.name;
}