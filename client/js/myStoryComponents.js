'use strict';

var Input = ReactBootstrap.Input;

// Creating React components
var Container = React.createClass({
  _submit: function(event) {
    //event.preventDefault ? event.preventDefault() : (event.returnValue=false);


    console.log('It\'s works!: ', event);
  },

  render: function() {
    return (<form onSubmit={this._submit} method="post" action="/createStory">
      <Input type="text" label="Заголовок" name="title" />
      <Input type="textarea" label='История' name="story" rows="20" />
      <div className="g-recaptcha" data-sitekey="6LcfSQITAAAAAE_LpS_ldiBZy94ly9-AJrGErt4l" />
      <Input type="submit" bsStyle="success" value="Отправить" />
    </form>);
  }
});

React.render(<Container />, document.getElementById('content-container'));
