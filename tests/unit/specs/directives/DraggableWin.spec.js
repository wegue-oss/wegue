import { DraggableWin } from '@/directives/DraggableWin'

describe('DraggableWin Directive', () => {
  it('is defined', () => {
    expect(typeof DraggableWin).to.not.equal(undefined);
  });

  describe('functions', () => {
    describe('beforeMount', () => {
      it('exits if beforeMount.value=false', () => {
        DraggableWin.beforeMount(null, { value: false });
        expect(DraggableWin.dragConfig.draggableElementSelector).to.equal(null);
      });

      it('exits if no header in elem', () => {
        const mockDomEl = document.createElement('div');

        DraggableWin.beforeMount(mockDomEl, { value: true });
        expect(DraggableWin.dragConfig.draggableElementSelector).to.equal(null);
      });

      it('sets correct default draggableElementSelector', () => {
        const mockDomEl = document.createElement('div');
        const mockHeaderEl = document.createElement('div');
        mockHeaderEl.classList.add('wgu-win-title');
        mockDomEl.append(mockHeaderEl);

        DraggableWin.beforeMount(mockDomEl, { arg: false, value: true });
        expect(DraggableWin.dragConfig.draggableElementSelector).to.equal('wgu-win-title');
        // cleanup
        mockHeaderEl.parentNode.removeChild(mockHeaderEl);
      });

      it('applies draggableElementSelector from beforeMount.arg', () => {
        const mockDomEl = document.createElement('div');
        const mockHeaderEl = document.createElement('div');
        mockHeaderEl.classList.add('wgu-win-title');
        mockDomEl.append(mockHeaderEl);

        DraggableWin.beforeMount(mockDomEl, { arg: 'kalle', value: true });
        expect(DraggableWin.dragConfig.draggableElementSelector).to.equal('kalle');
        // cleanup
        mockHeaderEl.parentNode.removeChild(mockHeaderEl);
      });
    });
  });

  describe('events', () => {
    describe('mouseup', () => {
      it('calls correct handler', () => {
        const mockDomEl = document.createElement('div');
        const mockHeaderEl = document.createElement('div');
        mockHeaderEl.classList.add('wgu-win-title');
        mockDomEl.append(mockHeaderEl);

        DraggableWin.beforeMount(mockDomEl, { arg: false, value: true });

        let cnt = 0;
        DraggableWin.mouseup = () => {
          cnt++;
        }

        const clickEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true });
        mockDomEl.dispatchEvent(clickEvent);

        expect(cnt).to.equal(1);
      });
    });

    describe('mousedown', () => {
      it('calls correct handler', () => {
        const mockDomEl = document.createElement('div');
        const mockHeaderEl = document.createElement('div');
        mockHeaderEl.classList.add('wgu-win-title');
        mockDomEl.append(mockHeaderEl);

        DraggableWin.beforeMount(mockDomEl, { arg: false, value: true });

        let cnt = 0;
        DraggableWin.mousedown = () => {
          cnt++;
        }

        const clickEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
        mockDomEl.dispatchEvent(clickEvent);

        expect(cnt).to.equal(1);
      });
    });

    describe('mousemove', () => {
      it('calls correct handler', () => {
        const mockDomEl = document.createElement('div');
        const mockHeaderEl = document.createElement('div');
        mockHeaderEl.classList.add('wgu-win-title');
        mockDomEl.append(mockHeaderEl);

        DraggableWin.beforeMount(mockDomEl, { arg: false, value: true });

        let cnt = 0;
        DraggableWin.mousemove = () => {
          cnt++;
        }

        const clickEvent = new MouseEvent('mousemove', { bubbles: true, cancelable: true });
        mockDomEl.dispatchEvent(clickEvent);

        expect(cnt).to.equal(1);
      });
    });
  });
});
