import { shallowMount } from '@vue/test-utils';
import CoordsTable from '@/components/infoclick/CoordsTable.vue';

function createWrapper () {
  return shallowMount(CoordsTable);
}

describe('infoclick/CoordsTable.vue', () => {
  let comp;
  let vm;

  // Inspect the raw component options
  it('is defined', () => {
    expect(CoordsTable).to.not.be.an('undefined');
  });

  describe('props', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default props', () => {
      expect(vm.coordsData).to.be.undefined;
      expect(vm.showMapPos).to.be.true;
      expect(vm.showWgsPos).to.be.true;
      expect(vm.showHdms).to.be.true;
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('data', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default data', () => {
      expect(vm.coordRows).to.be.null;
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('watchers', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('watches coordsData', async () => {
      /* eslint-disable @stylistic/quote-props */
      const expextedCoordRows = {
        'MAP PROJ': '1.00 1.00',
        'WGS 84': '1.0000000° 1.0000000°',
        'HDMS': '1° N 1° E'
      };
      /* eslint-enable @stylistic/quote-props */
      await comp.setProps({
        coordsData: {
          coordinate: [1, 1],
          projection: 'EPSG:4326'
        }
      });

      expect(vm.coordRows['MAP PROJ']).to.equal(expextedCoordRows['MAP PROJ']);
      expect(vm.coordRows['WGS 84']).to.equal(expextedCoordRows['WGS 84']);
      expect(vm.coordRows.HDMS).to.equal(expextedCoordRows.HDMS);
    });

    afterEach(() => {
      comp.unmount();
    });
  });
});
