'use strict';

// Creating React components
var Container = React.createClass({
  getDefaultProps: function() {
    return {
      queryTimeout: 1500,
    };
  },

  getInitialState: function() {
    return {
      // Tags
      tagNames: TAG_NAMES,
      tags: [],
      tagsCash: '',
      tagNum: [],

      // Stories
      storyLastQueryTime: null,
      stories: [],
      isEndReached: false,
      lastStoryId: null,
    };
  },

  _getArticleCount: function(tags) {
    var tagsStr = JSON.stringify(this.state.tags);

    if (tagsStr === this.state.tagsCash) return; // If tags didn't change
    this.state.tagsCash = tagsStr; // Save current tags

    var self = this;
    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {
      if (this.readyState != 4) return; // Query is not competed

      if (this.responseText) {
        var response = JSON.parse(this.responseText);

        self.setState({
          tagNum: response,
        });
      }
    };

    request.open('GET', '/getStoriesNumber?tags=' + tagsStr, true);
    request.send();
  },

  _getStoriesFromServer: function(startIndex) {
    var currentTime = Date.now();

    console.log('Go go query...');
    if (this.state.isEndReached || this.state.storyLastQueryTime && (currentTime - this.state.storyLastQueryTime) < this.props.queryTimeout ) return;

    var self = this;
    var startIndexString = this.state.lastStoryId ? '&start=' + this.state.lastStoryId : ''

    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {
      if (this.readyState != 4) return; // запрос ещё не завершён

      if (this.responseText) {
        var storiesArr = JSON.parse(this.responseText);
        var sortArr = storiesArr.sort(function(a, b) {
          return a.id - b.id;
        });
        var lastStoryId = sortArr[sortArr.length - 1].id;

        self.setState({
          lastStoryId: lastStoryId,
          stories: storiesArr,
        });
      }

    }

    request.open('GET', '/getStories?tags=' + JSON.stringify(this.state.tags) + startIndexString, true);
    request.send();
    this.setState({storyLastQueryTime: currentTime});
  },

  changeTags: function(index) { // Public function for component interaction
    var newTagArr = this.state.tags.slice();
    var arrIndex = newTagArr.indexOf(index);

    // Add or reduce tag in the tagArr
    if (arrIndex === -1) {
      newTagArr.push(index);
    } else {
      newTagArr.splice(arrIndex, 1);
    }

    this.setState({
      tags: newTagArr,

      // Default settings
      storyLastQueryTime: null,
      stories: [],
      isEndReached: false,
      lastStoryId: null,
    });


    //this._getStoriesFromServer();
  },

  componentDidMount: function () {
    console.log('componentDidMount! : ', this.state);
    document.addEventListener('scroll', this._isNeedExtraStories);

    // Let's create ajax-query for our stories namber, stories itself will be loaded, when status has updated...
    this._getArticleCount(this.state.tags);
  },

  componentDidUpdate: function () {
    console.log('componentDidUpdate! : ', this.state);

    if (this.state.stories.length === 0 &&
      !this.state.storyLastQueryTime || (Date.now() - this.state.storyLastQueryTime > 1500) ) {

      // Let's create ajax-query for new stories...
      this._getStoriesFromServer();
      this._getArticleCount(this.state.tags);
    }
  },

  _isNeedExtraStories: function(event) {
    if (!this._isEndCommingSoon(event)) return;

    this._getStoriesFromServer();
  },

  _isEndCommingSoon: function(event) {
    var rect = this.refs.heading.getDOMNode().getBoundingClientRect();
    var html = document.documentElement;
    var body = document.body;

    var scrollTop = html.scrollTop || body && body.scrollTop || 0;

    scrollTop -= html.clientTop;

    return html.scrollHeight - scrollTop < html.clientHeight * .7;
  },

  render: function () {
    return (
      <div id="content-container" ref="container">
        <TagList tagNames={this.state.tagNames} tags={this.state.tags} tagNum={this.state.tagNum} changeTagsFunction={this.changeTags} />

        <div id="heading" ref="heading" className="col-lg-10 col-md-10 col-sm-10 col-xs-12">
          <div id="main-header">
            <h1>Hello new pretty world!</h1>
          </div>
          <Stories stories={this.state.stories} tagNames={this.state.tagNames} tags={this.state.tags} changeTagsFunction={this.changeTags} />
        </div>
      </div>
    );
  },
});

var TagList = React.createClass({
  render: function() {
    var tagElements = [];

    for (var i in this.props.tagNames)
      tagElements.push(
        <TagButton
          name={this.props.tagNames[i]}
          state={this.props.tags.indexOf(+i) !== -1}
          key={i}
          index={i}
          changeTagsFunction={this.props.changeTagsFunction}
          count={this.props.tagNum[i]}
        />
      );

    return (<div id="side-buttons" className="col-lg-2 col-md-2 col-sm-2 hidden-xs">
        <div className="big-logo-container" />

        <ul className="nav nav-pills nav-stacked">
          {tagElements}
        </ul>
      </div>);
  },
});

var TagButton = React.createClass({
  render: function() {
    return (<li className={this.props.state ? 'active' : ''} key={this.props.key} >
        <a href="#" onClick={this.props.changeTagsFunction.bind(null, +this.props.index)}>
          {this.props.name} <span className="badge">{this.props.count}</span>
        </a>
      </li>);
  },
});

var Stories = React.createClass({
  render: function() {
    var self = this;
    var storyElements = this.props.stories.map(function(v) {
      return <Story
        key={v.id}
        id={v.id}
        header={v.header}
        tags={v.tags}
        tagNames={self.props.tagNames}
        text={v.text}
        changeTagsFunction={self.props.changeTagsFunction}
      />
    });

    return <div id="stories-container" ref="storiesContainer" className="col-lg-12 col-md-12 col-sm-12 col-xs-12">{storyElements}</div>;
  }
});

var Story = React.createClass({
  render: function() {
    var self = this;

    var tags = this.props.tags.map(function(v) {
      return <a href="javascript:" className="text-muted story-tag-link" onClick={self.props.changeTagsFunction.bind(null, +v)}> {'#' + self.props.tagNames[+v]} </a>
    });

    return (
      <div className="post" key={this.props.key} name={'post' + this.props.id}>
        <h4> {this.props.header} </h4>

        <div className="story-tags-area">
          {tags}
        </div>

        <p> {this.props.text} </p>
        <br />
      </div>
    );
  }
});

React.render(<Container />, document.getElementById('content-container'));
