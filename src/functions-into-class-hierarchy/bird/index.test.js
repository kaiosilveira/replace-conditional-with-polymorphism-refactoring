import { Bird, EuropeanSwallow, AfricanSwallow, NorwegianBlueParrot, createBird } from './index';

describe('Bird', () => {
  describe('plumage', () => {
    it('should return "unknown"', () => {
      const bird = new Bird({ type: 'Unknown' });
      expect(bird.plumage).toBe('unknown');
    });
  });

  describe('airSpeedVelocity', () => {
    it('should return null', () => {
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

  describe('airSpeedVelocity', () => {
    it('should return 35', () => {
      const bird = new EuropeanSwallow({ type: 'EuropeanSwallow' });
      expect(bird.airSpeedVelocity).toBe(35);
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

  describe('airSpeedVelocity', () => {
    it('should return 38 for 1 coconut', () => {
      const bird = new AfricanSwallow({ type: 'AfricanSwallow', numberOfCoconuts: 1 });
      expect(bird.airSpeedVelocity).toBe(38);
    });

    it('should return 36 for 2 coconuts', () => {
      const bird = new AfricanSwallow({ type: 'AfricanSwallow', numberOfCoconuts: 2 });
      expect(bird.airSpeedVelocity).toBe(36);
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

  describe('airSpeedVelocity', () => {
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
