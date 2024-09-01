import { voyageProfitFactor, hasChina, captainHistoryRisk, rating, voyageRisk } from '.';

const createHistory = ({ length, zone }) => Array.from({ length }, () => ({ zone }));

const emptyHistory = createHistory({ length: 0 });
const latamVoyage = { zone: 'latam' };
const chinaVoyage = { zone: 'china' };
const eastIndiesVoyage = { zone: 'east-indies' };

describe('rating', () => {
  it('should return "A" if voyage profit factor is 3 times greater than voyage risk plus captain history risk times 2', () => {
    const voyage = { zone: 'latam' };
    const history = createHistory({ length: 10, zone: 'latam' });
    expect(rating(voyage, history)).toEqual('A');
  });

  it('should return "B" if voyage profit factor is not 3 times greater than voyage risk plus captain history risk times 2', () => {
    const voyage = { zone: 'china' };
    const history = createHistory({ length: 1, zone: 'China' });
    expect(rating(voyage, history)).toEqual('B');
  });
});

describe('voyageRisk', () => {
  it('should return 1 as base value of voyage risk', () => {
    expect(voyageRisk(latamVoyage, emptyHistory)).toEqual(1);
  });

  it('should add 2 risk points if voyage length is greater than 4', () => {
    const voyage = { zone: 'latam', length: 5 };
    expect(voyageRisk(voyage, emptyHistory)).toEqual(3);
  });

  it('should add 1 risk point per voyage length above eight', () => {
    const voyage = { zone: 'latam', length: 9 };
    expect(voyageRisk(voyage, emptyHistory)).toEqual(4);
  });

  it('should add 4 risk points if voyage zone is China', () => {
    expect(voyageRisk(chinaVoyage, emptyHistory)).toEqual(5);
  });

  it('should add 4 risk points if voyage zone is East Indies', () => {
    expect(voyageRisk(eastIndiesVoyage, emptyHistory)).toEqual(5);
  });
});

describe('captainHistoryRisk', () => {
  it('should return 1 as base value of captain history risk', () => {
    const fiveTripHistory = createHistory({ length: 5, zone: 'latam' });
    expect(captainHistoryRisk(latamVoyage, fiveTripHistory)).toEqual(1);
  });

  it('should add 4 risk points if history has less than 5 trips', () => {
    const fourTripHistory = createHistory({ length: 4, zone: 'latam' });
    expect(captainHistoryRisk(latamVoyage, fourTripHistory)).toEqual(5);
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

describe('voyageProfitFactor', () => {
  it('should return 2 as base value of profit factor', () => {
    expect(voyageProfitFactor(latamVoyage, emptyHistory)).toEqual(2);
  });

  it('should add 1 point to profit factor if voyage zone is east-indies', () => {
    expect(voyageProfitFactor(eastIndiesVoyage, emptyHistory)).toEqual(3);
  });

  describe('voyage is to China', () => {
    const captainTripsHistory = [chinaVoyage];

    it('should add 1 point to profit factor', () => {
      expect(voyageProfitFactor(chinaVoyage, emptyHistory)).toEqual(3);
    });

    describe('captain has experience with voyages to China', () => {
      it('should add 3 points to the profit factor', () => {
        expect(voyageProfitFactor(chinaVoyage, captainTripsHistory)).toEqual(6);
      });

      it('should add 1 more point if the captain has more than 10 trips in their history', () => {
        const history = createHistory({ length: 11, zone: 'china' });
        expect(voyageProfitFactor(chinaVoyage, history)).toEqual(7);
      });

      describe('voyage is long', () => {
        const history = createHistory({ length: 1, zone: 'china' });

        it('should add 1 more point if the voyage has a length greater than 12', () => {
          const longChinaVoyage = { ...chinaVoyage, length: 13 };
          expect(voyageProfitFactor(longChinaVoyage, history)).toEqual(7);
        });

        it('should remove 1 point if the voyage has a length greater than 18', () => {
          const longChinaVoyage = { ...chinaVoyage, length: 19 };
          expect(voyageProfitFactor(longChinaVoyage, history)).toEqual(6);
        });
      });
    });
  });

  describe('voyage is not to China', () => {
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
