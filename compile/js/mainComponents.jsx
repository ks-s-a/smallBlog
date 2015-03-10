'use strict';

// Creating React components
var Container = React.createClass({
  getDefaultProps: function() {
    return {
      queryTimeout: 1000,
    };
  },

  getInitialState: function() {
    return {
      // Tags
      tagNames: TAG_NAMES,
      tags: [],
      tagNum: {},

      // Stories
      storyLastQueryTime: null,
      stories: [],
      isEndReached: false,
      lastStoryId: null,
    };
  },

  _getArticleCount: function() {
    var self = this;

    var tagsStr = JSON.stringify(this.state.tags);
    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {
      if (this.readyState != 4) return; // Query is not competed

      if (this.responseText) {
        var response = JSON.parse(this.responseText);

        self.setState({
          // Tags
          tagNum: response,
        });
      }
    };

    request.open('GET', '/getStoriesNumber?tags=' + tagsStr, true);
    request.send();
  },

  _getStoriesFromServer: function() {

    var currentTime = Date.now();

    if (this.state.isEndReached ||
      this.state.storyLastQueryTime && (currentTime - this.state.storyLastQueryTime) < this.props.queryTimeout ) {
      return;
    }

    var self = this;
    var lastIndexString = this.state.lastStoryId ? '&last=' + this.state.lastStoryId : ''
    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {
      if (this.readyState != 4) return; // запрос ещё не завершён

      if (this.responseText) {
        var newStoriesArr = JSON.parse(this.responseText);

        // If no more stories
        if (!newStoriesArr.length) {
          console.log('No more stories!')
          self.setState({
            isEndReached: true,
          });
          return;
        }

        // Sort array by DESC
        var sortArr = newStoriesArr.sort(function(a, b) {
          return b.id - a.id;
        });
        var lastStoryId = sortArr[sortArr.length - 1].id;
        var storiesArr = self.state.stories;

        sortArr.forEach(function(v){
          storiesArr.push(v);
        })

        self.setState({
          lastStoryId: lastStoryId,
          stories: storiesArr,
        });
      }
    }

    request.open('GET', '/getStories?tags=' + JSON.stringify(this.state.tags) + lastIndexString, true);
    request.send();

    this.setState({storyLastQueryTime: currentTime});
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

    return html.scrollHeight - scrollTop < html.clientHeight * 1.5;
  },

  // Public function for component interaction
  changeTags: function(index) {
    var newTagArr = this.state.tags.slice();
    var arrIndex = newTagArr.indexOf(index);

    // Add or reduce tag in the tagArr
    if (arrIndex === -1) {
      newTagArr.push(index);
    } else {
      newTagArr.splice(arrIndex, 1);
    }

    this.replaceState(this.getInitialState());

    this.setState(
      {
        tags: newTagArr,
      },

      function () {
        this._getArticleCount();
        this._getStoriesFromServer();
      });
  },

  componentWillMount: function () {
    document.addEventListener('scroll', this._isNeedExtraStories);

    this._getArticleCount();
    this._getStoriesFromServer();
  },

  shouldComponentUpdate: function(nextProps, nextState) {

    // If content not changes, then not render
    if ( (nextState.tagNum === this.state.tagNum) && (nextState.lastStoryId === this.state.lastStoryId) ) return false;

    return true;
  },

  render: function () {
    return (
      <div id="content">
        <MobileList tagNames={this.state.tagNames} tags={this.state.tags} tagNum={this.state.tagNum} changeTagsFunction={this.changeTags} />
        <TagList tagNames={this.state.tagNames} tags={this.state.tags} tagNum={this.state.tagNum} changeTagsFunction={this.changeTags} />

        <div id="heading" ref="heading" className="col-lg-9 col-md-9 col-sm-9 col-xs-12">

          <Stories stories={this.state.stories} tagNames={this.state.tagNames} tags={this.state.tags} changeTagsFunction={this.changeTags} />
        </div>
      </div>
    );
  },
});

var MobileList = React.createClass({
  showList: function(e) {
    var buttonGroup = document.getElementById('mobile-panel-content');
    buttonGroup.classList.toggle('hide');
  },

  render: function() {
    var listButtons = [];

    for (var i in this.props.tagNames)
      listButtons.push(
        <MobileListButton
          name={this.props.tagNames[i]}
          state={this.props.tags.indexOf(+i) !== -1}
          index={i}
          changeTagsFunction={this.props.changeTagsFunction}
          count={this.props.tagNum[i]} />
      );

    return (<div id="mobile-panel" className="panel panel-default hidden-lg hidden-md hidden-sm col-xs-12">
      <div className="panel-heading" onClick={this.showList} >
        <h3 className="panel-title">Выбрать тему</h3>
      </div>

      <div id="mobile-panel-content" className={"panel-body " + (!!this.props.tags.length ? "" : "hide")} >
        <div className="list-group">
          {listButtons}
        </div>
      </div>

    </div>);
  },
});

var MobileListButton = React.createClass({
  render: function() {
    return (<a href="#" className={"list-group-item " + (this.props.state ? 'active' : '')} onClick={this.props.changeTagsFunction.bind(null, +this.props.index)}>
          {this.props.name} <span className="badge">{this.props.count}</span>
        </a>);
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
          index={i}
          changeTagsFunction={this.props.changeTagsFunction}
          count={this.props.tagNum[i]} />
      );

    return (<div id="side-buttons" className="col-lg-3 col-md-3 col-sm-3 hidden-xs">
        <div className="big-logo-container" />

        <h5>Темы:</h5>

        <ul className="nav nav-pills nav-stacked">
          {tagElements}
        </ul>
      </div>);
  },
});

var TagButton = React.createClass({
  render: function() {
    return (<li className={this.props.state ? 'active' : ''} >
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
        id={v.id}
        header={v.header}
        tags={v.tags}
        tagNames={self.props.tagNames}
        text={v.text}
        changeTagsFunction={self.props.changeTagsFunction} />
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
      <article name={'post' + this.props.id}>
        <h4 className='story-title' > {this.props.header} </h4>

        <div className="story-tags-area">
          {tags}
        </div>

        <p> {this.props.text} </p>
        <br />
      </article>
    );
  }
});

React.render(<Container />, document.getElementById('content-container'));
