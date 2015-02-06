// Craeting React components

var Container = React.createClass({
  render: function () {
    var tagsObject = {
      1: 'Love',
      2: 'Date'
    };

    return (
      <div>
        <TagList tags={tagsObject} />
        <Stories tags={tagsObject} />
      </div>
    );
  }
});

var TagList = React.createClass({
  getInitialState: function() {
    var tags = [];

    for (var tagIndex in this.props.tags)
      tags.push(<TagButton name={this.props.tags[tagIndex]} index={tagIndex} count="42" />);

    return {tags: tags};
  },

  render: function() {

    return (<div id="side-buttons" className="col-lg-2 col-md-2 col-sm-2 hidden-xs">
        <div className="big-logo-container" />

        <ul className="nav nav-pills nav-stacked">
          {this.state.tags}
        </ul>
      </div>);
  }
});

var TagButton = React.createClass({
  render: function() {
    return (<li>
        <a href="#">
          {this.props.name} <span className="badge">{this.props.count}</span>
        </a>
      </li>);
  }
});

var Stories = React.createClass({

  getStoriesFromServer: function(startIndex) {
    var tags = this.props.tags || [];
    var startIndexString = startIndex ? '&start=' + startIndex : ''

    var request = new XMLHttpRequest();

    request.open('GET', '/getStories?tags=' + JSON.stringify(tags) + startIndexString, true);

    request.send();
  },

  getInitialState: function() {

    this.getStoriesFromServer();

    return null;
  },

  render: function() {
    var stories = <Story />;

    return (<div id="stories-container" className="col-lg-10 col-md-10 col-sm-10 col-xs-12">
        <div id="heading" className="col-lg-12 col-md-12 col-sm-12 hidden-xs">
          <h1>Hello new pretty world!</h1>
          <br />

          {stories}
        </div>
      </div>);
  }
});

var Story = React.createClass({
  render: function() {
    return (<div></div>);
  }
});

React.renderComponent(<Container />, document.getElementById('content-container'));
