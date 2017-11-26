import { getElementFromTemplate } from './utils';

const Promise = require('promise-polyfill');

if (!window.Promise) {
	window.Promise = Promise;
}

(function () {
	let popup = document.querySelector('.popup');
	let closePopupBtn = popup.querySelector('.popup__close-btn');
	let getGiftBtn = document.querySelector('.js-get-gift');
	let urlToGetGift = './data/gift.json';

	let isSendProhibited = false;

	let getGift = function() {
		return new Promise(function (resolve, reject) {
			isSendProhibited = true;
			let req = new XMLHttpRequest();
			req.open('get', urlToGetGift);
			req.onload = function () {
				if (req.status === 200) {
					resolve(req.response)
				} else {
					reject(new Error("Server error"))
				}
				isSendProhibited = false;
			};

			req.onerror = function() {
				reject(new Error("Network error"));
			};

			req.send();
		})
	};

	let showGift = function (giftId) {
		let wrap = document.querySelector('.popup__wrap');

		let giftTmpl = `<div class="popup__wrap popup__wrap_gift"><img class="popup__img" src="./img/gift/gift_${giftId}.png"><p class="popup__text">Теперь подарок ваш!</p><button class="popup__btn js-close">Спасибо</button></div>`;

		wrap.parentNode.appendChild(getElementFromTemplate(giftTmpl));
		wrap.parentNode.removeChild(wrap);

		popup.addEventListener('click', function (evt) {
			evt.preventDefault();

			if (evt.target.classList.contains('js-close')) {
				closePopupBtn.click();
			}
		})

	};

	getGiftBtn.addEventListener('click', function (evt) {
		evt.preventDefault();

		!isSendProhibited && getGift()
			.then(JSON.parse)
			.then( data => {
				if (data.res) {
					// to get random gift use the commented line below
					// data.giftId = Math.floor(Math.random()*4+1);
					showGift(data.giftId);
				} else {
					console.log('no gift');
				}
		})
			.catch( err => console.log(err))
	});

	closePopupBtn.addEventListener('click', function (evt) {
		evt.preventDefault();

		popup.classList.remove('is-open');
		document.querySelector('body').classList.remove('open-popup');
	});
})();