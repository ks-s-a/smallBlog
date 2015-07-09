var React = require('react');

// Creating React components
var Container = React.createClass({
  getDefaultProps: function() {
    return {
      storiesTheme: null,
      queryTimeout: 1000,
    };
  },

  getInitialState: function() {
    return {
      // Stories
      storyLastQueryTime: null,
      stories: this.props.stories || [],
      isEndReached: false,
      lastStoryId: this.props.stories ? this.props.stories[this.props.stories.length - 1].id : null,
    };
  },

  _getStoriesFromServer: function() {
    var currentTime = Date.now();

    if (this.state.isEndReached ||
      this.state.storyLastQueryTime && (currentTime - this.state.storyLastQueryTime) < this.props.queryTimeout ) {
      return;
    }

    var self = this;
    var queryString = this.state.lastStoryId ? '?last=' + this.state.lastStoryId : '';
    var request = new XMLHttpRequest();

    // Check theme for the page
    if (this.props.storiesTheme) {
      queryString += '&theme=' + this.props.storiesTheme;
    }

    request.onreadystatechange = function() {
      if (this.readyState != 4) return; // запрос ещё не завершён

      if (this.responseText) {
        var newStoriesArr = JSON.parse(this.responseText);

        // If no more stories
        if (!newStoriesArr.length) {
          console.info('No more stories!');

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

    request.open('GET', '/getStories' + queryString, true);
    request.send();

    this.setState({storyLastQueryTime: currentTime});
  },

  _isNeedExtraStories: function(event) {
    if (this._isEndCommingSoon(event))
      this._getStoriesFromServer();
  },

  _isEndCommingSoon: function(event) {
    var rect = document.getElementById('stories-container').getBoundingClientRect();
    var html = document.documentElement;
    var body = document.body;

    var scrollTop = html.scrollTop || body && body.scrollTop || 0;

    scrollTop -= html.clientTop;

    return html.scrollHeight - scrollTop < html.clientHeight * 1.5;
  },

  componentDidMount: function() {
    document.addEventListener('scroll', this._isNeedExtraStories);
  },

  render: function () {
    return <Stories
      stories={this.state.stories}
      tagNames={this.props.tagNames}
      changeTagsFunction={this.changeTags} />;
  },
});

var Stories = React.createClass({
  render: function() {
    var storyElements = this.props.stories
      .map(function(v,i) {
        return <Story
            key={'story-' + i}
            id={v.id}
            header={v.header}
            text={v.text} />;
      })
      .reduce(function(p, c, i) { // Add a separator
        return p
          .concat(c)
          .concat(<p
            className="story-separator"
            key={'story-separator-' + i}>

            &hearts;&nbsp;&hearts;&nbsp;&hearts;
          </p>);
      }, []);

    return <div id="stories-container">
      {storyElements}
    </div>;
  }
});

var Story = React.createClass({
  _createParagraphs: function(text) {
    return text
      .split('\n')
      .map(function(v, i) {
        return <p itemProp="articleSection" key={'p-num-' + i}>
          {v}
        </p>;
      });
  },

  render: function() {
    return <article itemScope itemType="http://schema.org/Article">
      <h3 itemProp="name">{this.props.header}</h3>
      <meta itemProp="inLanguage" content="ru" />
      <meta itemProp="genre" content="love story" />

      <div itemProp="articleBody">
        {this._createParagraphs(this.props.text)}
      </div>
    </article>;
  }
});

module.exports = Container;
