import ObjectUtil from '@/util/Object'

describe('ObjectUtil', () => {
  it('is defined', () => {
    expect(typeof ObjectUtil).to.not.equal(undefined);
  });

  it('has the correct functions', () => {
    expect(typeof ObjectUtil.isObject).to.equal('function');
    expect(typeof ObjectUtil.mergeDeep).to.equal('function');
    expect(typeof ObjectUtil.toPaths).to.equal('function');
  });

  it('isObject returns correct results', () => {
    const object = {};
    const array = [];
    expect(ObjectUtil.isObject(object)).to.be.true;
    expect(ObjectUtil.isObject(array)).to.be.false;
  });

  it('mergeDeep returns correct results', () => {
    const target = {
      'prop': 'value',
      'propOverride': 'will be overridden',
      'obj': {
        'prop': 'value',
        'propOverride': 'will be overridden'
      }
    };

    const source = {
      'prop2': 'value2',
      'propOverride': 'is overridden',
      'obj': {
        'prop2': 'value2',
        'propOverride': 'is overridden'
      }
    };

    ObjectUtil.mergeDeep(target, source);
    expect(target).to.eql({
      'prop': 'value',
      'propOverride': 'is overridden',
      'obj': {
        'prop': 'value',
        'propOverride': 'is overridden',
        'prop2': 'value2'
      },
      'prop2': 'value2'
    });
  });

  it('toPaths returns correct results', () => {
    const object = {
      'prop': '',
      'obj': {
        'prop': ''
      },
      'array': [
        '',
        {
          'prop': ''
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
