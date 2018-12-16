import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { max } from 'd3-array';
import { schemeCategory10, select, pie, arc, event } from 'd3';

class PieChart extends Component {
    constructor(props, context) {
        super(props, context);
        this.createBarChart = this.createBarChart.bind(this);
    }
    componentDidMount() {
        this.createBarChart();
    }
    componentDidUpdate() {
        this.createBarChart();
    }
    createBarChart() {
        let sales = this.props.data;

        let pieHISD = pie()
            .value(function (d) { return d.keyValue; });

        let slices = pieHISD(sales);
        let arcHISD = null;
        let arcOver = null;

        arcHISD = arc()
            .innerRadius(0)
            .outerRadius(100);

        arcOver = arc()
            .innerRadius(0)
            .outerRadius(100 + 5);

        let color = scaleOrdinal(["red", "blue", "green"]);

        const node = this.node;

        let toolTip = select(node).append("div").attr("class", "toolTip");

        toolTip.append('div')
            .attr('class', 'label');
        toolTip.append('div')
            .attr('class', 'count');

        let isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
        let g = null;
        select(node).select('svg').remove();
        let svg = select(node)
            .append('svg');
        if (isIE11) {
            arcHISD = arc()
                .innerRadius(0)
                .outerRadius(90);
            arcOver = arc()
                .innerRadius(0)
                .outerRadius(90 + 10);

            select(node).select('svg')
                .attr("width", "100%")
                .attr("height", "250px");

            g = svg.append('g')
                .attr('transform', 'translate(250,100)');

        }
        else {
            arcHISD = arc()
                .innerRadius(0)
                .outerRadius(180);
            arcOver = arc()
                .innerRadius(0)
                .outerRadius(180 + 10);

            select(node).select('svg')
                .attr("viewBox", "0 0 960 500")
                //.attr("viewBox", "0 0 850 200")
                .attr("preserveAspectRatio", "xMidYMid meet");

            g = svg.append('g')
                .attr('transform', 'translate(450,200)');


        }


        let arcGraph = g.selectAll('path.slice')
            .data(slices)
            .enter();
        arcGraph.append('path')
            .attr('class', 'slice')
            .attr('d', arcHISD)
            .attr('fill', function (d) {
                return color(d.data.key);
            })
            .on("mouseover", function (d) {
                toolTip.select('.label').html(d.data.key).style('color', 'black');
                toolTip.select('.count').html((d.value) + '%');
                toolTip.style('display', 'block');
                toolTip.style('opacity', 2);
                select(this).transition()
                    .duration(500)
                    .attr("d", arcOver);

            })
            .on("mousemove", function (d) {
                toolTip.style('top', (event.layerY + 10) + 'px')
                    .style('left', (event.layerX - 25) + 'px');
            })
            .on("mouseout", function (d) {
                toolTip.style("display", "none");
                select(this).transition()
                    .duration(500)
                    .attr("d", arcHISD);

            });
        if (isIE11) {
            arcGraph.append("text")
                .attr("transform", function (d) { return "translate(" + arcHISD.centroid(d) + ")"; })
                .attr("class", "textForIE11")
                .attr("dy", "0.35em");
                /*.text(function (d) {
                    if (d.data.keyValue) {
                        return d.data.keyValue + '%';
                    } else { return d.data.keyValue; }
                });*/

            svg.append('g')
                .attr('class', 'legend')
                .attr("transform", "translate(330,150)")
                .selectAll('text')
                .data(slices)
                .enter()
                .append('text')
                .text(function (d) {
                    if (d.data.keyValue) {
                        return '• ' + d.data.key + ': ' + d.data.keyValue + '%';
                    } else {
                        return '• ' + d.data.key + ': 0%' ;
                    }
                })
                .attr("class", "textForIE11")
                .attr('fill', function (d) { return color(d.data.key); })
                .attr('y', function (d, i) { return 30 * (i + 1); });
        }
        else {
            arcGraph.append("text")
                .attr("transform", function (d) { return "translate(" + arcHISD.centroid(d) + ")"; })

                .attr("dy", "0.35em");
            /*.text(function (d) {
                if (d.data.keyValue) {
                    return d.data.keyValue + '%';
                } else { return d.data.keyValue; }
            });*/

            svg.append('g')
                .attr('class', 'legend')
                .attr("transform", "translate(600,350)")
                .style("font-size", "120px")
                .selectAll('text')
                .data(slices)
                .enter()
                .append('text')
                .text(function (d) {
                    if (d.data.keyValue) {
                        return '• ' + d.data.key + ': ' + d.data.keyValue + '%';
                    } else {
                        return '• ' + d.data.key + ': 0%' ;
                    }
                })
                .attr('fill', function (d) { return color(d.data.key); })
                .attr('y', function (d, i) { return 40 * (i + 1); });
        }
    }

    render() {
        return (<div>
            <div ref={node => this.node = node} className="myPieGraph"></div>
        </div>
        );
    }

}
PieChart.propTypes = {
    data: PropTypes.array
};
export default PieChart;