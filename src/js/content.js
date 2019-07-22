addEventListener('DOMContentLoaded', function () {
    const parsingLocal = function () { return JSON.parse(localStorage.getItem('content')) };
    const postData = function (data) { localStorage.setItem('content', JSON.stringify(data)) };

    /*
    // добавление обработчиков кнопок
    function addEventsForBtn() {
        let stageBtn = document.querySelectorAll('.fa-circle, .fa-check-circle');
        for (let i = 0; i < stageBtn.length; i++) {
            stageBtn[i].addEventListener("click", updateTask);
        }

        let removeBtn = document.querySelectorAll('.fa-trash');
        for (let i = 0; i < removeBtn.length; i++) {
            removeBtn[i].addEventListener("click", removeTask);
        }
    }
    */
    // запись нового задания в хранилище
    function postTask(title) {
        let tasksInArr = parsingLocal();
        let task = {};
        task.title = title;
        task.description = description;
        task.time = new Date;
        task.priority = priority || 'normal';
        task.color = color || 'steelblue'
        task.done = 0;
        tasksInArr.push(task);
        postData(tasksInArr);
    }

    /*
    // обновление записи задачи
    function updateTask(e) {
        let title = e.target.parentElement.innerText;
        let tasksInArr = parsingLocal();
        let index = tasksInArr.findIndex(function (e) { return e.title == title });
        let task = tasksInArr[index];
        task.done = task.done ? 0 : 1;
        tasksInArr.splice(index, 1, task);
        postData(tasksInArr);
        addTasksOnPage();
        return;
    }

    // удаление записи задачи
    function removeTask(e) {
        let title = e.target.parentElement.innerText;
        let tasksInArr = parsingLocal();
        let index = tasksInArr.findIndex(function (e) { return e.title == title });
        tasksInArr.splice(index, 1);
        postData(tasksInArr);
        addTasksOnPage();
        return;
    }
    // функции для сортировки элементов массива
    const compare = function (a, b) { return b.done - a.done }
    const compareByText = function (a, b) { return a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1 }

*/

    // составление списка
    const addTasksOnPage = function (tasksInArr) {
        if (!tasksInArr) tasksInArr = parsingLocal();
        let time;
        let target;
        let forDropMenu;
        $('#task_to_do').html('');
        $('#task_completed').html('');
        console.dir(tasksInArr);
        // tasksInArr.sort(compareByText).sort(compare);
        tasksInArr.forEach(function(e) {
            forDropMenu = `<a class="dropdown-item" href="#">Done</a>
            <a class="dropdown-item submenu dropleft dropdown-toggle" data-toggle="dropdown" href="#" aria-haspopup="true" aria-expanded="false">Change priority</a>
            <div class="dropdown-menu dropdown-menu-lg-left">
                <a class="dropdown-item" href="#">Hight</a>
                <a class="dropdown-item" href="#">Normal</a>
                <a class="dropdown-item" href="#">Low</a>
            </div>
            <a class="dropdown-item" href="#">Edit</a>`
            target = e.done == 1 ? '#task_completed' : '#task_to_do';
            time = (new Date(e.time)).toString().slice(3, 21);
            $(target).append(`
            <div class="card">
            <div class="task_info card-header text-right">
                <span class="priority ${e.priority}-priority"><img src="images/svg/arrow.svg"/>High priority</span>
                <span class="date"><img src="images/svg/clock.svg" />${time.slice(5,7) + time.slice(0,4) + time.slice(7, 20)}</span>
            </div>
            <div class="card-body">
                <div class="circle" style="background-color: ${e.color}">${e.title[0]}</div>
                <h5 class="card-title">${e.title}</h5>
                <p>${e.description}</p>
            </div>

            <!--manage the task-->
            <div id="dLabel1" class="card-button" data-toggle="dropdown" aria-haspopup="true"
                aria-expanded="false">
                <span class="btn-top"></span>
                <span class="btn-middle"></span>
                <span class="btn-bottom"></span>
            </div>

            <div class="dropdown-menu dropdown-menu-right dropdown-menu-lg-left dropleft" aria-labelledby="dLabel1">
                ${e.done ? '' : forDropMenu}
                <a class="dropdown-item" href="#">Delete</a>
            </div>

        </div>`)
        })
        // addEventsForBtn();
    }
    // Проверяем есть ли уже контент в local
    if (!localStorage.getItem('content')) {
        let tasksInNode = $("#task_to_do").children();
        let tasksInArr = [];
        let task;

        tasksInNode.each(function() {
            task = {};
            task.title = $(this).find('.card-title').text();
            task.description = $(this).find('.card-body p').text();
            task.time = new Date($(this).find('.date').text());
            task.priority = $(this).find('.priority').hasClass('high-priority') ? 'high' : $(this).find('.priority').hasClass('low-priority') ? 'low' : 'normal';
            task.color = $(this).find('.circle').css('background-color');
            task.done = 0;
            tasksInArr.push(task)
        })
        console.dir(tasksInArr);
        tasksInNode = $("#task_completed").children();
        tasksInNode.each(function() {
            task = {};
            task.title = $(this).find('.card-title').text();
            task.description = $(this).find('.card-body p').text();
            task.time = new Date();
            task.priority = 'normal';
            task.color = $(this).find('.circle').css('background-color');
            task.done = 1;
            tasksInArr.push(task);
        })

        console.dir(tasksInNode);
        postData(tasksInArr);
        //addEventsForBtn();
    } else addTasksOnPage();

/*
    // обработка запроса добавления задания
    function addNewTask(e) {
        e.preventDefault;
        postTask(document.getElementById("title_input").value);
        document.getElementById("title_input").value = '';
        addTasksOnPage();
    }

    let btn = document.getElementById("btn");
    btn.addEventListener("click", addNewTask);
    let titleInput = document.getElementById("title_input");
    titleInput.addEventListener("keypress", function (e) {
        if (e.keyCode == 13) {
            addNewTask(e);
        }
    });
    */
})
