'use strict';

var Input = ReactBootstrap.Input;

// Creating React components
var Container = React.createClass({
  _submit: function(event) {
    // Canceling standart browser action.
    event.preventDefault ? event.preventDefault() : (event.returnValue=false);

    var paramString =
      'title=' + event.target.querySelector('#mystory-title').value +
      '&text=' + event.target.querySelector('#mystory-text').value +
      '&grecaptcha=' + grecaptcha.getResponse();

    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {
      if (this.readyState != 4) return; // запрос ещё не завершён

      console.log('this.statusText is: ', this.statusText);
      console.log('this is: ', this);

      if (this.status !== 200) {
        console.error('Bad request!');
      } else {
        window.location = '/';
      }

      if (this.responseText) {
        console.log('Response text is: ', this.responseText);
      }
    }

    request.open('POST', '/createStory');
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')

    request.send(paramString);

    console.log('It\'s works!: ', paramString);
  },

  render: function() {
    return (<form onSubmit={this._submit}>
      <Input id="mystory-title" type="text" label="Заголовок" name="title" />
      <Input id="mystory-text" type="textarea" label='История' name="story" rows="20" />
      <div className="mystory-submit-box" >
        <div className="mystory-submit-captcha g-recaptcha" data-sitekey="6LcfSQITAAAAAE_LpS_ldiBZy94ly9-AJrGErt4l" />
        <Input className="mystory-submit-button" type="submit" bsStyle="success" value="Отправить" />
      </div>
    </form>);
  }
});

React.render(<Container />, document.getElementById('content-container'));
