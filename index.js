"use strict";

var React = require("react");
var ReactDOM = require("react-dom");
var util = require("dom-find");
var SimplePageScrollMixin = {
    componentDidMount: function componentDidMount() {
        window.addEventListener("scroll", this.onScroll, false);
    },
    componentWillUnmount: function componentWillUnmount() {
        window.removeEventListener("scroll", this.onScroll, false);
    }
};
var SimpleResizeMixin = {
    componentDidMount: function componentDidMount() {
        window.addEventListener("resize", this.handleResize);
    },

    componentWillUnmount: function componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }
};

var StickyDiv = React.createClass({
    mixins: [SimplePageScrollMixin, SimpleResizeMixin],
    displayName: "StickyDiv",
    propTypes: {
        offsetTop: React.PropTypes.number,
        zIndex: React.PropTypes.number,
        className: React.PropTypes.string
    },
    getInitialState: function getInitialState() {
        return {
            fix: false,
            width: null
        };
    },
    getDefaultProps: function getDefaultProps() {
        return {
            offsetTop: 0,
            className: "",
            zIndex: 9999
        };
    },
    handleResize: function handleResize() {
        this.checkWidth();
        this.checkPositions();
    },
    onScroll: function onScroll() {
        this.checkWidth();
        this.checkPositions();
    },
    checkPositions: function checkPositions() {
        var pos = util.findPosRelativeToViewport(ReactDOM.findDOMNode(this));

        if (pos[1] <= this.props.offsetTop) {
            if(!this.state.fix && typeof(this.props.onFixedChange)==='function') {
                this.props.onFixedChange(true);
            }
            this.setState({ fix: true });
        } else {
            if(this.state.fix && typeof(this.props.onFixedChange)==='function') {
                this.props.onFixedChange(false);
            }
            this.setState({ fix: false });
        }
    },
    checkWidth: function checkWidth() {
        var width = null;
        if (this.refs.duplicate) {
            width = this.refs.duplicate.getBoundingClientRect().width;
        } else {
            width = this.refs.original.getBoundingClientRect().width;
        }
        if (this.state.width !== width) {
            this.setState({
                width: width
            });
        }
    },
    componentDidMount: function componentDidMount() {
        this.checkWidth();
    },
    render: function render() {
        var divStyle;

        if (this.state.fix) {
            divStyle = {
                display: "block",
                position: "fixed",
                width: this.state.width ? this.state.width + "px" : null,
                top: this.props.offsetTop
            };
            return React.createElement(
                "div",
                { style: { zIndex: this.props.zIndex, position: "relative", width: "100%" } },
                React.createElement(
                    "div",
                    { ref: "duplicate", key: "duplicate", style: { visibility: "hidden" } },
                    this.props.children
                ),
                React.createElement(
                    "div",
                    { ref: "original", key: "original", className: this.props.className, style: divStyle },
                    this.props.children
                )
            );
        } else {
            divStyle = {
                display: "block",
                position: "relative"
            };
            return React.createElement(
                "div",
                { style: { zIndex: this.props.zIndex, position: "relative", width: "100%" } },
                React.createElement(
                    "div",
                    { ref: "original", key: "original", style: divStyle },
                    this.props.children
                )
            );
        }
    }
});

module.exports = StickyDiv;