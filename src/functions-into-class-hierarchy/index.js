import { Bird, createBird } from './bird';

export function plumages(birds) {
  return new Map(birds.map(b => [b.name, plumage(b)]));
}

export function speeds(birds) {
  return new Map(birds.map(b => [b.name, airSpeedVelocity(b)]));
}

export function plumage(bird) {
  return createBird(bird).plumage;
}

export function airSpeedVelocity(bird) {
  return createBird(bird).airSpeedVelocity;
}
