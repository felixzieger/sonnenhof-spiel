import { AnimalType } from '../components/Game';

export const getAnimalName = (type: AnimalType['type']): string => {
  switch (type) {
    case 'cat':
      return 'Katze';
    case 'chicken':
      return 'Huhn';
    case 'pig':
      return 'Schwein';
    case 'horse':
      return 'Pferd';
    default:
      return 'Tier';
  }
};