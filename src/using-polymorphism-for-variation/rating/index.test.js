import { Rating, ExperiencedChinaRating, createRating } from '.';

const createHistory = ({ length, zone, profit = 0 }) =>
  Array.from({ length }, () => ({ zone, profit }));

const emptyHistory = createHistory({ length: 0 });
const latamVoyage = { zone: 'latam' };
const chinaVoyage = { zone: 'china' };
const eastIndiesVoyage = { zone: 'east-indies' };

describe('Rating', () => {
  describe('value', () => {
    it('should return "A" if voyage profit factor is 3 times greater than voyage risk plus captain history risk times 2', () => {
      const voyage = { zone: 'latam' };
      const history = createHistory({ length: 10, zone: 'latam' });
      const rating = new Rating(voyage, history);
      expect(rating.value).toEqual('A');
    });

    it('should return "B" if voyage profit factor is not 3 times greater than voyage risk plus captain history risk times 2', () => {
      const voyage = { zone: 'china' };
      const history = createHistory({ length: 1, zone: 'China' });
      const rating = new Rating(voyage, history);
      expect(rating.value).toEqual('B');
    });
  });

  describe('voyageRisk', () => {
    it('should return 1 as base value of voyage risk', () => {
      const rating = new Rating(latamVoyage, emptyHistory);
      expect(rating.voyageRisk).toEqual(1);
    });

    it('should add 2 risk points if voyage length is greater than 4', () => {
      const voyage = { zone: 'latam', length: 5 };
      const rating = new Rating(voyage, emptyHistory);
      expect(rating.voyageRisk).toEqual(3);
    });

    it('should add 1 risk point per voyage length above eight', () => {
      const voyage = { zone: 'latam', length: 9 };
      const rating = new Rating(voyage, emptyHistory);
      expect(rating.voyageRisk).toEqual(4);
    });

    it('should add 4 risk points if voyage zone is China', () => {
      const rating = new Rating(chinaVoyage, emptyHistory);
      expect(rating.voyageRisk).toEqual(5);
    });

    it('should add 4 risk points if voyage zone is East Indies', () => {
      const rating = new Rating(eastIndiesVoyage, emptyHistory);
      expect(rating.voyageRisk).toEqual(5);
    });
  });

  describe('captainHistoryRisk', () => {
    it('should return 1 as base value of captain history risk', () => {
      const fiveTripHistory = createHistory({ length: 5, zone: 'latam' });
      const rating = new Rating(latamVoyage, fiveTripHistory);
      expect(rating.captainHistoryRisk).toEqual(1);
    });

    it('should add 4 risk points if history has less than 5 trips', () => {
      const fourTripHistory = createHistory({ length: 4, zone: 'latam' });
      const rating = new Rating(latamVoyage, fourTripHistory);
      expect(rating.captainHistoryRisk).toEqual(5);
    });

    it('should add 1 risk point for each trip with negative profit', () => {
      const history = [{ profit: 1 }, { profit: -1 }, { profit: -2 }, { profit: 2 }, { profit: 2 }];
      const rating = new Rating(latamVoyage, history);
      expect(rating.captainHistoryRisk).toEqual(3);
    });
  });

  describe('voyageProfitFactor', () => {
    it('should return 2 as base value of profit factor', () => {
      const rating = new Rating(latamVoyage, emptyHistory);
      expect(rating.voyageProfitFactor).toEqual(2);
    });

    it('should add 1 point to profit factor if voyage zone is china', () => {
      const rating = new Rating(chinaVoyage, emptyHistory);
      expect(rating.voyageProfitFactor).toEqual(3);
    });

    it('should add 1 point to profit factor if voyage zone is east-indies', () => {
      const rating = new Rating(eastIndiesVoyage, emptyHistory);
      expect(rating.voyageProfitFactor).toEqual(3);
    });

    it('should add 1 point if history has more than 8 trips', () => {
      const history = Array.from({ length: 9 }, () => latamVoyage);
      const rating = new Rating(latamVoyage, history);
      expect(rating.voyageProfitFactor).toEqual(3);
    });

    it('should remove 1 point if voyage length is more than 14', () => {
      const voyage = { zone: 'latam', length: 15 };
      const rating = new Rating(voyage, emptyHistory);
      expect(rating.voyageProfitFactor).toEqual(1);
    });
  });

  describe('hasChinaHistory', () => {
    it('should return true if history has a trip to China', () => {
      const history = [{ zone: 'latam' }, { zone: 'china' }];
      const rating = new Rating(latamVoyage, history);
      expect(rating.hasChinaHistory).toBeTruthy();
    });

    it('should return false if history has no trip to China', () => {
      const history = [{ zone: 'latam' }, { zone: 'east-indies' }];
      const rating = new Rating(latamVoyage, history);
      expect(rating.hasChinaHistory).toBeFalsy();
    });

    it('should return false if history is empty', () => {
      const rating = new Rating(latamVoyage, emptyHistory);
      expect(rating.hasChinaHistory).toBeFalsy();
    });
  });

  describe('voyageLengthFactor', () => {
    it('should return 0 as base value of profit factor', () => {
      const rating = new Rating(latamVoyage, emptyHistory);
      expect(rating.voyageLengthFactor).toEqual(0);
    });

    it('should remove 1 point if voyage length is greater than 14', () => {
      const voyage = { zone: 'latam', length: 15 };
      const rating = new Rating(voyage, emptyHistory);
      expect(rating.voyageLengthFactor).toEqual(-1);
    });
  });

  describe('historyLengthFactor', () => {
    it('should return 0 if history length is less than 8', () => {
      const history = Array.from({ length: 7 }, () => latamVoyage);
      const rating = new Rating(latamVoyage, history);
      expect(rating.historyLengthFactor).toEqual(0);
    });

    it('should return 1 if history length is more than 8', () => {
      const history = Array.from({ length: 9 }, () => latamVoyage);
      const rating = new Rating(latamVoyage, history);
      expect(rating.historyLengthFactor).toEqual(1);
    });
  });
});

