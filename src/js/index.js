import '../sass/main.scss';
import './menu';
import './content';
//import app from './main';
// app();
jQuery(document).ready(function () {

  // menu
  var header = $("#header");

  $(window).scroll(function () {
		if ($(this).scrollTop() > 100) {
			header.addClass("header_small");
		} else {
			header.removeClass("header_small");
		}
  });
  
  // toggle task view
  $("input[name='content_view_btn']").on('click', (e) => {
    if (e.target.id == 'content_view_btn1' && !$('.group_task').hasClass('card-columns')) {
      $('.group_task').addClass('card-columns')
    } else if (e.target.id == 'content_view_btn2' && $('.group_task').hasClass('card-columns')) {
      $('.group_task').removeClass('card-columns');
    }
  })

  // counting cards
  $(".content h3").each((e) => {
    $(".content h3")[e].children[0].innerText = `(${$(".content h3").siblings('.group_task')[e].children.length})`;
    //$(".content h3")[e]
  })

  // authentication/registration
  var config = {
    // Enable or disable widget functionality with the following options. Some of these features require additional configuration in your Okta admin settings. Detailed information can be found here: https://github.com/okta/okta-signin-widget#okta-sign-in-widget
    // Look and feel changes:
    logo: 'images/logo.png', // Try changing "okta.com" to other domains, like: "workday.com", "splunk.com", or "delmonte.com"
    language: 'en',                       // Try: [fr, de, es, ja, zh-CN] Full list: https://github.com/okta/okta-signin-widget#language-and-text
    i18n: {
      //Overrides default text when using English. Override other languages by adding additional sections.
      'en': {
        'primaryauth.title': 'Sign In',   // Changes the sign in text
        'primaryauth.submit': 'Sign In',  // Changes the sign in button
      }
    },
    // Changes to widget functionality
    features: {
      registration: true,                 // Enable self-service registration flow
      rememberMe: true,                   // Setting to false will remove the checkbox to save username
      router: true,                       // Leave this set to true for the API demo
    },
    baseUrl: "https://dev-575577.okta.com",
    clientId: "0oau8wv7qDR3e6jff356",
    authParams: {
      issuer: "https://dev-575577.okta.com/oauth2/default",
      responseType: ['token', 'id_token'],
      display: 'page'
    }
  };

  var oktaSignIn = new OktaSignIn(config);

  if (oktaSignIn.token.hasTokensInUrl()) {
    oktaSignIn.token.parseTokensFromUrl(
      // If we get here, the user just logged in.
      function success(res) {
        var accessToken = res[0];
        var idToken = res[1]

        oktaSignIn.tokenManager.add('accessToken', accessToken);
        oktaSignIn.tokenManager.add('idToken', idToken);

        window.location.hash = '';
        console.dir(res);
        console.log("Hello, " + idToken.claims.email + "! You just logged in! :)");
      },
      function error(err) {
        console.error(err);
      }
    );
  } else {
    oktaSignIn.session.get(function (res) {
      // If we get here, the user is already signed in.
      if (res.status === 'ACTIVE') {
        console.dir(res);
        console.log("Hello, " + res.login + "! You are *still* logged in! :)");
        return;
      }
      oktaSignIn.renderEl(
        { el: '#okta-login-container' },
        function success(res) { },
        function error(err) {
          console.error(err);
        }
      );
    });
  }

  function logout() {
    oktaSignIn.signOut('/');
    // redirect to login page
    self.location = '/';
    oktaSignIn = new OktaSignIn(config);
  }

  // logout by ESC, later will change
  document.addEventListener('keyup', e => {
    if (e.keyCode == 27) logout();
  })

/*
  let manager = new ContentManager();

  // Массив из/в localstorage
  const parsingLocal = str => JSON.parse(localStorage.getItem(str));
  const postData = data => localStorage.setItem('currentData', JSON.stringify(data));

  // Получение контента из файла
  const getContent = func => $.ajax({
    type: "get",
    url: "/content/content.json",
    dataType: "json",
    success: data => {
      postData(data);
      (func.bind(null, data))();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
    }
  }).responseJSON;

  // Добавление контента
  function handler(e) {
    e.preventDefault();
    let newContent = manager.createContent(
      $("#new_content_title").val(),
      $("#new_content_type").val(),
      $("#new_content_link").val(),
      $("#new_content_creator").val(),
      $("#new_content_image").val(),
      $("#new_content_description").val()
    );
    postContent(newContent);
  }

  $("#add_content_form").submit(handler);

  function postContent(content) {
    let currentData = parsingLocal("currentData");
    currentData.push(content);
    postData(currentData);
    $("#add_content_form")[0].reset();
    addContentOnPage();
    closeAddContentWindow();

    $.ajax({
      type: "post",
      url: "/content/content.json",
      contentType: "application/json",
      //dataType: "json",
      data: content,
      success: function (newContent) {
        data.push(newContent)
        postData(parsingLocal('currentData').push(newContent));
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      }
    });

  }

  // удаление контента
  $(document).on('click', "label[title='delete']",e => {
    deleteContentById(e.target.parentElement.parentElement.id)
  });

  const deleteContentById = id => {
    let currentData = parsingLocal("currentData");
    currentData.splice(currentData.findIndex(e => e.id == id), 1);
    postData(currentData);
    addContentOnPage();
  }

  // Реагирование на нажатие на элемент меню
  $(".menu li input:checked").parent().addClass("active");
  $(".menu li input").change(e => {
    $("#heading h1").text(`${$(".menu li input:checked + label").text()}`)
    $(".menu li").removeClass("active");
    $(".menu li input:checked").parent().addClass("active");
    // Показать опции сортировки
    $(".sort:not(input[type='radio'])").show();
    $('label[for="button_add"]').show();
    // Обнулить выбор по автору
    $("#sort_by_creator option:first-child").prop("selected", true);
    addContentOnPage();
  })

  // Просмотреть контент
  $(document).on('click', 'figure', (event => {
    if (event.target.nodeName == 'I') return;
    let content = (parsingLocal('currentData')).find(elem => elem.id == event.currentTarget.id);
    $(".menu li input").prop('checked', false);
    $(".menu li").removeClass("active");
    $(".sort").hide();
    $('label[for="button_add"]').hide();
    $("#heading h1").text(`${content.title} - ${content.creator}`)
    // убираем что было
    $(".content").html('');
    $(".content").append(`<p>added ${content.add_time}</p>`)
      .append(`<img alt="content_image" src="${content.image}">`)
      .append(`<p>${content.description}</p>`)
      .append(`<a href='${content.download_link}'>download</a>`);
  }))

  // Сортировка
  // $("#sort_by, #sort_by_creator, input[name='sort_direction']").change(() => addContentOnPage());
  $(document).on('change', "#sort_by, input[name='sort_direction']", (() => addContentOnPage()));
  $(document).on('change', "#sort_by_creator", (() => addContentOnPage()));

  // Добавление вариантов в сортировку по автору
  // Вспомогательная функция отбора уникальных значений массива
  const uniqueVal = (value, index, self) => self.indexOf(value) === index;

  const addCreatorSortOptions = currentElements => {
    $("#sort_by_creator option:not(:first-child)").remove();
    $("#sort_by_creator option:first-child").prop("select", false);
    let options = (currentElements.map(e => e.creator)).filter(uniqueVal);
    const newOption = e => `<option value="${e}">${e}</option>`;
    for (let i = 0; i < options.length; i++) {
      $("#sort_by_creator").append(newOption(options[i]));
    }
  }

  // Присвоение контенту стандартного изображения, если надо
  const setDefaultImgByType = type => {
    switch (type) {
      case 'music': return 'content/images/music_default.png';
      case 'game': return 'content/images/game_default.png';
      case 'book': return 'content/images/book_default.png';
      case 'project': return 'content/images/project_default.png';
      case 'video': return 'content/images/video_default.png';
      default: return 'content/images/default.png';
    }
  }

  // добавление контента на страницу
  const addContentOnPage = (contentsInArr = parsingLocal('currentData'), type, condition, direction, creator) => {
    //if (!contentsInArr) contentsInArr = getContent();
    type = type ? type : $(".menu li input:checked").val();
    condition = condition ? condition : $("#sort_by").val();
    direction = direction ? direction : $("input[name='sort_direction']:checked").val();
    creator = creator ? creator : $("#sort_by_creator option:selected").val();
    if (creator != 0 && condition == "creator") direction = 0;
    // убираем что было
    $(".content").html('');
    // создание элементов
    const newContentElement = obj => {
      return $(`<figure class="content_element" id="${obj.id}"></figure>`)
        .append(`<button class="hidden" id="button_edit_${obj.id} name="button_edit"></button><label class="hidden" for="button_edit_${obj.id}" title="edit"><i class="fas fa-pencil-alt"></i></label>
        <button class="hidden" id="button_delete_${obj.id} name="button_delete"></button><label class="hidden" for="button_delete_${obj.id}" title="delete"><i class="far fa-trash-alt"></i></label>`)
        .append(`<img alt="${obj.type} picture" src="${obj.image || setDefaultImgByType(obj.type)}"/>`)
        .append(`<figcaption><span title='${(obj.title.length > 16) ? obj.title : ''}'>${obj.title}</span><span>${obj.creator || 'unknown'}</span></figcaption>`)
    }
    // фильтр по типу
    if (type != 0) contentsInArr = contentsInArr.filter(e => e.type === type);
    // фильтр по автору
    if (creator != 0) contentsInArr = contentsInArr.filter(e => e.creator === creator);
    // вид сортировки
    let param;
    const compareNumbers = (a, b) => a[param] - b[param];
    const compareDates = (a, b) => new Date(a[param]) - new Date(b[param]);
    const compareByText = (a, b) => a[param].toLowerCase() > b[param].toLowerCase() ? 1 : -1;
    switch (condition) {
      case 'date': param = 'add_time';
        contentsInArr.sort(compareDates);
        break;
      case 'title': param = 'title';
        contentsInArr.sort(compareByText);
        break;
      case 'creator': param = 'creator';
        contentsInArr.sort(compareByText);
        break;
    }
    // направление сортировки
    if (direction == 1) contentsInArr.reverse();
    // если подходящего контента нет
    if (contentsInArr.length == 0) {
      $(".content").append("<p>Ничего нет</p>");
      return;
    }
    // Запишем текущий контент
    localStorage.setItem("currentContent", JSON.stringify(contentsInArr));
    // Обновить варианты сортировки по автору
    addCreatorSortOptions(contentsInArr);
    if (creator != 0) $(`#sort_by_creator option[value="${creator}"]`).prop('selected', true);
    // А теперь добавляем
    contentsInArr.forEach(element => {
      $(".content").append(newContentElement(element));
    });
  }

  getContent(addContentOnPage);

  // окно добавления контента
  // убрать окно добавления контента
  const closeAddContentWindow = () => {
    $("div#add_content").hide();
    $('label[for="button_add"]').removeClass("active");
    document.body.style.overflow = 'auto';
  }

  $(document).on('click', 'label[for="button_add"]:not(.active)', (function () {
    // показать окно добавления контента
    $("div#add_content").show();
    $('label[for="button_add"]').addClass("active");
    $("body,html").animate({
      scrollTop:0
    });
    document.body.style.overflow = 'hidden';
  }));

  $(document).on('click', 'div#add_content:not(form), label[for="button_add"].active', (e => {
    if (e.target.id === "add_content" || e.target.htmlFor === "button_add") {
      closeAddContentWindow();
    }
  }));

*/

});
