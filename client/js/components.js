// Craeting React components

var Container = React.createClass({
  render: function () {
    return (
      <div>
        <TagList></TagList>
        <Stories></Stories>
      </div>
    );
  }
});

var TagList = React.createClass({
  render: function() {
    return (<div></div>);
  }
});

var TagButton = React.createClass({
  render: function() {
    return (<div></div>);
  }
});

var Stories = React.createClass({
  render: function() {
    return (<div></div>);
  }
});

var Story = React.createClass({
  render: function() {
    return (<div></div>);
  }
});

React.renderComponent(<Container />, document.getElementById('content-container'));
