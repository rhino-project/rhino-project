import {
  applyCurrencyMask,
  applyCurrencyMaskFromInput
} from '../../../rhino/utils/ui';

describe('applyCurrencyMaskFromInput', () => {
  it('returns empty value and zero selection when value is empty or ".00"', () => {
    const inputEvent = {
      target: { value: '', selectionEnd: 3, selectionStart: 3 }
    };
    expect(applyCurrencyMaskFromInput(inputEvent)).toEqual({
      value: '',
      selectionStart: 0,
      selectionEnd: 0
    });

    const dotEvent = {
      target: { value: '.00', selectionEnd: 3, selectionStart: 3 }
    };
    expect(applyCurrencyMaskFromInput(dotEvent)).toEqual({
      value: '',
      selectionStart: 0,
      selectionEnd: 0
    });
  });

  it('correctly applies the currency mask when value is valid', () => {
    const inputEvent = {
      target: { value: '12345.67', selectionEnd: 3, selectionStart: 3 }
    };
    expect(applyCurrencyMaskFromInput(inputEvent)).toEqual({
      value: '12345.67',
      selectionStart: 3,
      selectionEnd: 3
    });

    const negativeEvent = {
      target: { value: '-9876.54', selectionEnd: 2, selectionStart: 2 }
    };
    expect(applyCurrencyMaskFromInput(negativeEvent)).toEqual({
      value: '-9876.54',
      selectionStart: 2,
      selectionEnd: 2
    });
  });

  it('correctly applies the currency mask for specific values', () => {
    const inputEvent = {
      target: { value: '10', selectionEnd: 2, selectionStart: 2 }
    };
    expect(applyCurrencyMaskFromInput(inputEvent)).toEqual({
      value: '10.00',
      selectionStart: 2,
      selectionEnd: 2
    });

    const zeroEvent = {
      target: { value: '0', selectionEnd: 1, selectionStart: 1 }
    };
    expect(applyCurrencyMaskFromInput(zeroEvent)).toEqual({
      value: '0.00',
      selectionStart: 1,
      selectionEnd: 1
    });

    const zeroDotEvent = {
      target: { value: '0.0', selectionEnd: 3, selectionStart: 3 }
    };
    expect(applyCurrencyMaskFromInput(zeroDotEvent)).toEqual({
      value: '0',
      selectionStart: 1,
      selectionEnd: 1
    });
  });
});

describe('applyCurrencyMask', () => {
  it('returns the same value when it is falsy', () => {
    expect(applyCurrencyMask(null)).toBeNull();
    expect(applyCurrencyMask(undefined)).toBeUndefined();
    expect(applyCurrencyMask('')).toBe('');
    expect(applyCurrencyMask(0)).toBe('0.00');
  });

  it('correctly applies the currency mask when value is valid', () => {
    expect(applyCurrencyMask(12345.67)).toBe('12345.67');
    expect(applyCurrencyMask(-9876.54)).toBe('-9876.54');
    expect(applyCurrencyMask(1000)).toBe('1000.00');
  });

  it('handles string values', () => {
    expect(applyCurrencyMask('12345.67')).toBe('12345.67');
    expect(applyCurrencyMask('-9876.54')).toBe('-9876.54');
    expect(applyCurrencyMask('1000')).toBe('1000.00');
  });

  it('correctly applies the currency mask for specific values', () => {
    expect(applyCurrencyMask(10)).toBe('10.00');
    expect(applyCurrencyMask(0)).toBe('0.00');
    expect(applyCurrencyMask(0.0)).toBe('0.00');

    expect(applyCurrencyMask('10')).toBe('10.00');
    expect(applyCurrencyMask('0')).toBe('0.00');
    expect(applyCurrencyMask('0.0')).toBe('0.00');
  });
});
