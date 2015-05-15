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

    // Create void object for tag choose
    var voidTagObject = {};
    for (var i in tagNames) {
      voidTagObject[i] = false;
    }

    return {
      choosenTags: voidTagObject,
    };
  },

  _chooseTag: function(tagNum, event) {
    this.state.choosenTags[tagNum] = !this.state.choosenTags[tagNum];

    this.setState({
      choosenTags: this.state.choosenTags,
    });
  },

  _storyAction: function(action) {
    var self = this;

    var title = document.querySelector('.story-title').value;
    var text = document.querySelector('.story-text').value;

    var paramString =
      'storyId=' + this.props.id +
      '&title=' + title +
      '&text=' + text +
      '&tags=' + JSON.stringify(this.state.choosenTags) +
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

    for (var tag in tagNames) {
      tags.push(
        <Button
          bsStyle={this.state.choosenTags[tag] ? 'primary' : 'default'}
          bsSize="xsmall"
          className="tag-button"
          onClick={this._chooseTag.bind(this, tag)}>

          {tagNames[tag]}
        </Button>);
    }

    return (
    <div className="story-container">
      <form>
        <Input className="story-title" type="text" label='Заголовок:' defaultValue={this.props.header} />
        <Input className="story-text" type="textarea" rows="20" label='История:' defaultValue={this.props.text} />
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
