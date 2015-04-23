var React = require('react');

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
      activeTag: null,

      // Stories
      storyLastQueryTime: null,
      stories: this.props.stories || [],
      isEndReached: false,
      lastStoryId: null,
    };
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
          return self.setState({
            isEndReached: true,
          });
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

    request.open('GET', '/getStories?tags=' + JSON.stringify(this.state.activeTag ? [this.state.activeTag] : []) + lastIndexString, true);
    request.send();

    this.setState({storyLastQueryTime: currentTime});
  },

  _isNeedExtraStories: function(event) {
    if (this._isEndCommingSoon(event))
      this._getStoriesFromServer();
  },

  _isEndCommingSoon: function(event) {
    var rect = document.getElementById('heading').getBoundingClientRect();
    var html = document.documentElement;
    var body = document.body;

    var scrollTop = html.scrollTop || body && body.scrollTop || 0;

    scrollTop -= html.clientTop;

    return html.scrollHeight - scrollTop < html.clientHeight * 1.5;
  },

  // Public function for component interaction
  changeTags: function(index) {
    console.log('new tag is: ', index);

    this.setState({
        activeTag: this.state.activeTag === +index ? null : +index, // set or reset
        isEndReached: false,
        lastStoryId: null,
        stories: [],
        storyLastQueryTime: null,
      }, function () {
        this._getStoriesFromServer();
      });
  },

  componentDidMount: function() {
    document.addEventListener('scroll', this._isNeedExtraStories);
  },

  render: function () {
    console.log('stories: ', this.state.stories);

    return (
      React.createElement("div", {id: "content"}, 

        React.createElement("div", {className: "col-lg-3 col-md-3 hidden-sm hidden-xs"}, 
          React.createElement("img", {className: "main-picture", src: '/i/heartPic.png', alt: "big-heart"}), 
          React.createElement(TagList, {tagNames: this.props.tagNames, activeTag: this.state.activeTag, tagNum: this.props.tagNum, changeTagsFunction: this.changeTags})
        ), 

        React.createElement(MobileList, {tagNames: this.props.tagNames, tag: this.state.activeTag, tagNum: this.props.tagNum, changeTagsFunction: this.changeTags}), 

        React.createElement("div", {id: "heading", className: "col-lg-9 col-md-9 col-sm-12 col-xs-12"}, 
          React.createElement("h1", {id: "main-header"}, "Истории с чувством!"), 
          React.createElement(Stories, {stories: this.state.stories, tagNames: this.props.tagNames, changeTagsFunction: this.changeTags})
        )
      )
    );
  },
});

var MobileList = React.createClass({displayName: "MobileList",
  getInitialState: function() {
    return {
      isShow: !!this.props.tag,
    };
  },

  showList: function(e) {
    this.setState({isShow: !this.state.isShow});
  },

  render: function() {
    var listButtons = [];

    for (var i in this.props.tagNames)
      listButtons.push(
        React.createElement(MobileListButton, {
          name: this.props.tagNames[i], 
          state: this.props.tag === +i, 
          index: i, 
          changeTagsFunction: this.props.changeTagsFunction, 
          count: this.props.tagNum[i]})
      );

    return (React.createElement("div", {id: "mobile-panel", className: "panel panel-default hidden-lg hidden-md col-sm-12 col-xs-12"}, 
      React.createElement("div", {className: "panel-heading", onClick: this.showList}, "Выбрать тему"), 

      React.createElement("div", {id: "mobile-panel-content", className: "panel-body " + (this.state.isShow ? "" : "hide")}, 
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

    for (var i in this.props.tagNames) {
      tagElements.push(
        React.createElement(TagButton, {
          name: this.props.tagNames[i], 
          state: this.props.activeTag === +i, 
          index: i, 
          changeTagsFunction: this.props.changeTagsFunction, 
          count: this.props.tagNum[i]})
      );
    }

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
  getInitialState: function() {
    return {
      func: this.props.changeTagsFunction,
    };
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState({
      func: nextProps.changeTagsFunction,
    });

    console.log('new props is: ', nextProps);
  },

  render: function() {
    var func = this.state.func;

    var storyElements = this.props.stories.slice().map(function(v,i) {
      /*return <Story
        id={v.id}
        header={v.header}
        tags={v.tags}
        tagNames={this.props.tagNames}
        text={v.text}
        changeTagsFunction={this.props.changeTagsFunction} />*/
        return React.createElement("a", {href: "javascript:", className: "text-muted story-tag-link", onClick: func.bind(null, +i)}, " ", '#123', " ")
    });

    return React.createElement("div", {id: "stories-container", className: "col-lg-12 col-md-12 col-sm-12 col-xs-12"}, 
      storyElements
    );
  }
});

/*var Story = React.createClass({
  render: function() {
    console.log('new story render!');
    console.log('change function is: ', this.props.changeTagsFunction);

    var tags = this.props.tags.map(function(v) {
      return <a href="javascript:" className="text-muted story-tag-link" onClick={this.props.changeTagsFunction.bind(null, +v)}> {'#' + this.props.tagNames[+v]} </a>
    }.bind(this));

    return (
      <article name={'post' + this.props.id}>
        <h4 className='story-title' > {this.props.header} </h4>

        <div className="story-tags-area">
          {tags}
        </div>

        {this.props.text.split('\n').map(function(v){return <p> {v} </p>})}
      </article>
    );
  }
});*/

module.exports = Container;
