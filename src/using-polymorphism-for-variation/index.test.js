import { voyageProfitFactor, hasChina, captainHistoryRisk } from '.';

const createHistory = ({ length, zone }) => Array.from({ length }, () => ({ zone }));

const emptyHistory = createHistory({ length: 0 });
const latamVoyage = { zone: 'latam' };
const chinaVoyage = { zone: 'china' };
const eastIndiesVoyage = { zone: 'east-indies' };

describe('voyageProfitFactor', () => {
  it('should return 2 as base value of profit factor', () => {
    expect(voyageProfitFactor(latamVoyage, emptyHistory)).toEqual(2);
  });

  it('should add 1 point to profit factor if voyage zone is china', () => {
    expect(voyageProfitFactor(chinaVoyage, emptyHistory)).toEqual(3);
  });

  it('should add 1 point to profit factor if voyage zone is east-indies', () => {
    expect(voyageProfitFactor(eastIndiesVoyage, emptyHistory)).toEqual(3);
  });

  describe('captain has gone to China before', () => {
    const captainTripsHistory = [chinaVoyage];

    it('should add 3 points to the profit factor if voyage zone is china', () => {
      expect(voyageProfitFactor(chinaVoyage, captainTripsHistory)).toEqual(6);
    });

    it('should add 1 more point if the captain is experienced (has more than 10 trips in history)', () => {
      const history = createHistory({ length: 11, zone: 'china' });
      expect(voyageProfitFactor(chinaVoyage, history)).toEqual(7);
    });

    it('should add 1 more point if the captain is very experienced (has more than 12 trips in history)', () => {
      const history = Array.from({ length: 13 }, () => chinaVoyage);
      expect(voyageProfitFactor(chinaVoyage, history)).toEqual(8);
    });

    it('should remove 1 point if the captain is too experienced (has more than 18 trips in history)', () => {
      const history = Array.from({ length: 19 }, () => chinaVoyage);
      expect(voyageProfitFactor(chinaVoyage, history)).toEqual(7);
    });
  });

  describe('captain has not been to China before', () => {
    it('should add 1 point if history has more than 8 trips', () => {
      const history = Array.from({ length: 9 }, () => latamVoyage);
      expect(voyageProfitFactor(latamVoyage, history)).toEqual(3);
    });

    it('should remove 1 point if voyage length is more than 14', () => {
      const voyage = { zone: 'latam', length: 15 };
      expect(voyageProfitFactor(voyage, emptyHistory)).toEqual(1);
    });
  });
});

describe('hasChina', () => {
  it('should return true if history has a trip to China', () => {
    const history = [{ zone: 'latam' }, { zone: 'china' }];
    expect(hasChina(history)).toBeTruthy();
  });

  it('should return false if history has no trip to China', () => {
    const history = [{ zone: 'latam' }, { zone: 'east-indies' }];
    expect(hasChina(history)).toBeFalsy();
  });

  it('should return false if history is empty', () => {
    expect(hasChina(emptyHistory)).toBeFalsy();
  });
});

describe('captainHistoryRisk', () => {
  it('should add 4 risk points if history has no trips', () => {
    expect(captainHistoryRisk(latamVoyage, emptyHistory)).toEqual(5);
  });

  it('should add 4 risk points if history has less than 5 trips', () => {
    const fourTripHistory = createHistory({ length: 4, zone: 'latam' });
    expect(captainHistoryRisk(latamVoyage, fourTripHistory)).toEqual(5);
  });

  it('should return 1 as base value of captain history risk', () => {
    const fiveTripHistory = createHistory({ length: 5, zone: 'latam' });
    expect(captainHistoryRisk(latamVoyage, fiveTripHistory)).toEqual(1);
  });

  it('should add 1 risk point for each trip with negative profit', () => {
    const history = [{ profit: 1 }, { profit: -1 }, { profit: -2 }, { profit: 2 }, { profit: 2 }];
    expect(captainHistoryRisk(latamVoyage, history)).toEqual(3);
  });

  it('should remove 2 risk points if captain has been to China and voyage zone is China', () => {
    const history = [{ zone: 'china' }];
    expect(captainHistoryRisk(chinaVoyage, history)).toEqual(3);
  });

  it('should return zero if captain history risk is negative', () => {
    const history = [
      { zone: 'china', profit: 1 },
      { profit: 2 },
      { profit: 2 },
      { profit: 2 },
      { profit: 2 },
    ];

    expect(captainHistoryRisk(chinaVoyage, history)).toEqual(0);
  });
});
