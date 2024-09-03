import { createBird } from './bird';

export function plumages(birds) {
  return new Map(birds.map(b => createBird(b)).map(b => [b.name, b.plumage]));
}

export function speeds(birds) {
  return new Map(birds.map(b => [b.name, airSpeedVelocity(b)]));
}

export function airSpeedVelocity(bird) {
  return createBird(bird).airSpeedVelocity;
}
