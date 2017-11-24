import OlStyle from 'ol/style/style'
import OlStroke from 'ol/style/stroke'

export default {
  shopStyle: new OlStyle({
    stroke: new OlStroke({
      color: 'red',
      width: 3.25
    })
  }),
  hereTrafficStyleFn: function (feature, res) {
    var color = 'rgba(0,0,0,0)';
    var timeStep = 't30';
    var tsVal = feature.get(timeStep);
    if (tsVal < 75) {
      color = 'red';
    } else if (tsVal >= 75 && feature.get(timeStep) < 100) {
      color = 'orange';
    } else if (tsVal >= 100 && feature.get(timeStep) < 120) {
      color = 'yellow'
    } else if (tsVal > 120) {
      color = 'green';
    }
    var stroke = new OlStroke({
      color: color,
      width: 1.25
    });
    var styles = [
      new OlStyle({
        stroke: stroke
      })
    ];

    return styles;
  }

};
