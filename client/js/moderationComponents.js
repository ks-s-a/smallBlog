"use strict";var Button=ReactBootstrap.Button,ButtonToolbar=ReactBootstrap.ButtonToolbar,Input=ReactBootstrap.Input,Container=React.createClass({displayName:"Container",getInitialState:function(){return this._askForStories(),{stories:[]}},_askForStories:function(){var t=this,e=new XMLHttpRequest;e.onreadystatechange=function(){if(4==this.readyState)if(200!==this.status)console.error("Problem with stories getting.");else{var e=JSON.parse(this.response);t.setState({stories:e})}},e.open("GET","/getStoriesForModeration"),e.send(null)},render:function(){var t=this.state.stories.map(function(t){return React.createElement(Story,{id:t.id,header:t.header,text:t.text,createdAt:t.createdAt})});return React.createElement("div",null,React.createElement("div",null,"Stories: ",this.state.stories.length),t)}}),Story=React.createClass({displayName:"Story",getInitialState:function(){var t={};for(var e in tagNames)t[e]=!1;return{choosenTags:t}},_chooseTag:function(t){this.state.choosenTags[t]=!this.state.choosenTags[t],this.setState({choosenTags:this.state.choosenTags})},_storyAction:function(t){var e=document.querySelector(".story-title").value,a=document.querySelector(".story-text").value,s="storyId="+this.props.id+"&title="+e+"&text="+a+"&tags="+JSON.stringify(this.state.choosenTags)+"&action="+t,o=new XMLHttpRequest;o.onreadystatechange=function(){4==this.readyState&&(200!==this.status?console.error("Bad response from the server!"):window.location="/moderation")},o.open("POST","/moderateStory"),o.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),o.send(s)},render:function(){var t=[];for(var e in tagNames)t.push(React.createElement(Button,{bsStyle:this.state.choosenTags[e]?"primary":"default",bsSize:"xsmall",className:"tag-button",onClick:this._chooseTag.bind(this,e)},tagNames[e]));return React.createElement("div",{className:"story-container"},React.createElement("form",null,React.createElement(Input,{className:"story-title",type:"text",label:"Заголовок:",defaultValue:this.props.header}),React.createElement(Input,{className:"story-text",type:"textarea",rows:"20",label:"История:",defaultValue:this.props.text}),React.createElement(ButtonToolbar,{className:"tag-buttons"},t),React.createElement(ButtonToolbar,null,React.createElement(Button,{className:"story-action-button",onClick:this._storyAction.bind(this,!0),bsStyle:"success"},"Опубликовать"),React.createElement(Button,{className:"story-action-button",onClick:this._storyAction.bind(this,!1),bsStyle:"danger"},"Удалить"))))}});React.render(React.createElement(Container,null),document.getElementById("content-container"));