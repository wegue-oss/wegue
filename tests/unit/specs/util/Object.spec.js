import ObjectUtil from '@/util/Object';

describe('ObjectUtil', () => {
  it('is defined', () => {
    expect(ObjectUtil).to.not.be.an('undefined');
  });

  it('has the correct functions', () => {
    expect(ObjectUtil.isObject).to.be.a('function');
    expect(ObjectUtil.mergeDeep).to.be.a('function');
    expect(ObjectUtil.toPaths).to.be.a('function');
  });

  it('isObject returns correct results', () => {
    const object = {};
    const array = [];

    expect(ObjectUtil.isObject(object)).to.be.true;
    expect(ObjectUtil.isObject(array)).to.be.false;
  });

  it('mergeDeep returns correct results', () => {
    const target = {
      prop: 'value',
      propOverride: 'will be overridden',
      obj: {
        prop: 'value',
        propOverride: 'will be overridden'
      }
    };

    const source = {
      prop2: 'value2',
      propOverride: 'is overridden',
      obj: {
        prop2: 'value2',
        propOverride: 'is overridden'
      }
    };

    ObjectUtil.mergeDeep(target, source);

    expect(target).to.eql({
      prop: 'value',
      propOverride: 'is overridden',
      obj: {
        prop: 'value',
        propOverride: 'is overridden',
        prop2: 'value2'
      },
      prop2: 'value2'
    });
  });

  it('toPaths returns correct results', () => {
    const object = {
      prop: '',
      obj: {
        prop: ''
      },
      array: [
        '',
        {
          prop: ''
        }
      ]
    };

    const result = ObjectUtil.toPaths(object);

    expect(result).to.eql([
      '.prop',
      '.obj.prop',
      '.array[0]',
      '.array[1].prop'
    ]);
  });

  it('getValueIgnoreCase returns correct results', () => {
    const object = {
      foo: 1,
      BAR: 2,
      KaLLe: 3
    };

    let result1 = ObjectUtil.getValueIgnoreCase(object, 'foo');
    expect(result1).to.equal(1);
    result1 = ObjectUtil.getValueIgnoreCase(object, 'FOO');
    expect(result1).to.equal(1);
    result1 = ObjectUtil.getValueIgnoreCase(object, 'fOO');
    expect(result1).to.equal(1);
    let result2 = ObjectUtil.getValueIgnoreCase(object, 'bar');
    expect(result2).to.equal(2);
    result2 = ObjectUtil.getValueIgnoreCase(object, 'BAR');
    expect(result2).to.equal(2);
    result2 = ObjectUtil.getValueIgnoreCase(object, 'bAr');
    expect(result2).to.equal(2);
    let result3 = ObjectUtil.getValueIgnoreCase(object, 'kalle');
    expect(result3).to.equal(3);
    result3 = ObjectUtil.getValueIgnoreCase(object, 'KALLE');
    expect(result3).to.equal(3);
    result3 = ObjectUtil.getValueIgnoreCase(object, 'kAlle');
    expect(result3).to.equal(3);
  });
});
