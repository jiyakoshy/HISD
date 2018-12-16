import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { max } from 'd3-array';
import { schemeCategory10, select, pie, arc, event, axisBottom } from 'd3';

class BarChart extends Component {
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
        let data = this.props.data;
        const node = this.node;
        let toolTip = select(node).append("div").attr("class", "toolTip");
        toolTip.append('div')
            .attr('class', 'label');
        toolTip.append('div')
            .attr('class', 'count');
        let axisMargin = 20;
        let margin = 40;
        let valueMargin = 4;
        let width = 960;
        let height = 400;
        let barHeight = (height - axisMargin - margin * 2) * 0.4 / data.length;
        let barPadding = (height - axisMargin - margin * 2) * 0.6 / data.length;

        let bar = 0;
        let svg = null;
        let scale = 0;
        let xAxis = 0;
        let labelWidth = 0;
        let color = scaleOrdinal(["green", "blue", "red"]);

        let maxChart = max(data, function (d) { return d.keyValue; });
        select(node).select('svg').remove();
        svg = select(node)
            .append("svg")
            .attr("viewBox", "0 0 960 400")
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("ID", "divBarID");

        bar = svg.selectAll("g")
            .data(data)
            .enter()
            .append("g");

        bar.attr("class", "bar")
            .attr("cx", 0)
            .attr("transform", function (d, i) {
                return "translate(" + margin + "," + (i * (barHeight + barPadding) + barPadding) + ")";
            });

        bar.append("text")
            .attr("class", "label")
            .attr("y", barHeight / 2)
            .attr("dy", ".35em") //vertical align middle
            .text(function (d) {
                return d.key;
            }).each(function () {
                labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width));
            });

        scale = scaleLinear()
            .domain([0, maxChart])
            .range([0, width - margin * 2 - labelWidth]);

        xAxis = axisBottom(scale)
            .tickSize(-height + 2 * margin + axisMargin);

        bar.append("rect")
            .attr("transform", "translate(" + labelWidth + ", 0)")
            .attr("height", barHeight)
            .attr("fill", function (d) { return color(d.keyValue); })
            .attr("width", function (d) {
                return scale(d.keyValue);
            });

        bar.append("text")
            .attr("class", "value")
            .attr("y", barHeight / 2)
            .attr("dx", -valueMargin + labelWidth) //margin right
            .attr("dy", ".35em") //vertical align middle
            .attr("text-anchor", "end")
            .text(function (d) {
                return (d.keyValue);
            })
            .attr("x", function (d) {
                let width = this.getBBox().width;
                return Math.max(width + valueMargin, scale(d.keyValue));
            });
        bar.on("mouseover", function (d) {
            toolTip.select('.label').html(d.key).style('color', 'black');
            toolTip.select('.count').html(d.keyValue);
            toolTip.style('display', 'block');
            toolTip.style('opacity', 2);
            select(this).transition()
                .duration(500);
        })
        bar.on("mousemove", function (d) {
            toolTip.style('top', (event.layerY + 10) + 'px')
                .style('left', (event.layerX - 25) + 'px');
        })
        bar.on("mouseout", function (d) {
            toolTip.style("display", "none");
            select(this).transition()
                .duration(500);
        });
        svg.insert("g", ":first-child")
            .attr("class", "axisHorizontal")
            .attr("transform", "translate(" + (margin + labelWidth) + "," + (height - axisMargin - margin) + ")")
            .call(xAxis);

        /*svg.selectAll(".tick")
            .each(function (d) {
                if (d >= 0) {
                    this.remove();
                }
            });
            */
    }

    render() {
        return (<div>
            <div ref={node => this.node = node} className="myBarGraph"></div>
        </div>
        );
    }

}
BarChart.propTypes = {
    data: PropTypes.array
};
export default BarChart;