describe('ExperiencedChinaRating', () => {
  describe('value', () => {
    it('should return "A" if voyage profit factor is 3 times greater than voyage risk plus captain history risk times 2', () => {
      const voyage = { zone: 'latam' };
      const history = createHistory({ length: 10, zone: 'latam' });
      const rating = new ExperiencedChinaRating(voyage, history);
      expect(rating.value).toEqual('A');
    });

    it('should return "B" if voyage profit factor is not 3 times greater than voyage risk plus captain history risk times 2', () => {
      const history = createHistory({ length: 20, zone: 'China', profit: -1 });
      const rating = new ExperiencedChinaRating(chinaVoyage, history);
      expect(rating.value).toEqual('B');
    });
  });

  describe('voaygeRisk', () => {
    describe('since voyage is always to China', () => {
      it('should add 4 risk points to voyage risk', () => {
        const rating = new ExperiencedChinaRating(chinaVoyage, emptyHistory);
        expect(rating.voyageRisk).toEqual(5);
      });
    });
  });

  describe('captainHistoryRisk', () => {
    it('should add 4 risk points if history has less than 5 trips', () => {
      const fourTripHistory = createHistory({ length: 4, zone: 'latam' });
      const rating = new ExperiencedChinaRating(latamVoyage, fourTripHistory);
      expect(rating.captainHistoryRisk).toEqual(3);
    });

    it('should add 1 risk point for each trip with negative profit', () => {
      const history = [{ profit: 1 }, { profit: -1 }, { profit: -2 }, { profit: 2 }, { profit: 2 }];
      const rating = new ExperiencedChinaRating(latamVoyage, history);
      expect(rating.captainHistoryRisk).toEqual(1);
    });

    it('should return zero if captain history risk is negative', () => {
      const fiveTripHistory = createHistory({ length: 5, zone: 'latam' });
      const rating = new ExperiencedChinaRating(latamVoyage, fiveTripHistory);
      expect(rating.captainHistoryRisk).toEqual(0);
    });

    describe('since voyage is always to China', () => {
      it('should remove 2 risk points from history risk', () => {
        const history = [{ zone: 'china' }];
        const rating = new ExperiencedChinaRating(chinaVoyage, history);
        expect(rating.captainHistoryRisk).toEqual(3);
      });
    });
  });

  describe('voyageProfitFactor', () => {
    const captainTripsHistory = [chinaVoyage];

    describe('captain has experience with voyages to China', () => {
      it('should add 3 points to the profit factor', () => {
        const rating = new ExperiencedChinaRating(chinaVoyage, captainTripsHistory);
        expect(rating.voyageProfitFactor).toEqual(6);
      });

      it('should add 1 more point if the captain has more than 10 trips in their history', () => {
        const history = createHistory({ length: 11, zone: 'china' });
        const rating = new ExperiencedChinaRating(chinaVoyage, history);
        expect(rating.voyageProfitFactor).toEqual(7);
      });

      describe('voyage is long', () => {
        const history = createHistory({ length: 1, zone: 'china' });

        it('should add 1 more point if the voyage has a length greater than 12', () => {
          const longChinaVoyage = { ...chinaVoyage, length: 13 };
          const rating = new ExperiencedChinaRating(longChinaVoyage, history);
          expect(rating.voyageProfitFactor).toEqual(7);
        });

        it('should remove 1 point if the voyage has a length greater than 18', () => {
          const longChinaVoyage = { ...chinaVoyage, length: 19 };
          const rating = new ExperiencedChinaRating(longChinaVoyage, history);
          expect(rating.voyageProfitFactor).toEqual(6);
        });
      });
    });
  });

  describe('voyageLengthFactor', () => {
    it('should return 3 as base value of profit factor', () => {
      const rating = new ExperiencedChinaRating(latamVoyage, emptyHistory);
      expect(rating.voyageLengthFactor).toEqual(3);
    });

    it('should add 1 point if voyage length is greater than 12', () => {
      const longChinaVoyage = { ...chinaVoyage, length: 13 };
      const history = Array.from({ length: 5 }, () => chinaVoyage);
      const rating = new ExperiencedChinaRating(longChinaVoyage, history);
      expect(rating.voyageLengthFactor).toEqual(4);
    });

    it('should remove 1 point if voyage length is greater than 18', () => {
      const extraLongChinaVoyage = { ...chinaVoyage, length: 19 };
      const history = Array.from({ length: 5 }, () => chinaVoyage);
      const rating = new ExperiencedChinaRating(extraLongChinaVoyage, history);
      expect(rating.voyageLengthFactor).toEqual(3);
    });
  });

  describe('historyLengthFactor', () => {
    it('should return 0 if history length is less than 10', () => {
      const history = Array.from({ length: 9 }, () => latamVoyage);
      const rating = new ExperiencedChinaRating(latamVoyage, history);
      expect(rating.historyLengthFactor).toEqual(0);
    });

    it('should return 1 if history length is more than 10', () => {
      const history = Array.from({ length: 11 }, () => latamVoyage);
      const rating = new ExperiencedChinaRating(latamVoyage, history);
      expect(rating.historyLengthFactor).toEqual(1);
    });
  });
});

describe('createRating', () => {
  it('should return an ExperiencedChinaRating instance if voyage zone is china and history has a trip to China', () => {
    const voyage = { zone: 'china' };
    const history = [{ zone: 'china' }];
    const rating = createRating(voyage, history);
    expect(rating instanceof ExperiencedChinaRating).toBeTruthy();
  });

  it('should return a Rating instance if voyage zone is not china or history has no trip to China', () => {
    const voyage = { zone: 'latam' };
    const history = [{ zone: 'latam' }];
    const rating = createRating(voyage, history);
    expect(rating instanceof Rating).toBeTruthy();
  });
});
