export class Bird {
  constructor(birdObject) {
    Object.assign(this, birdObject);
  }

  get plumage() {
    return 'unknown';
  }

  get airSpeedVelocity() {
    switch (this.type) {
      case 'EuropeanSwallow':
        return 35;
      case 'AfricanSwallow':
        return 40 - 2 * this.numberOfCoconuts;
      case 'NorwegianBlueParrot':
        return this.isNailed ? 0 : 10 + this.voltage / 10;
      default:
        return null;
    }
  }
}

export class EuropeanSwallow extends Bird {
  get plumage() {
    return 'average';
  }

  get airSpeedVelocity() {
    return 35;
  }
}

export class AfricanSwallow extends Bird {
  get plumage() {
    return this.numberOfCoconuts > 2 ? 'tired' : 'average';
  }

  get airSpeedVelocity() {
    return 40 - 2 * this.numberOfCoconuts;
  }
}

export class NorwegianBlueParrot extends Bird {
  get plumage() {
    return this.voltage > 100 ? 'scorched' : 'beautiful';
  }

  get airSpeedVelocity() {
    return this.isNailed ? 0 : 10 + this.voltage / 10;
  }
}

export function createBird(birdObject) {
  switch (birdObject.type) {
    case 'EuropeanSwallow':
      return new EuropeanSwallow(birdObject);
    case 'AfricanSwallow':
      return new AfricanSwallow(birdObject);
    case 'NorwegianBlueParrot':
      return new NorwegianBlueParrot(birdObject);
    default:
      return new Bird(birdObject);
  }
}
