import AttributeTableWin from '@/components/attributeTable/AttributeTableWin'

describe('attributeTable/AttributeTableWin.vue', () => {
  it('is defined', () => {
    expect(typeof AttributeTableWin).to.not.equal('undefined');
  });

  // Evaluate the results of functions in
  // the raw component options
  it('sets the correct default data', () => {
    expect(typeof AttributeTableWin.data).to.equal('function');
    const defaultData = AttributeTableWin.data();
    expect(typeof defaultData).to.equal('object');
  });
});
