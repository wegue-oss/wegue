import OlStyle from 'ol/style/style'
import OlStroke from 'ol/style/stroke'
import OlFill from 'ol/style/fill'

export default {
  shopStyle: new OlStyle({
    stroke: new OlStroke({
      color: 'red',
      width: 3.25
    })
  }),
  neWorldMvt: new OlStyle({
    stroke: new OlStroke({
      color: 'gray',
      width: 1
    }),
    fill: new OlFill({
      color: 'rgba(20,20,20,0.1)'
    })
  })
};
