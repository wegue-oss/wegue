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
});
