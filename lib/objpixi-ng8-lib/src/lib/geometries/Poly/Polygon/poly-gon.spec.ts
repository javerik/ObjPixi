import { PolyGon } from './poly-gon';

describe('PolyGon', () => {
  it('should create an instance', () => {
    expect(new PolyGon({style: null, points: []})).toBeTruthy();
  });
});
