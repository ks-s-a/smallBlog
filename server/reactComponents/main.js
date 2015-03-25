const React = require('react'),
  TAG_NAMES = require('./config.js');

// Creating React components
var Container = React.createClass({displayName: "Container",
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
      stories: this.props.stories || [],
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

  shouldComponentUpdate: function(nextProps, nextState) {

    // If content not changes, then not render
    if ( (nextState.tagNum === this.state.tagNum) && (nextState.lastStoryId === this.state.lastStoryId) ) return false;

    return true;
  },

  render: function () {
    return (
      React.createElement("div", {id: "content"}, 

        React.createElement("div", {className: "col-lg-3 col-md-3 hidden-sm hidden-xs"}, 
          React.createElement("img", {className: "main-picture", src: '/i/heartPic.png'}), 
          React.createElement(TagList, {tagNames: this.state.tagNames, tags: this.state.tags, tagNum: this.state.tagNum, changeTagsFunction: this.changeTags})
        ), 

        React.createElement(MobileList, {tagNames: this.state.tagNames, tags: this.state.tags, tagNum: this.state.tagNum, changeTagsFunction: this.changeTags}), 

        React.createElement("div", {id: "heading", ref: "heading", className: "col-lg-9 col-md-9 col-sm-12 col-xs-12"}, 
          React.createElement("h1", {id: "main-header"}, "Истории с чувством!"), 
          React.createElement(Stories, {stories: this.state.stories, tagNames: this.state.tagNames, tags: this.state.tags, changeTagsFunction: this.changeTags})
        )
      )
    );
  },
});

var MobileList = React.createClass({displayName: "MobileList",
  showList: function(e) {
    var buttonGroup = React.findDOMNode(this.refs.mobilePanel);
    buttonGroup.classList.toggle('hide');
  },

  render: function() {
    var listButtons = [];

    for (var i in this.props.tagNames)
      listButtons.push(
        React.createElement(MobileListButton, {
          name: this.props.tagNames[i], 
          state: this.props.tags.indexOf(+i) !== -1, 
          index: i, 
          changeTagsFunction: this.props.changeTagsFunction, 
          count: this.props.tagNum[i]})
      );

    return (React.createElement("div", {id: "mobile-panel", className: "panel panel-default hidden-lg hidden-md col-sm-12 col-xs-12"}, 
      React.createElement("div", {className: "panel-heading"}, "Выбрать тему"), 

      React.createElement("div", {id: "mobile-panel-content", ref: "mobilePanel", className: "panel-body " + (!!this.props.tags.length ? "" : "hide")}, 
        React.createElement("div", {className: "list-group"}, 
          listButtons
        )
      )

    ));
  },
});

var MobileListButton = React.createClass({displayName: "MobileListButton",
  render: function() {
    return (React.createElement("a", {href: "#", className: "list-group-item " + (this.props.state ? 'active' : ''), onClick: this.props.changeTagsFunction.bind(null, +this.props.index)}, 
          this.props.name, " ", React.createElement("span", {className: "badge"}, this.props.count)
        ));
  },
});

var TagList = React.createClass({displayName: "TagList",
  render: function() {
    var tagElements = [];

    for (var i in this.props.tagNames)
      tagElements.push(
        React.createElement(TagButton, {
          name: this.props.tagNames[i], 
          state: this.props.tags.indexOf(+i) !== -1, 
          index: i, 
          changeTagsFunction: this.props.changeTagsFunction, 
          count: this.props.tagNum[i]})
      );

    return (React.createElement("div", {id: "side-buttons"}, 
        React.createElement("h5", null, "Темы:"), 

        React.createElement("ul", {className: "nav nav-pills nav-stacked"}, 
          tagElements
        )
      ));
  },
});

var TagButton = React.createClass({displayName: "TagButton",
  render: function() {
    return (React.createElement("li", {className: this.props.state ? 'active' : ''}, 
        React.createElement("a", {href: "#", onClick: this.props.changeTagsFunction.bind(null, +this.props.index)}, 
          this.props.name, " ", React.createElement("span", {className: "badge"}, this.props.count)
        )
      ));
  },
});

var Stories = React.createClass({displayName: "Stories",
  render: function() {
    var self = this;
    var storyElements = this.props.stories.map(function(v) {
      return React.createElement(Story, {
        id: v.id, 
        header: v.header, 
        tags: v.tags, 
        tagNames: self.props.tagNames, 
        text: v.text, 
        changeTagsFunction: self.props.changeTagsFunction})
    });

    return React.createElement("div", {id: "stories-container", ref: "storiesContainer", className: "col-lg-12 col-md-12 col-sm-12 col-xs-12"}, storyElements);
  }
});

var Story = React.createClass({displayName: "Story",
  render: function() {
    var self = this;

    var tags = this.props.tags.map(function(v) {
      return React.createElement("a", {href: "javascript:", className: "text-muted story-tag-link", onClick: self.props.changeTagsFunction.bind(null, +v)}, " ", '#' + self.props.tagNames[+v], " ")
    });

    var parags;

    return (
      React.createElement("article", {name: 'post' + this.props.id}, 
        React.createElement("h4", {className: "story-title"}, " ", this.props.header, " "), 

        React.createElement("div", {className: "story-tags-area"}, 
          tags
        ), 

        this.props.text.split('\n').map(function(v){return React.createElement("p", null, " ", v, " ")})
      )
    );
  }
});

// Export react class
module.exports = Container;
