import { OlStyleFactory } from '@/factory/OlStyle';
import { Style, Circle as CircleStyle, Stroke, Fill } from 'ol/style';

describe('OlStyleFactory', () => {
  it('is defined', () => {
    expect(OlStyleFactory).to.not.be.an('undefined');
  });

  it('has the correct functions', () => {
    expect(OlStyleFactory.getInstance).to.be.a('function');
    expect(OlStyleFactory.createPointStyle).to.be.a('function');
    expect(OlStyleFactory.createLineStyle).to.be.a('function');
    expect(OlStyleFactory.createPolygonStyle).to.be.a('function');
    expect(OlStyleFactory.createStroke).to.be.a('function');
    expect(OlStyleFactory.createFill).to.be.a('function');
  });

  it('getInstance returns correct point Style instance', () => {
    const styleConf = {
      radius: 8,
      strokeColor: '#d4de24',
      strokeWidth: 2,
      fillColor: 'rgba(255, 255, 255, 0.4)'
    };
    const style = OlStyleFactory.getInstance(styleConf);
    const circleStyle = style.getImage();

    expect((circleStyle instanceof CircleStyle)).to.be.true;
    expect(circleStyle.getFill().getColor()).to.equal('rgba(255, 255, 255, 0.4)');
    expect(circleStyle.getStroke().getColor()).to.equal('#d4de24');
    expect(circleStyle.getStroke().getWidth()).to.equal(2);
  });

  it('getInstance returns correct line Style instance', () => {
    const styleConf = {
      strokeColor: '#d4de24',
      strokeWidth: 2
    };
    const style = OlStyleFactory.getInstance(styleConf);

    expect((style instanceof Style)).to.be.true;
    expect(style.getStroke().getColor()).to.equal('#d4de24');
    expect(style.getStroke().getWidth()).to.equal(2);
  });

  it('getInstance returns correct polygon Style instance', () => {
    const styleConf = {
      strokeColor: '#d4de24',
      strokeWidth: 2,
      fillColor: 'rgba(255, 255, 255, 0.4)'
    };
    const style = OlStyleFactory.getInstance(styleConf);

    expect((style instanceof Style)).to.be.true;
    expect(style.getFill().getColor()).to.equal('rgba(255, 255, 255, 0.4)');
    expect(style.getStroke().getColor()).to.equal('#d4de24');
    expect(style.getStroke().getWidth()).to.equal(2);
  });

  it('createPointStyle returns correct Style instance', () => {
    const styleConf = {
      radius: 8,
      strokeColor: '#d4de24',
      strokeWidth: 2,
      fillColor: 'rgba(255, 255, 255, 0.4)'
    };
    const style = OlStyleFactory.createPointStyle(styleConf);

    expect((style instanceof Style)).to.be.true;
    const circleStyle = style.getImage();
    expect((circleStyle instanceof CircleStyle)).to.be.true;
    expect(circleStyle.getFill().getColor()).to.equal('rgba(255, 255, 255, 0.4)');
    expect(circleStyle.getStroke().getColor()).to.equal('#d4de24');
    expect(circleStyle.getStroke().getWidth()).to.equal(2);
  });

  it('createLineStyle returns correct Style instance', () => {
    const styleConf = {
      radius: 8,
      strokeColor: '#d4de24',
      strokeWidth: 2,
      fillColor: 'rgba(255, 255, 255, 0.4)'
    };
    const style = OlStyleFactory.createLineStyle(styleConf);

    expect((style instanceof Style)).to.be.true;
    expect(style.getFill()).to.equal(null);
    expect(style.getStroke().getColor()).to.equal('#d4de24');
    expect(style.getStroke().getWidth()).to.equal(2);
  });

  it('createPolygonStyle returns correct Style instance', () => {
    const styleConf = {
      radius: 8,
      strokeColor: '#d4de24',
      strokeWidth: 2,
      fillColor: 'rgba(255, 255, 255, 0.4)'
    };
    const style = OlStyleFactory.createPolygonStyle(styleConf);

    expect((style instanceof Style)).to.be.true;
    expect(style.getFill().getColor()).to.equal('rgba(255, 255, 255, 0.4)');
    expect(style.getStroke().getColor()).to.equal('#d4de24');
    expect(style.getStroke().getWidth()).to.equal(2);
  });

  it('createStroke returns correct Stroke instance', () => {
    const styleConf = {
      strokeColor: '#d4de24',
      strokeWidth: 2
    };
    const stroke = OlStyleFactory.createStroke(styleConf);

    expect((stroke instanceof Stroke)).to.be.true;
    expect(stroke.getColor()).to.equal('#d4de24');
    expect(stroke.getWidth()).to.equal(2);
  });

  it('createFill returns correct Fill instance', () => {
    const styleConf = {
      fillColor: 'rgba(255, 255, 255, 0.4)'
    };
    const fill = OlStyleFactory.createFill(styleConf);

    expect((fill instanceof Fill)).to.be.true;
    expect(fill.getColor()).to.equal('rgba(255, 255, 255, 0.4)');
  });
});
