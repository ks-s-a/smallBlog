'use strict';

var Button = ReactBootstrap.Button;
var ButtonToolbar = ReactBootstrap.ButtonToolbar;
var Input = ReactBootstrap.Input;

// Creating React components
var Container = React.createClass({
  getInitialState: function() {
    this._askForStories();

    return {
      stories: [],
    }
  },

  _askForStories: function() {
    var self = this;

    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {
      if (this.readyState != 4) return; // запрос ещё не завершён

      if (this.status !== 200) {
        console.error('Problem with stories getting.');
      } else {
        var stories = JSON.parse(this.response);

        self.setState({
          stories: stories,
        });
      }
    }

    request.open('GET', '/getStoriesForModeration');
    request.send(null);
  },

  render: function() {
    var storiesPack = this.state.stories.map(function(v) {
      return (<Story id={v.id} header={v.header} text={v.text} createdAt={v.createdAt} />);
    })

    return (<div>
        <div>Stories: {this.state.stories.length}</div>
        {storiesPack}
      </div>
    );
  },
});

var Story = React.createClass({
  getInitialState: function() {
    return {
      choosenTags: [],
    };
  },

  _chooseTag: function(tagNum, event) {
    var choosenTags = this.state.choosenTags;
    var tagIndex = choosenTags.indexOf(tagNum);

    if (tagIndex === -1) {
      choosenTags.push(tagNum)
    } else {
      choosenTags.splice(tagIndex, 1);
    }

    this.setState({
      choosenTags: choosenTags,
    });
  },

  _storyAction: function(action) {
    var self = this;

    var title = this.refs.title.getDOMNode().querySelector('input').value;
    var text = this.refs.text.getDOMNode().querySelector('textarea').value;

    var paramString =
      'storyId=' + this.props.id +
      '&title=' + title +
      '&text=' + text +
      '&tags=' + this.state.choosenTags +
      '&action=' + action;

    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {
      if (this.readyState != 4) return; // запрос ещё не завершён

      if (this.status !== 200) {
        console.error('Bad response from the server!');
      } else {
        window.location = '/moderation';
      }
    }

    request.open('POST', '/moderateStory');
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')

    request.send(paramString);
  },

  render: function() {
    var tags = [];

    for (var tag in TAG_NAMES) {
      tags.push(
        <Button
          bsStyle={this.state.choosenTags.indexOf(tag) !== -1 ? 'primary' : 'default'}
          bsSize="xsmall"
          className="tag-button"
          onClick={this._chooseTag.bind(this, tag)}>

          {TAG_NAMES[tag]}
        </Button>);
    }

    return (
    <div className="story-container">
      <form>
        <Input ref="title" type="text" label='Заголовок:' defaultValue={this.props.header} />
        <Input ref="text" type="textarea" rows="20" label='История:' defaultValue={this.props.text} />
        <ButtonToolbar className="tag-buttons" >
          {tags}
        </ButtonToolbar>

        <ButtonToolbar>
          <Button className="story-action-button" onClick={this._storyAction.bind(this, true)} bsStyle="success">Опубликовать</Button>
          <Button className="story-action-button" onClick={this._storyAction.bind(this, false)} bsStyle="danger">Удалить</Button>
        </ButtonToolbar>
      </form>
    </div>
    );
  }
});

React.render(<Container />, document.getElementById('content-container'));
