'use strict';

var BountyKillers = function(container) {
	this.$body 				= $('body');
	this.$bounty			= $(container);
	this.isDataReady 	= !!this.$bounty.data('ready');
	this.productsURL 	= this.$bounty.data('product-url');
	this.companyURL		= this.productsURL.split('/').slice(0, -1).join('/') + '/';
	this.killersHTML 	= '';
	this.init();
};

BountyKillers.prototype.init = function() {
	var	offersScript 	= document.createElement('script');

	if (this.isDataReady) {
		this.listenEvents();
		return false;
	}

  offersScript.src = this.productsURL + '?' + new Date().getTime();
	document.body.appendChild(offersScript);
	offersScript.addEventListener('load', this.render.bind(this));
};

BountyKillers.prototype.render = function() {
	if ('header' in bountyKillersData) {
		this._renderHeader();
	}
	if ('nav' in bountyKillersData) {
		this._renderNavigation();
	}
	if ('killers' in bountyKillersData) {
		this._renderGoods();
	}

	this.$bounty.html(this.killersHTML);
	this.$nav 					= this.$bounty.find('.js-bounty-nav');
	this.$navLinks 	 		= this.$nav.find('.js-bounty-nav-link');
	this.$content				= this.$bounty.find('.js-bounty-content');
	this.$contentItems	= this.$content.find('.js-bounty-content-item');
	this.listenEvents();
	this.ckeckHTML();
};

BountyKillers.prototype.listenEvents = function() {
	var self = this;

	this.$bounty.on('click', 				'.js-bounty-good-dropdown-title', 		this._toggleDropdown.bind(this));
	this.$bounty.on('click', 				'.js-bounty-good-dropdown-list-item', this._selectGoodFromDropdown.bind(this));
	this.$bounty.on('mouseenter' , 	'.js-bounty-good-dropdown-list-item',	this._showGoodInfo.bind(this));
	this.$bounty.on('mouseleave' , 	'.js-bounty-good-dropdown-list-item',	this._hideGoodInfo.bind(this));
	this.$body.on(	'click', function(e) {
		if (!$(e.target).closest('.js-bounty-good-dropdown').length) {
			self._hideAllDropdowns();
		}
	});

	if (!this.isDataReady) {
		this.$navLinks.on('click', this._switchingContent.bind(this));
	}
};

BountyKillers.prototype.ckeckHTML = function() {
	this._checkNavLinksWidth();
	this._checkActiveTab();
	this._checkDropdown();
};

BountyKillers.prototype._renderHeader = function() {
	this.killersHTML +=	'<header class="bounty__header">' +
												'<div class="bounty__title">' + bountyKillersData.header.title + '</div>' +
												'<div class="bounty__subtitle">' + bountyKillersData.header.subtitle + '</div>' +
											'</header>';
};

BountyKillers.prototype._renderNavigation = function() {
	if (bountyKillersData.nav.length < 2) {return false;}

	this.killersHTML += '<nav class="bounty__navigation js-bounty-nav">';

	for (var link = 0; link < bountyKillersData.nav.length; link++) {
		this.killersHTML += '<a class="bounty__navigationLink js-bounty-nav-link" href="#' + bountyKillersData.nav[link].navHash + '">' + bountyKillersData.nav[link].navText + '</a>';
	}

	this.killersHTML +=	'</nav>';
};

BountyKillers.prototype._renderGoods = function() {
	this.killersHTML += '<div class="bounty__content js-bounty-content">';

	for (var killer = 0; killer < bountyKillersData.killers.length; killer++) {
		this.killersHTML += '<div class="bounty__item js-bounty-content-item">';

		for (var line = 0; line < bountyKillersData.killers[killer].lines.length; line++) {
			this._renderLines(bountyKillersData.killers[killer].lines[line]);
		}

		if (bountyKillersData.killers[killer].condition) {
			this.killersHTML += '<div class="bounty__itemCondition">' +
														'<p class="bounty__itemConditionTitle">Внимание</p>' +
														'<p class="bounty__itemConditionInfo">' + bountyKillersData.killers[killer].condition + '</p>' +
													'</div>';
		}

		this.killersHTML += '</div>';
	}

	this.killersHTML += '</div>';
};

BountyKillers.prototype._renderLines = function(line) {
	this.killersHTML += '<div class="bounty__itemLine">';

	if (line.title) {
		this.killersHTML += '<p class="bounty__itemLineTitle">' + line.title + '</p>';
	}

	this.killersHTML += '<div class="bounty__itemLineCols">';
	for (var item = 0; item < line.offers.length; item++) {
		if (item == 0) {
			this.killersHTML += '<div class="bounty__itemLineRow js-bounty-row">';
		}

		this._renderLinesItem(line.offers[item]);

		if ( (item + 1) % 3 == 0 || (item + 1) == line.offers.length ) {
			this.killersHTML += '</div>';

			if (item + 1 < line.offers.length) {
				this.killersHTML += '<div class="bounty__itemLineRow js-bounty-row">';
			}
		}
	}
	this.killersHTML += '</div>';

	if (line.condition) {
		this.killersHTML += '<p class="bounty__itemLineCondition">' + line.condition + '</p>';
	}

	this.killersHTML += '</div>';
};

