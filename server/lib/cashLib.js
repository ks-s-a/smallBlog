'use strict';

/*
  Working with cash through main functions;

  // Structure:
  // {
  //   pageName: {
  //     value: cash,
  //     time: timestamp,
  //   }
  // }
*/

const store = {};

function set(name, value) {
  store[name] = {
    value: value,
    time: Date.now(),
  };

  return true;
}

function get(name) {
  return store[name].value;
}


/*
  Expired period will be in hours
*/
function check(name, expiredPeriod) {
  return store[name]
    && store[name].time + expiredPeriod * 60 * 60 * 1000 > Date.now();
}

function init() {
  const Cash = function() {
    this.get = get;
    this.set = set;
    this.check = check;
  }

  return new Cash();
}

module.exports = init;
