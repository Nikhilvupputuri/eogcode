import { createSlice, PayloadAction } from 'redux-starter-kit';

export type MetricNames = {
  Names: string[];
}

export type MetricSelected = {
  selectedMetric: string;
}

export type Metric = {
  metricName: string,
  metricValue: metricDataObj
};

export type metricDataObj = {
  metric: string,
  value: number,
  unit: string,
  at: number
}

export type metricMeasurement = {
  metricName: string;
  measurements: metricDataObj[];
}

export type multipleMeasurement = {
  multipleMetrics: metricMeasurement[];
}

interface IState {
  AvailableMetrics: string[],
  SelectedMetrics: string[],
  CurrentMetricMeasurement: { [key: string]: metricDataObj },
  HistMetricMeasurement: { [key: string]: metricDataObj[] }
}

const initialState: IState = {
  AvailableMetrics: [],
  SelectedMetrics: [],
  CurrentMetricMeasurement: {},
  HistMetricMeasurement: {}
};

const slice = createSlice({
  name: 'metric',
  initialState,
  reducers: {

    metricNamesReceived: (state, action: PayloadAction<MetricNames>) => {
      for (const item of action.payload.Names) {
        state.AvailableMetrics.push(item);
      }
    },

    metricSelected: (state, action: PayloadAction<MetricSelected>) => {
      if (action.payload.selectedMetric !== 'select a metric' &&
        state.SelectedMetrics.find((val, index) => val === action.payload.selectedMetric) === undefined) {
        state.SelectedMetrics.push(action.payload.selectedMetric);
      }
    },

    metricRemoved: (state, action: PayloadAction<MetricSelected>) => {
      if (state.SelectedMetrics.find((val, index) => val === action.payload.selectedMetric) !== undefined) {
        let index = state.SelectedMetrics.findIndex((x, y) => x === action.payload.selectedMetric);
        state.SelectedMetrics.splice(index, 1);
      }
      state.HistMetricMeasurement[action.payload.selectedMetric] = [];
    },

    metricDataReceived: (state, action: PayloadAction<Metric>) => {
      state.CurrentMetricMeasurement[action.payload.metricName] = action.payload.metricValue;
      Object.assign(state.CurrentMetricMeasurement[action.payload.metricName], action.payload.metricValue);
      if (state.HistMetricMeasurement[action.payload.metricName] === undefined) {
        state.HistMetricMeasurement[action.payload.metricName] = [];
      }
      state.HistMetricMeasurement[action.payload.metricName].push(action.payload.metricValue);
    },

    metricFullData: (state, action: PayloadAction<multipleMeasurement>) => {
      for (const iterator of action.payload.multipleMetrics) {
        if (state.HistMetricMeasurement[iterator.metricName] === undefined || state.HistMetricMeasurement[iterator.metricName].length === 0) {
          state.HistMetricMeasurement[iterator.metricName] = iterator.measurements;
        }
        else {
          state.HistMetricMeasurement[iterator.metricName].concat(iterator.measurements);
        }
      }
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
