import OlMeasureController from '@/components/measuretool/OlMeasureController';
import OlMap from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import DrawInteraction from 'ol/interaction/Draw';

describe('measuretool/OlMeasureController.js', () => {
  let olmc;
  let map;

  it('is defined', () => {
    expect(OlMeasureController).to.not.be.an('undefined');
  });

  describe('methods', () => {
    beforeEach(() => {
      map = new OlMap({ interactions: [] });
      olmc = new OlMeasureController(map);
    });

    it('are implemented', () => {
      expect(olmc.createMeasureLayer).to.be.a('function');
      expect(olmc.addInteraction).to.be.a('function');
      expect(olmc.removeInteraction).to.be.a('function');
    });

    it('createMeasureLayer creates and adds a vector layer to the map', () => {
      olmc.createMeasureLayer();
      expect(map.getLayers().item(0) instanceof VectorLayer).to.be.true;
    });

    it('addInteraction creates and adds a draw interaction to the map (distance)', () => {
      olmc.addInteraction('distance', () => undefined);
      expect(map.getInteractions().getLength()).to.equal(1);
      expect(map.getInteractions().item(0) instanceof DrawInteraction).to.be.true;
    });

    it('addInteraction creates and adds a draw interaction to the map (area)', () => {
      olmc.addInteraction('area', () => undefined);
      expect(map.getInteractions().getLength()).to.equal(1);
      expect(map.getInteractions().item(0) instanceof DrawInteraction).to.be.true;
    });

    it('addInteraction resets existing draw interaction on the map', () => {
      let cnt = 0;
      const mockFn = () => {
        cnt++;
      };
      olmc.removeInteraction = mockFn;
      olmc.draw = 1;
      olmc.addInteraction('distance', () => undefined);
      expect(cnt).to.equal(1);
    });

    it('removeInteraction removes a a draw interaction from the map', () => {
      olmc.createMeasureLayer();
      olmc.addInteraction('distance', () => undefined);
      olmc.removeInteraction();
      expect(map.getInteractions().getLength()).to.equal(0);
    });
  });
});
