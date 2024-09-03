import { Bird } from './bird';

export function plumages(birds) {
  return new Map(birds.map(b => [b.name, plumage(b)]));
}

export function speeds(birds) {
  return new Map(birds.map(b => [b.name, airSpeedVelocity(b)]));
}

export function plumage(bird) {
  return new Bird(bird).plumage;
}

export function airSpeedVelocity(bird) {
  switch (bird.type) {
    case 'EuropeanSwallow':
      return 35;
    case 'AfricanSwallow':
      return 40 - 2 * bird.numberOfCoconuts;
    case 'NorwegianBlueParrot':
      return bird.isNailed ? 0 : 10 + bird.voltage / 10;
    default:
      return null;
  }
}
