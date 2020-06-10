import React, { useEffect } from 'react';
import { IState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { actions as metricactions } from './reducer'
import { Query } from 'urql';
import { Select } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import MetricCardClass from './MetricCard';
import MetricChart from './MetricChart';
import { queryHistoryData } from './MetricGQlQueries';


interface props {
    datafromurql: any;
}

type MeasurementQuery = {
    metricName: string,
    after: number,
    before: number;
}

const MetricsDashBoard: React.FC<props> = (props) => {

    const datafromurql = props.datafromurql;
    const metricNames: string[] = ['select a metric'];
    const dispatch = useDispatch();
    const [selectedFilter] = React.useState('select a metric');
    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        // setSelectedFilter(event.target.value as string);
        dispatch(metricactions.metricSelected({ selectedMetric: event.target.value as string }));
    };


    const removeSelectedFilter = (metricName: string) => {
        dispatch(metricactions.metricRemoved({ selectedMetric: metricName }));
    }


    const getSelectedMetrics = (state: IState) => {
        return { selectedMetrics: state.metric.SelectedMetrics };
    }

    const getInputs = (state: IState) => {
        let inputs: MeasurementQuery[] = [];
        let dateval = new Date();
        let beforedateval = dateval.getTime();
        let after = beforedateval - 30 * 60 * 1000;
        for (const iterator of state.metric.SelectedMetrics) {
            inputs.push({ metricName: iterator, after: after, before: beforedateval });
        }
        return {
            inputs
        };
    }

    const { selectedMetrics } = useSelector(getSelectedMetrics);
    const { inputs } = useSelector(getInputs);

    if (!datafromurql.fetching && metricNames.length <= 1) {
        for (const iterator of datafromurql.data.getMetrics) {
            metricNames.push(iterator);
        }
    }

    useEffect(() => {

    }, [selectedMetrics]);

    return (
        <React.Fragment>
            {metricNames !== undefined && metricNames.length > 0 &&
                <Select
                    labelId="metrics-label"
                    id="metrics"
                    value={selectedFilter}
                    onChange={handleChange}
                >
                    {metricNames.map(x => (
                        <MenuItem key={x} value={x} >{x}</MenuItem>
                    ))}
                </Select>}

            <div style={{ margin: '20px' }}>Selected Metrics
                {selectedMetrics.length > 0 && selectedMetrics.map(x => (
                <React.Fragment>
                    <div style={{ display: 'inline-block', padding: '4px', border: '1px solid #fff', marginRight: '10px' }} >{x}
                        <button onClick={() => removeSelectedFilter(x)}>X</button>
                    </div>
                </React.Fragment>
            ))}
            </div>

            {selectedMetrics.length > 0 && selectedMetrics.map(x => (
                <MetricCardClass metricName={x} />
            ))}

            {selectedMetrics.length > 0 &&
                <Query query={queryHistoryData} variables={{ inputs }} requestPolicy='network-only' >
                    {queryResults => (
                        <MetricChart datafromurql={queryResults} ></MetricChart>
                    )}
                </Query>
            }

        </React.Fragment>
    );

}

export default MetricsDashBoard;