BountyKillers.prototype._renderLinesItem = function(item) {
	var code 	  	  			= item.codes[0],
			labelHTML 	  		= item.label ? ('<span class="bountyGood__label">' + item.label.replace(/\s/g, '&nbsp;') + '</span>') : '',
			priceOldHTML  		= item.price.old ?
				('<span class="bountyGood__priceOld">' + item.price.old.slice(0,-1) +
				'<i class="bountyGood__priceCurrency">' + item.price.old.slice(-1) +
				'</i></span>') : '',
			currencyPosition 	= item.price.actual.indexOf('₽'),
			priceCurrentHTML	= item.price.actual.slice(0, currencyPosition) +
				'<i class="bountyGood__priceCurrency">' +
					item.price.actual.slice(currencyPosition, currencyPosition + 1) +
					item.price.actual.slice(currencyPosition + 1) +
				'</i>',
			dropdownHTML  		= this._renderDropdown(item),
			dropdownClass 		= dropdownHTML ? ' bountyGood--dropdown' : '',
			noteHTML 	  			= item.note ? ('<p class="bountyGood__note">' + item.note + '</p>') : '';

	this.killersHTML += '<div class="bounty__itemLineGood bountyGood js-bounty-good' + dropdownClass + '">' +
												'<div class="bountyGood__imgWrapper">' +
													'<img class="bountyGood__img" src="' + this.companyURL + 'i/' + item.image + '.jpg" />' +
												'</div>' +
												labelHTML +
												'<p class="bountyGood__title">' + item.title + '</p>' +
												'<p class="bountyGood__description">' + item.description + '</p>' +
												dropdownHTML +
												'<p class="bountyGood__code">Код для заказа: <span class="bountyGood__codeNumber js-bounty-good-code">' + code + '</span></p>' +
												'<p class="bountyGood__price">' + priceOldHTML + priceCurrentHTML +	'</p>' +
												'<a class="bountyGood__button js-bounty-good-button" href="javascript:ad_to_order(\'LN:' + code + ';Q:1\');">Купить</a>' +
												noteHTML +
											'</div>';
};

BountyKillers.prototype._renderDropdown = function(item) {
	var dropdownHTML  = '',
		type 						= item.type,
		self 						= this;

	if (type) {
		function addListItemsCommon() {
			for (var i = 0; i <item.fsc.length; i++) {
				(type === 'colors') ? colorHTML = '<img src="' + self.companyURL + 'i/colors/shade_' + item.fsc[i] + '.jpg" />' : colorHTML = '';
				(i == 0) 						? activeClass = ' is-active' : activeClass = '';
				listItemsHTML += '<li class="bountyGood__dropdownListItem js-bounty-good-dropdown-list-item' + activeClass + '" data-code="' + item.codes[i] + '">' + item.variants.text[i] + colorHTML + '</li>';
			}

			choiceHTML += '<div class="bountyGood__dropdownChoice js-bounty-good-dropdown-choice">' +
											'<span class="bountyGood__dropdownChoiceTitle">' + titleChoice + '</span>' +
											'<span class="bountyGood__dropdownChoiceInfo js-bounty-good-dropdown-choice-info"></span>' +
										'</div>';
		}

		function addListItemsSet() {
			var set = item.variants.text[0].split(';');

			for (var i = 0; i < set.length; i++) {
				var punctuationMark = (i == set.length - 1) ? '.' : ';';

				listItemsHTML += '<li class="bountyGood__dropdownListItem">' + set[i].trim() + punctuationMark + '</li>';
			}
		}

		var title = item.variants.title,
				titleChoice = item.variants.chosenTitle + ':',
				listItemsClass = '',
				listItemsHTML = '',
				choiceHTML = '',
				activeClass,
				colorHTML;

		switch(type) {
			case 'colors':
				listItemsClass += ' has-colors';
				addListItemsCommon();
				break;
			case 'sizes':
				addListItemsCommon();
				break;
			case 'letter':
				listItemsClass += ' has-letters';
				addListItemsCommon();
				break;
			case 'set':
				listItemsClass += ' has-set';
				addListItemsSet();
				break;
		}

		dropdownHTML += '<div class="bountyGood__dropdown js-bounty-good-dropdown">' +
											'<div class="bountyGood__dropdownTitle js-bounty-good-dropdown-title">' + title + '</div>' +
											'<div class="bountyGood__dropdownContent js-bounty-good-dropdown-content">' +
												'<ul class="bountyGood__dropdownList js-bounty-good-dropdown-list' + listItemsClass + '" data-type="' + type + '">' +
													listItemsHTML +
												'</ul>' +
												choiceHTML +
											'</div>' +
										'</div>';
	}

	return dropdownHTML;
};

BountyKillers.prototype._checkNavLinksWidth = function() {
	var navLinksWidth = Math.round((100 / this.$navLinks.length) * 100) / 100;

	this.$navLinks.css('width', navLinksWidth + '%');
};

