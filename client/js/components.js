// Creating React components
var Container = React.createClass({
  getInitialState: function() {
    return {
      tagNames: TAG_NAMES,
      tags: [],
      tagsCash: '',
      tagNum: [],
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

  changeTags: function(index) { // Public function for component interaction
    var newTagArr = this.state.tags.slice();
    var arrIndex = newTagArr.indexOf(index);

    // Add or reduce tag in the tagArr
    if (arrIndex === -1) {
      newTagArr.push(index);
    } else {
      newTagArr.splice(arrIndex, 1);
    }

    this.setState({tags: newTagArr});
  },

  render: function () {
    this._getArticleCount(this.state.tags);

    return (
      <div id="content-container">
        <TagList tagNames={this.state.tagNames} tags={this.state.tags} tagNum={this.state.tagNum} changeTagsFunction={this.changeTags} />
        <Stories tagNames={this.state.tagNames} tags={this.state.tags} changeTagsFunction={this.changeTags} />
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
  _getStoriesFromServer: function(startIndex) {
    var self = this;
    var startIndexString = startIndex ? '&start=' + startIndex : ''

    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {
      if (this.readyState != 4) return; // запрос ещё не завершён

      if (this.responseText)
        self.setState({
          stories: JSON.parse(this.responseText),
        });
    }

    request.open('GET', '/getStories?tags=' + JSON.stringify(this.props.tags) + startIndexString, true);
    request.send();
  },

  getInitialState: function() {
    return {
      currentTagsState: this.props.tags,
      stories: [],
    };
  },

  componentDidMount: function() {
    // Let's create ajax-query for our stories...
    this._getStoriesFromServer();
  },

  render: function() {
    var self = this;

    // if tags have changed
    if (this.state.currentTagsState !== this.props.tags) {
      this._getStoriesFromServer();
      this.state.currentTagsState = this.props.tags;
    }

    var storyElements = this.state.stories.map(function(v) {
      return <Story key={v.id} header={v.header} tags={v.tags} tagNames={self.props.tagNames} text={v.text} changeTagsFunction={self.props.changeTagsFunction} />
    });

    return (<div id="stories-container" className="col-lg-10 col-md-10 col-sm-10 col-xs-12">
        <div id="heading" className="col-lg-12 col-md-12 col-sm-12 hidden-xs">
          <div id="main-header">
            <h1>Hello new pretty world!</h1>
          </div>

          {storyElements}
        </div>
      </div>);
  }
});

var Story = React.createClass({
  render: function() {
    var self = this;

    var tags = this.props.tags.map(function(v) {
      return <a href="javascript:" className="text-muted story-tag-link" onClick={self.props.changeTagsFunction.bind(null, +v)}> {'#' + self.props.tagNames[+v]} </a>
    });

    return (
      <div className="posts" key={this.props.key}>
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
