'use strict';

var Input = ReactBootstrap.Input;
var Button = ReactBootstrap.Button;
var Modal = ReactBootstrap.Modal;

// Creating React components
var Container = React.createClass({
  mixins: [ReactBootstrap.OverlayMixin],

  getInitialState: function() {
    return {
      modalState: false,
      modalMessage: '',
    }
  },

  _toggleModalWindow: function(statusText) {
    this.setState({
      modalState: !this.state.modalState,
      modalMessage: statusText || '',
    });
  },

  _submit: function(event) {
    // Canceling standart browser action.
    event.preventDefault ? event.preventDefault() : (event.returnValue=false);

    var self = this;
    var paramString =
      'title=' + event.target.querySelector('#mystory-title').value +
      '&text=' + event.target.querySelector('#mystory-text').value +
      '&grecaptcha=' + grecaptcha.getResponse();

    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {
      if (this.readyState != 4) return; // запрос ещё не завершён

      if (this.status !== 200) {
        self._toggleModalWindow(this.responseText);
      } else {
        window.location = '/';
      }
    }

    request.open('POST', '/createStory');
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')

    request.send(paramString);
  },

  render: function() {
    return (<form onSubmit={this._submit}>
      <Input id="mystory-title" type="text" label="Заглавие" />
      <Input id="mystory-text" type="textarea" label='История' rows="20" />
      <div className="mystory-submit-box" >
        <div className="mystory-submit-captcha g-recaptcha" data-sitekey="6LcfSQITAAAAAE_LpS_ldiBZy94ly9-AJrGErt4l" />
        <Input className="mystory-submit-button" type="submit" bsStyle="success" value="Отправить" />
      </div>
    </form>);
  },

  renderOverlay: function () {
    if (!this.state.modalState) {
      return <span />;
    }

    return (
        <Modal title="Внимание!" onRequestHide={this._toggleModalWindow}>
          <div className="modal-body">
            {this.state.modalMessage}
          </div>
          <div className="modal-footer">
            <Button onClick={this._toggleModalWindow}>Вернуться</Button>
          </div>
        </Modal>
      );
  }
});

React.render(<Container />, document.getElementById('content-container'));