BountyKillers.prototype._checkActiveTab = function() {
	this._parseHash();

	var self = this,
			$activeNavLink = this.$navLinks.filter(function(index, element) {
				var href = this.getAttribute('href').slice(1);

				for (var key in self.hashParameters) {
					if (href == self.hashParameters[key]) {
						return $(element);
					}
				}
			});

	if ($activeNavLink.length) {
		$activeNavLink.trigger('click');
	} else {
		if (this.$navLinks.length) {
			this.$navLinks.eq(0).trigger('click');
		} else {
			this.$contentItems.addClass('is-active');
		}
	}
};

BountyKillers.prototype._checkDropdown = function() {
	this.$bounty.find('.js-bounty-good-dropdown').closest('.js-bounty-row').addClass('js-bounty-row-has-dropdown');
};

BountyKillers.prototype._parseHash = function() {
	var self = this,
			hash = window.location.hash.slice(1),
			beatingHash = hash.split('&');

	this.hashParameters = {};

	beatingHash.forEach(function(item, index, array) {
		if (item) {
			var parameter = item.split('=');

			self.hashParameters[parameter[0] + index] = parameter[1];
		}
	});

	return this.hashParameters;
};

BountyKillers.prototype._updateHash = function(hash) {
	this._parseHash();

	var self = this,
			url = '',
			isHashFound = false;

	for (var key in this.hashParameters) {
		this.$navLinks.each(function(index, element) {
			if (element.getAttribute('href').slice(1) == self.hashParameters[key]) {
				self.hashParameters[key] = hash;
				isHashFound = true;
			}
		});
	}

	if (!isHashFound) {
		var hashLength = Object.keys(this.hashParameters).length;

		this.hashParameters['category' + hashLength] = hash;

	}

	for (var key in this.hashParameters) {
		url += 'category=' + this.hashParameters[key] + '&';
	}

	url = url.slice(0, -1);
	window.location.hash = url;
};

BountyKillers.prototype._switchingContent = function(e) {
	e.preventDefault();
	var $target = $(e.currentTarget);

	if (!$target.hasClass('is-active')) {
		var index = this.$navLinks.index($target);

		this.$navLinks.removeClass('is-active');
		this.$contentItems.removeClass('is-active');
		$target.addClass('is-active');
		this.$contentItems.eq(index).addClass('is-active');
		this._updateHash($target.attr('href').slice(1));
	}
};

BountyKillers.prototype._toggleDropdown = function(e) {
	e.preventDefault();
	var $target = $(e.currentTarget);

	if ($target.hasClass('is-active')) {
		this._hideAllDropdowns();
	} else {
		this._hideAllDropdowns();
		$target.addClass('is-active')
			.closest('.js-bounty-good-dropdown')
			.find('.js-bounty-good-dropdown-content').stop().slideDown();
	}
};

BountyKillers.prototype._hideAllDropdowns = function() {
	this.$bounty.find('.js-bounty-good-dropdown-title').removeClass('is-active')
		.closest('.js-bounty-good-dropdown')
		.find('.js-bounty-good-dropdown-content').stop().slideUp();
};

BountyKillers.prototype._selectGoodFromDropdown = function(e) {
	e.preventDefault();
	var $target 	= $(e.currentTarget),
		$list				= $target.closest('.js-bounty-good-dropdown-list'),
		$dropdown 	= $target.closest('.js-bounty-good-dropdown'),
		$good				= $dropdown.closest('.js-bounty-good'),
		itemName 		= $target.text(),
		code 				= $target.data('code'),
		type 				= $list.data('type'),
		titleText 	= '';

	switch(type) {
		case 'colors':
			titleText += 'Оттенок: '
			break;
		case 'sizes':
			titleText += 'Размер: ';
			break;
		case 'letter':
			titleText += 'Буква: ';
			break;
	}

	$list.find('.js-bounty-good-dropdown-list-item').removeClass('is-active');
	$target.addClass('is-active');
	$dropdown.find('.js-bounty-good-dropdown-title')
		.text(titleText + itemName).addClass('is-chosen').trigger('click');
	$good.find('.js-bounty-good-code').text(code);
	$good.find('.js-bounty-good-button').attr('href', 'javascript:ad_to_order(\'LN:' + code + ';Q:1\');');
};

BountyKillers.prototype._showGoodInfo = function(e) {
	var $target = $(e.currentTarget),
		text = $target.text();

	$target.closest('.js-bounty-good-dropdown-content')
		.find('.js-bounty-good-dropdown-choice').addClass('is-active')
		.find('.js-bounty-good-dropdown-choice-info').text(text);
};

BountyKillers.prototype._hideGoodInfo = function(e) {
	var $target = $(e.currentTarget);

	$target.closest('.js-bounty-good-dropdown-content')
		.find('.js-bounty-good-dropdown-choice').removeClass('is-active');
};



$(document).ready(function() {
	$('.js-bounty').each(function(index, element) {
		new BountyKillers(element);
	});
});
