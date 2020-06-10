import React from 'react';
import { IState } from '../../store';
import { connect } from 'react-redux';
import { metricDataObj } from './reducer';
import Plot from 'react-plotly.js';

type chartProps =
    IState & Props

interface Props {
    datafromurql: any;
}

type charts = {
    [key: string]: chartData;
}

interface chartData {
    x: string[];
    y: string[];
    type: string,
    mode: string,
    marker: any;
}

class MetricChart extends React.Component<chartProps, {}>{

    private localCharts: charts = {};

    public prepareCharts(): charts {

        let datafromurql = this.props.datafromurql;
        let charts: charts = {};

        if (datafromurql.data !== undefined) {

            Object.keys(this.props.metric.HistMetricMeasurement).map((key, index) => {

                let histdataforthekey: metricDataObj[] = [];
                if (this.props.datafromurql.data !== undefined && this.props.datafromurql.data.getMultipleMeasurements) {
                    for (const iterator of this.props.datafromurql.data.getMultipleMeasurements) {
                        if (iterator["metric"] === key) {
                            histdataforthekey = iterator["measurements"];
                        }
                    }
                }
                charts[key] = this.prepareChartData(histdataforthekey.concat(this.props.metric.HistMetricMeasurement[key]));
            });

        }

        return charts;
    }

    private unpackValue(rows: any[], key: string) {
        return rows.map(function (row) { return row[key]; });
    }

    private unpackat(rows: any[], key: string) {
        return rows.map(function (row) { return new Date(row[key]).toLocaleTimeString(); });
    }

    public prepareChartData(measurements: any[]): chartData {
        let preparedchartData: chartData = {
            x: this.unpackat(measurements, 'at'),
            y: this.unpackValue(measurements, 'value'),
            type: 'scatter',
            mode: 'lines',
            marker: { color: 'red' },
        }

        return preparedchartData;
    }

    private getCurrentTimeString(): string {
        return new Date().toLocaleTimeString();
    }

    private getthirtyminsTimeString(lastmins: number): string {
        let datetime = new Date();
        datetime.setMinutes(datetime.getMinutes() - lastmins);
        return datetime.toLocaleTimeString();

    }

    public prepareLayout(name: string): any {

        let from = this.getthirtyminsTimeString(30);
        let to = this.getCurrentTimeString();


        let layout = {
            width: 500, height: 400, title: `Chart for ${name}`,
            xaxis: {
                range: [from, to],
                type: 'Date'
            }
        }
        return layout;
    }


    public renderCharts() {

        this.localCharts = this.prepareCharts();

        return true;
    }


    public render() {

        if (this.props.datafromurql.data === undefined) {
            return null;
        }

        return (
            <React.Fragment>
                {this.localCharts !== undefined &&

                    this.props.metric.SelectedMetrics.length > 0 && this.renderCharts() && this.props.metric.SelectedMetrics.map(key => {
                        return this.localCharts[key] !== undefined && <div style={{ margin: '10px', display: 'inline-block' }}><Plot key={key}
                            data={[
                                {
                                    x: this.localCharts[key].x,
                                    y: this.localCharts[key].y,
                                    type: 'scatter',
                                    mode: 'lines',
                                }
                            ]}
                            layout={this.prepareLayout(key)}
                        />
                        </div>
                    })


                }

            </React.Fragment>);

    }
}

export default connect(
    (state: IState, ownProps: Props) => (
        {
            ...state,
            ...ownProps,
        }),
)(MetricChart);