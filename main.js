(function(filterData){

  'use strict';

  const $filter = document.querySelector('[data-js="filter"]');
  const $select = document.querySelector('[data-js="select"]');
  const $opt = document.querySelector('[data-js="opt"]');
  const $search = document.querySelector('[data-js="search"]');
  const $result = document.querySelector('[data-js="result"]');
  const $options = document.querySelector('[name="options"]');

  let app = ((appController)=> {
    return {
      requisition: function requisition() {
        const ajax = new XMLHttpRequest();
        ajax.open('GET', 'https://api.pokemontcg.io/v1/cards', true);
        ajax.send();
        ajax.addEventListener('readystatechange', this.dataHandle, false)
      },

      dataHandle: function dataHandle() {
        if(!app.isReady.call(this))
            return;

        let data = JSON.parse(this.responseText);
        
        let rarityCards = [];
        data.cards.map(function (card) {
          rarityCards.push(card.rarity);
        });
        let rarityCardsArr = rarityCards.filter(function(elem, pos) {
          return rarityCards.indexOf(elem) == pos;
        });
        
        app.filterHandle(rarityCardsArr, data);
        
      },
      
      filterHandle: function filterHandle(rarityCardsArr, data) {
        
        rarityCardsArr.map(function (filter) {
          const $option = document.createElement("option");
          $option.textContent = filter;
          $option.setAttribute('value', filter);
          $option.setAttribute('name', 'options');
          $select.insertBefore($option, $opt);
        });
        
        app.cardsHandle(data);

      },

      cardsHandle: function cardsHandle(data) {
        $select.addEventListener('change', function() {
          let filterUrl = event.target.value,
          url = filterUrl + '.html';
          history.pushState(null, null, url);

          let choiceRarity = event.target.value;
          app.loading();
          var dataArr = [];
          dataArr.push(data);
          dataArr[0].cards.filter( function(item) {
            let $img = document.createElement("img");
            if (item.rarity === choiceRarity) {
              $img.setAttribute('class', 'card-img');
              $img.setAttribute('src', item.imageUrl);
              $img.setAttribute('title', item.name + ': by ' + item.artist);
              $img.setAttribute('alt', item.name);
              $result.appendChild($img);
            }
          });
          setTimeout(function() {
            document.querySelector('[data-js="loading"]').innerHTML = '';
            $result.style.opacity = '1';
            $result.style.visibility = 'visible';
          }, 3000);
          app.cardDetail(data);
        });
      },
      
      cardDetail: function cardDetail(data) {
        $result.addEventListener('click', function(event) {
          let $div = document.createElement('div');
          let $paragraph = document.createElement('p');
          event.target.setAttribute('class', 'card-detail');
          $paragraph.textContent = event.target.getAttribute('title');
          $paragraph.setAttribute('class', 'card-paragraph');
          $result.innerHTML = '';
          $div.appendChild(event.target);
          $div.appendChild($paragraph);
          $result.appendChild($div);
          let cardUrl = event.target.getAttribute('alt'),
          url = cardUrl + '.html';
          history.pushState(null, null, url);
        });
      },
      
      loading: function loading() {
        $result.innerHTML = '';
        const $span = document.createElement('span');
        $span.setAttribute('data-js', 'loading');
        $span.setAttribute('class', 'span-loading');
        document.body.insertBefore($span, $result);
        document.querySelector('[data-js="loading"]').innerHTML = '<img src="http://www.dobiz.me/img/loader.gif">';
        $result.style.opacity = '0';
        $result.style.visibility = 'hidden';
      },

      isReady: function isReady() {
          return this.readyState === 4 && this.status === 200;
      }
    };
  })();

  app.requisition();

})(window.filterData);
