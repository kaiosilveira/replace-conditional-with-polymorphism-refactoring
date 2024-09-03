import { Bird, EuropeanSwallow, AfricanSwallow, NorwegianBlueParrot, createBird } from './index';

describe('Bird', () => {
  describe('plumage', () => {
    it('should throw an error if bird type is EuropeanSwallow', () => {
      const bird = new Bird({ type: 'EuropeanSwallow' });
      expect(() => bird.plumage).toThrow('oops');
    });

    it('should throw an error if bird type is AfricanSwallow', () => {
      const bird = new Bird({ type: 'AfricanSwallow' });
      expect(() => bird.plumage).toThrow('oops');
    });

    it('should return "scorched" for NorwegianBlueParrot with voltage greater than 100', () => {
      const bird = new Bird({ type: 'NorwegianBlueParrot', voltage: 101 });
      expect(bird.plumage).toBe('scorched');
    });

    it('should return "beautiful" for NorwegianBlueParrot with voltage 100 or less', () => {
      const bird = new Bird({ type: 'NorwegianBlueParrot', voltage: 100 });
      expect(bird.plumage).toBe('beautiful');
    });

    it('should return "unknown" for unknown bird type', () => {
      const bird = new Bird({ type: 'Unknown' });
      expect(bird.plumage).toBe('unknown');
    });
  });

  describe('airSpeedVelocity', () => {
    it('should return 35 for EuropeanSwallow', () => {
      const bird = new Bird({ type: 'EuropeanSwallow' });
      expect(bird.airSpeedVelocity).toBe(35);
    });

    it('should return 38 for AfricanSwallow with 1 coconut', () => {
      const bird = new Bird({ type: 'AfricanSwallow', numberOfCoconuts: 1 });
      expect(bird.airSpeedVelocity).toBe(38);
    });

    it('should return 36 for AfricanSwallow with 2 coconuts', () => {
      const bird = new Bird({ type: 'AfricanSwallow', numberOfCoconuts: 2 });
      expect(bird.airSpeedVelocity).toBe(36);
    });

    it('should return 0 for nailed NorwegianBlueParrot', () => {
      const bird = new Bird({ type: 'NorwegianBlueParrot', isNailed: true });
      expect(bird.airSpeedVelocity).toBe(0);
    });

    it('should return 20 for NorwegianBlueParrot with voltage 100', () => {
      const bird = new Bird({ type: 'NorwegianBlueParrot', voltage: 100 });
      expect(bird.airSpeedVelocity).toBe(20);
    });

    it('should return 15 for NorwegianBlueParrot with voltage 50', () => {
      const bird = new Bird({ type: 'NorwegianBlueParrot', voltage: 50 });
      expect(bird.airSpeedVelocity).toBe(15);
    });

    it('should return null for unknown bird type', () => {
      const bird = new Bird({ type: 'Unknown' });
      expect(bird.airSpeedVelocity).toBe(null);
    });
  });
});

describe('EuropeanSwallow', () => {
  describe('plumage', () => {
    it('should return "average"', () => {
      const bird = new EuropeanSwallow({ type: 'EuropeanSwallow' });
      expect(bird.plumage).toBe('average');
    });
  });
});

describe('AfricanSwallow', () => {
  describe('plumage', () => {
    it('should return "tired" for more than 2 coconuts', () => {
      const bird = new AfricanSwallow({ type: 'AfricanSwallow', numberOfCoconuts: 3 });
      expect(bird.plumage).toBe('tired');
    });

    it('should return "average" for 2 or less coconuts', () => {
      const bird = new AfricanSwallow({ type: 'AfricanSwallow', numberOfCoconuts: 2 });
      expect(bird.plumage).toBe('average');
    });
  });
});

describe('NorwegianBlueParrot', () => {
  describe('plumage', () => {
    it('should return 0 for nailed NorwegianBlueParrot', () => {
      const bird = new NorwegianBlueParrot({ type: 'NorwegianBlueParrot', isNailed: true });
      expect(bird.airSpeedVelocity).toBe(0);
    });

    it('should return 20 for NorwegianBlueParrot with voltage 100', () => {
      const bird = new NorwegianBlueParrot({ type: 'NorwegianBlueParrot', voltage: 100 });
      expect(bird.airSpeedVelocity).toBe(20);
    });

    it('should return 15 for NorwegianBlueParrot with voltage 50', () => {
      const bird = new NorwegianBlueParrot({ type: 'NorwegianBlueParrot', voltage: 50 });
      expect(bird.airSpeedVelocity).toBe(15);
    });
  });
});

describe('createBird', () => {
  it('should return an instance of EuropeanSwallow for type EuropeanSwallow', () => {
    const bird = { type: 'EuropeanSwallow' };
    expect(createBird(bird)).toBeInstanceOf(EuropeanSwallow);
  });

  it('should return an instance of AfricanSwallow for type AfricanSwallow', () => {
    const bird = { type: 'AfricanSwallow' };
    expect(createBird(bird)).toBeInstanceOf(AfricanSwallow);
  });

  it('should return an instance of NorwegianBlueParrot for type NorwegianBlueParrot', () => {
    const bird = { type: 'NorwegianBlueParrot' };
    expect(createBird(bird)).toBeInstanceOf(NorwegianBlueParrot);
  });

  it('should return an instance of Bird for unknown type', () => {
    const bird = { type: 'Unknown' };
    expect(createBird(bird)).toBeInstanceOf(Bird);
  });
});
