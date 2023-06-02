let cardIdx = 0;
document.addEventListener('DOMContentLoaded', function () {
  var Clock = (function () {
    var exports = function (element) {
      this._element = element;
      var html = '';
      for (var i = 0; i < 6; i++) {
        html += '<span>&nbsp;</span>';
      }
      this._element.innerHTML = html;
      this._slots = this._element.getElementsByTagName('span');
      this._tick();
    };

    exports.prototype = {
      _tick: function () {
        var time = new Date();
        this._update(
          this._pad(time.getHours()) +
            this._pad(time.getMinutes()) +
            this._pad(time.getSeconds())
        );
        var self = this;
        setTimeout(function () {
          self._tick();
        }, 1000);
      },

      _pad: function (value) {
        return ('0' + value).slice(-2);
      },

      _update: function (timeString) {
        var i = 0,
          l = this._slots.length,
          value,
          slot,
          now;
        for (; i < l; i++) {
          value = timeString.charAt(i);
          slot = this._slots[i];
          now = slot.dataset.now;
          if (!now) {
            slot.dataset.now = value;
            slot.dataset.old = value;
            continue;
          }
          if (now !== value) {
            this._flip(slot, value);
          }
        }
      },

      _flip: function (slot, value) {
        slot.classList.remove('flip');
        slot.dataset.old = slot.dataset.now;
        slot.dataset.now = value;
        slot.offsetLeft;
        slot.classList.add('flip');
      },
    };
    return exports;
  })();

  var i = 0,
    clocks = document.querySelectorAll('.clock'),
    l = clocks.length;
  for (; i < l; i++) {
    new Clock(clocks[i]);
  }

  const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  const date = new Date();
  const currDay = date.getDay();
  const day = DAYS[currDay];
  const month = date.getMonth() + 1;
  const numDate = date.getDate();

  document.querySelector('#day').innerHTML = day;
  document.querySelector('#month').innerHTML = month;
  document.querySelector('#num-date').innerHTML = numDate;

  newCard();
});

function showAnswer() {
  const answer = document.querySelector('.card-answer');
  const btn = document.querySelector('.card-btn');
  answer.classList.remove('hide');
  btn.innerHTML = 'New Card';
  btn.onclick = newCard;
}

function formatQuestionHTML(q) {
  // If the question has a double-quoted section, put it on a new line, make it italic and remove the quotes
  const idx = q.indexOf('"');
  if (idx === -1) {
    return q;
  }
  const idx2 = q.indexOf('"', idx + 1);
  if (idx2 === -1) {
    return q;
  }
  const first = q.slice(0, idx);
  const second = q.slice(idx, idx2 + 1);
  const third = q.slice(idx2 + 1);
  return `${first}<br><i>${second.slice(1, second.length - 1)}</i>${third}`;
}

function newCard() {
  cardIdx = Math.floor(Math.random() * CARD_ITEMS.length);
  const [questionStr, answerStr] = CARD_ITEMS[cardIdx];
  const question = document.querySelector('.card-question');
  const answer = document.querySelector('.card-answer');
  const btn = document.querySelector('.card-btn');

  // Hide the answer and "new" button
  answer.classList.add('hide');
  // Set the question and answer
  question.innerHTML = formatQuestionHTML(questionStr);
  answer.innerHTML = answerStr;
  // Set the button text and onclick
  btn.innerHTML = 'Show Answer';
  btn.onclick = showAnswer;
}
