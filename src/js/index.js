import '../sass/main.scss';
import { ContentManager, Content } from './models';
//import app from './main';
// app();
jQuery(document).ready(function () {
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
    /*
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
    */
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
});
