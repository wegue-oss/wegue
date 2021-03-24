import AttributeTable from '@/components/attributeTable/AttributeTable';
import { expect } from 'chai';

describe('attributeTable/AttributeTable.vue', () => {
  it('is defined', () => {
    expect(typeof AttributeTable).to.not.equal('undefined');
  });

  it('has a mounted hook', () => {
    expect(typeof AttributeTable.created).to.equal('function');
  });

  it('sets the correct default data', () => {
    expect(typeof AttributeTable.data).to.equal('function');
    const defaultData = AttributeTable.data();
    expect(defaultData.headers).to.be.an('array');
    expect(defaultData.headers.length).to.eql(0);

    expect(defaultData.records).to.be.an('array');
    expect(defaultData.records.length).to.eql(0);

    expect(defaultData.records).to.eql([]);
    expect(defaultData.headers).to.eql([]);

    expect(defaultData.page).to.eql(1);
    expect(defaultData.loading).to.eql(true);
  });
})
