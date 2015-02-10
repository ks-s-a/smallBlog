// Craeting React components

var Container = React.createClass({
  getInitialState: function() {
    return {
      tagNames: {
        1: 'Love',
        2: 'Date',
      },
      tags: [],
    };
  },

  changeTags: function(arr) {
    this.setState({tags: arr});
  },

  render: function () {
    return (
      <div id="content-container">
        <TagList tagNames={this.state.tagNames} tags={this.state.tags} changeTagsFunction={this.changeTags.bind(null)} />
        <Stories tags={this.state.tagNames} />
      </div>
    );
  },
});

var TagList = React.createClass({
  chooseTag: function(tagIndex) {
    var newTagArr = this.props.tags.slice();
    var arrIndex = newTagArr.indexOf(tagIndex);

    if (arrIndex === -1) {
      newTagArr.push(tagIndex);
    } else {
      newTagArr.splice(arrIndex, 1);
    }

    this.props.changeTagsFunction(newTagArr);
  },

  render: function() {
    var tagElements = [];

    for (var i in this.props.tagNames)
      tagElements.push(<TagButton name={this.props.tagNames[i]} state={this.props.tags.indexOf(+i) !== -1} key={i} index={i} chooseTag={this.chooseTag.bind(null)} count="42" />);

    console.log('this.props.tags is: ', this.props.tags);

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
        <a href="#" onClick={this.props.chooseTag.bind(null, +this.props.index)}>
          {this.props.name} <span className="badge">{this.props.count}</span>
        </a>
      </li>);
  },
});

var Stories = React.createClass({

  getStoriesFromServer: function(startIndex) {
    var self = this;
    var tags = this.props.tags || [];
    var startIndexString = startIndex ? '&start=' + startIndex : ''

    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {
      if (this.readyState != 4) return; // запрос ещё не завершён

      if (this.responseText)
        self.setState({
          stories: JSON.parse(this.responseText),
        });
    }

    request.open('GET', '/getStories?tags=' + JSON.stringify(tags) + startIndexString, true);

    request.send();
  },

  getInitialState: function() {
    // Let's create ajax-query for our stories...
    this.getStoriesFromServer();

    return {
      stories: [],
    };
  },

  render: function() {
    var storiesElements = this.state.stories.map(function(v) {
      return <Story key={v.id} header={v.header} text={v.text} />
    });

    return (<div id="stories-container" className="col-lg-10 col-md-10 col-sm-10 col-xs-12">
        <div id="heading" className="col-lg-12 col-md-12 col-sm-12 hidden-xs">
          <div id="main-header">
            <h1>Hello new pretty world!</h1>
          </div>

          {storiesElements}
        </div>
      </div>);
  }
});

var Story = React.createClass({
  render: function() {
    return (
      <div className="posts" key={this.props.key}>
        <h4> {this.props.header} </h4>
        <p className="text-muted"> Some tags there. </p>
        <p> {this.props.text} </p>
        <br />
      </div>
    );
  }
});

React.render(<Container />, document.getElementById('content-container'));
