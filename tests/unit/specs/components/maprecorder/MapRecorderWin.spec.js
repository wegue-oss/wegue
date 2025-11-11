import { shallowMount } from '@vue/test-utils';
import { bindMap, unbindMap } from '@/composables/Map';
import MapRecorderWin from '@/components/maprecorder/MapRecorderWin';
import OlMap from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

function createWrapper () {
  return shallowMount(MapRecorderWin);
}

describe('maprecorder/MapRecorderWin.vue', () => {
  let comp;
  let vm;

  it('is defined', () => {
    expect(MapRecorderWin).to.not.be.an('undefined');
  });

  it('has a setup hook', () => {
    expect(MapRecorderWin.setup).to.be.a('function');
  });

  describe('props', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default props', () => {
      expect(vm.icon).to.equal('mdi-video');
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
      expect(vm.moduleName).to.equal('wgu-maprecorder');
      expect(vm.mapCanvas).to.be.null;
      expect(vm.mapContext).to.be.null;
      expect(vm.recorder).to.be.null;
      expect(vm.recording).to.be.false;
      expect(vm.filename).to.be.undefined;
      expect(vm.frameRate).to.equal(25);
      expect(vm.videoMBitsPerSecond).to.equal(2.5);
      expect(vm.timerHandle).to.be.null;
      expect(vm.error).to.be.false;
      // Supported codecs under chrome.
      expect(vm.mimeType).to.be.a('string');
      expect(vm.mimeTypes).to.be.an('array');
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('methods', () => {
    let map;

    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('supports at least one mime type under chrome', () => {
      const mimeTypes = vm.getSupportedMimeTypes();
      expect(mimeTypes).to.be.an('array').that.is.not.empty;
    });

    it('start / stop recording sets correct states', () => {
      const layer = new VectorLayer({
        visible: true,
        source: new VectorSource()
      });
      map = new OlMap({
        layers: [layer]
      });
      map.setSize([1024, 768]);
      bindMap(map);

      vm.startRecording();

      expect(vm.mapCanvas).not.to.be.null;
      expect(vm.mapCanvas.width).to.equal(1024);
      expect(vm.mapCanvas.height).to.equal(768);
      expect(vm.mapContext).not.to.be.null;
      expect(vm.recorder).not.to.be.null;
      expect(vm.recording).to.be.true;
      expect(vm.timerHandle).not.to.be.null;
      expect(vm.error).to.be.false;

      vm.stopRecording();

      expect(vm.mapCanvas).to.be.null;
      expect(vm.mapContext).to.be.null;
      expect(vm.recorder).to.be.null;
      expect(vm.recording).to.be.false;
      expect(vm.timerHandle).to.be.null;
      expect(vm.error).to.be.false;
    });

    afterEach(() => {
      unbindMap();
      map = undefined;

      comp.unmount();
    });
  });
});
