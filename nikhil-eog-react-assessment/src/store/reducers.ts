import { reducer as weatherReducer } from '../Features/Weather/reducer';
import { reducer as metricReducer  } from '../Features/MetricsVisualization/reducer';

export default {
  weather: weatherReducer,
  metric: metricReducer,
};
