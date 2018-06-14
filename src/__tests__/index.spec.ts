import { default as Library, add } from '..';

describe('index', () => {
    it('should export a default value', () => {
        expect(Library).toBeTruthy();
    });

    it('should export `add()`', () => {
        expect(add).toBeTruthy();
    });
});
