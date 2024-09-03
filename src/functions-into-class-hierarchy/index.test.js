import { speeds, plumages } from './index';

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
    expect(result.get('bird1')).toBe('average');
    expect(result.get('bird2')).toBe('average');
    expect(result.get('bird3')).toBe('tired');
    expect(result.get('bird4')).toBe('beautiful');
    expect(result.get('bird5')).toBe('scorched');
    expect(result.get('bird6')).toBe('unknown');
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
