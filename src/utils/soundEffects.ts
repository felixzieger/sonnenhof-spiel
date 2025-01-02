const playSound = (soundUrl: string) => {
  const audio = new Audio(soundUrl);
  audio.play().catch(error => {
    console.log('Error playing sound:', error);
  });
};

export const playCatchSound = (animalType: string) => {
  switch (animalType) {
    case 'cat':
      playSound('/sounds/meow.mp3');
      break;
    case 'horse':
      playSound('/sounds/neigh.mp3');
      break;
    case 'pig':
      playSound('/sounds/oink.mp3');
      break;
    case 'chicken':
      playSound('/sounds/cluck.mp3');
      break;
  }
};