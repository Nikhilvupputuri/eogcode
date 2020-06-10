import React from 'react';
import { IState } from '../../store';
import { connect } from 'react-redux';

type cardProps =
    IState & Props

interface Props {
    metricName: string;
}

class MetricCard extends React.Component<cardProps, {}>{

    public render() {

        return (
            <React.Fragment>
                <div style={{ width: '100px', height: '100px', backgroundColor: 'red', margin: '10px' }}>
                    {this.props.metric.CurrentMetricMeasurement[this.props.metricName] !== undefined &&
                        this.props.metric.CurrentMetricMeasurement[this.props.metricName].value}
                </div>
            </React.Fragment>
        );
    }
}

export default connect(
    (state: IState, ownProps: Props) => (
        {
            ...state,
            ...ownProps,
        }),
)(MetricCard);