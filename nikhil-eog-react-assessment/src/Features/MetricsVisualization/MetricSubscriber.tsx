import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { actions as metricactions } from '../Metrics/reducer'
import { useSubscription } from 'urql';

interface props {
}

const sub = `
subscription {
  newMeasurement {metric, at, value, unit}
}
`;

const MetricSubscriber: React.FC<props> = () => {

  const [subscriptionResponse] = useSubscription({ query: sub });
  const { fetching, data, error } = subscriptionResponse;
  const dispatch = useDispatch();

  useEffect(() => {

    if (error) {
      return;
    }

    if (!data) return;

    const { newMeasurement } = data;

    dispatch(metricactions.metricDataReceived({ metricName: newMeasurement["metric"], metricValue: newMeasurement }));

  }, [dispatch, data, error, fetching]);

  return null;

}

export default MetricSubscriber;