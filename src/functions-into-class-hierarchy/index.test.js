import { speeds, airSpeedVelocity, plumage, plumages } from './index';

describe('plumage', () => {
  it('should return "average" for EuropeanSwallow', () => {
    const bird = { type: 'EuropeanSwallow' };
    expect(plumage(bird)).toBe('average');
  });

  it('should return "tired" for AfricanSwallow with more than 2 coconuts', () => {
    const bird = { type: 'AfricanSwallow', numberOfCoconuts: 3 };
    expect(plumage(bird)).toBe('tired');
  });

  it('should return "average" for AfricanSwallow with 2 or less coconuts', () => {
    const bird = { type: 'AfricanSwallow', numberOfCoconuts: 2 };
    expect(plumage(bird)).toBe('average');
  });

  it('should return "scorched" for NorwegianBlueParrot with voltage greater than 100', () => {
    const bird = { type: 'NorwegianBlueParrot', voltage: 101 };
    expect(plumage(bird)).toBe('scorched');
  });

  it('should return "beautiful" for NorwegianBlueParrot with voltage 100 or less', () => {
    const bird = { type: 'NorwegianBlueParrot', voltage: 100 };
    expect(plumage(bird)).toBe('beautiful');
  });

  it('should return "unknown" for unknown bird type', () => {
    const bird = { type: 'Unknown' };
    expect(plumage(bird)).toBe('unknown');
  });
});

describe('plumages', () => {
  it('should return a map containing the plumage of all birds in the list', () => {
    const birds = [
      { name: 'bird1', type: 'EuropeanSwallow' },
      { name: 'bird2', type: 'AfricanSwallow', numberOfCoconuts: 1 },
      { name: 'bird3', type: 'AfricanSwallow', numberOfCoconuts: 3 },
      { name: 'bird4', type: 'NorwegianBlueParrot', voltage: 100 },
      { name: 'bird5', type: 'NorwegianBlueParrot', voltage: 101 },
      { name: 'bird6', type: 'Unknown' },
    ];

    const result = plumages(birds);

    expect(result.size).toBe(6);
    expect(result.get('bird1')).toBe(plumage(birds[0]));
    expect(result.get('bird2')).toBe(plumage(birds[1]));
    expect(result.get('bird3')).toBe(plumage(birds[2]));
    expect(result.get('bird4')).toBe(plumage(birds[3]));
    expect(result.get('bird5')).toBe(plumage(birds[4]));
    expect(result.get('bird6')).toBe(plumage(birds[5]));
  });
});

describe('airSpeedVelocity', () => {
  it('should return 35 for EuropeanSwallow', () => {
    const bird = { type: 'EuropeanSwallow' };
    expect(airSpeedVelocity(bird)).toBe(35);
  });

  it('should return 38 for AfricanSwallow with 1 coconut', () => {
    const bird = { type: 'AfricanSwallow', numberOfCoconuts: 1 };
    expect(airSpeedVelocity(bird)).toBe(38);
  });

  it('should return 36 for AfricanSwallow with 2 coconuts', () => {
    const bird = { type: 'AfricanSwallow', numberOfCoconuts: 2 };
    expect(airSpeedVelocity(bird)).toBe(36);
  });

  it('should return 0 for nailed NorwegianBlueParrot', () => {
    const bird = { type: 'NorwegianBlueParrot', isNailed: true };
    expect(airSpeedVelocity(bird)).toBe(0);
  });

  it('should return 10 for NorwegianBlueParrot with voltage 0', () => {
    const bird = { type: 'NorwegianBlueParrot', voltage: 0 };
    expect(airSpeedVelocity(bird)).toBe(10);
  });

  it('should return 20 for NorwegianBlueParrot with voltage 100', () => {
    const bird = { type: 'NorwegianBlueParrot', voltage: 100 };
    expect(airSpeedVelocity(bird)).toBe(20);
  });
});

describe('speeds', () => {
  it('should return a map containing the air speed velocity of all birds in the list', () => {
    const birds = [
      { name: 'bird1', type: 'EuropeanSwallow' },
      { name: 'bird2', type: 'AfricanSwallow', numberOfCoconuts: 1 },
      { name: 'bird3', type: 'AfricanSwallow', numberOfCoconuts: 2 },
      { name: 'bird4', type: 'NorwegianBlueParrot', voltage: 100 },
      { name: 'bird5', type: 'NorwegianBlueParrot', voltage: 50 },
      { name: 'bird6', type: 'Unknown' },
    ];

    const result = speeds(birds);

    expect(result.size).toBe(6);
    expect(result.get('bird1')).toBe(35);
    expect(result.get('bird2')).toBe(38);
    expect(result.get('bird3')).toBe(36);
    expect(result.get('bird4')).toBe(20);
    expect(result.get('bird5')).toBe(15);
    expect(result.get('bird6')).toBe(null);
  });
});
