const tasks = new (function Tasks() {
    this.list = [];
    this.sortListASC = true;
    this.filters = {
        statusActive: true,
        search: ''
    }
    this.pagination = {
        items: 6,
        page: 1,
        total: -1,
    }
    this.searchTasks = function () {
        const payload = {
            search: this.filters.search
        }
        api.findTask(payload)
            .then(results => {
                tasks.setList(results);
            })
            .catch(error => {
                console.log(error)
            })
    }
    this.showSortButton = function () {
        this.hideSortButton();
        const element = `
            <div class="task-sort_date" onclick="tasks.resortList()">
                <p id="todo-button_date-sort">Сортировка по датe</p>
                <i class="icon arrow-top-svg"></i>
            </div>
        `;
        $(".todo-content").prepend(element);
    }
    this.hideSortButton = function () {
        $(".todo-content").find('.task-sort_date').remove();
    }
    this.resortList = function () {
        this.sortListASC = !this.sortListASC;
        this.sortList();
        this.pagination.page = 1;
        this.drawTaskList();
        if (this.list.length > this.pagination.items) {
            this.drawPagination();
        }
        this.changeSortIcon();
    }
    this.changeSortIcon = function () {
        if (this.sortListASC) {
            $(".task-sort_date").find('.icon')[0].classList.remove('arrow-down-svg');
            $(".task-sort_date").find('.icon')[0].classList.add('arrow-top-svg');
        } else {
            $(".task-sort_date").find('.icon')[0].classList.remove('arrow-top-svg');
            $(".task-sort_date").find('.icon')[0].classList.add('arrow-down-svg');
        }
    }
    this.sortList = function () {
        if (this.sortListASC) {
            this.list.sort(function(a,b){
                return new Date(a.date) - new Date(b.date);
            });
        } else {
            this.list.sort(function(a,b){
                return new Date(b.date) - new Date(a.date);
            });
        }
    }
    this.setList = function (tasks) {
        this.sortListASC = true;
        this.hideSortButton();
        this.list = tasks;
        this.sortList();
        this.resetPagination();
        if (this.list.length > 0) {
            this.pagination.total = tasks.length;
            this.showSortButton();
            this.drawTaskList();
            if (this.list.length > this.pagination.items) {
                this.drawPagination();
            } else {
                this.removePagination();
            }
        } else {
            this.drawEmptyState();
        }
    }
    this.resetPagination = function () {
        this.pagination.total = -1;
        this.pagination.page = 1;
    }
    this.drawEmptyState = function () {
        $(".todo-tasks-wrapper").empty();
        $(".todo-content").find('.tasks-pagination').remove();
        const element = `
            <div class="todo-tasks_empty-state">
                <p>Задач нет</p>
            </div>
        `;
        $(".todo-tasks-wrapper").append(element);
    }
    this.paginationNext = function () {
        if (this.pagination.page < Math.ceil(this.pagination.total / this.pagination.items)) {
            this.pagination.page++;
            this.updatePaginationText();
            this.drawTaskList();
        }
    }
    this.paginationBack = function () {
        if (this.pagination.page > 1) {
            this.pagination.page--;
            this.updatePaginationText();
            this.drawTaskList();
        }
    }
    this.updatePaginationText = function () {
        $("#tasks-pagination_text").text(`${this.pagination.page} из ${Math.ceil(this.pagination.total / this.pagination.items)}`);
    }
    this.removePagination = function () {
        $(".todo-content").find('.tasks-pagination').remove();
    }
    this.drawPagination = function () {
        this.removePagination();
        const taskElement = `
            <div class="tasks-pagination">
                <button class="tasks-pagination_button" id="tasks-pagination_button_back" onclick="tasks.paginationBack()">Назад</button>
                <p id="tasks-pagination_text">${this.pagination.page} из ${Math.ceil(this.pagination.total / this.pagination.items)}</p>
                <button class="tasks-pagination_button" id="tasks-pagination_button_next" onclick="tasks.paginationNext()">Вперед</button>
            </div>
        `;
        $(".todo-content").append(taskElement);
    }
    this.drawTaskList = function () {
        $(".todo-tasks-wrapper").empty();
        let offsetElements = (this.pagination.page - 1) * this.pagination.items;
        const elements = this.list.slice(offsetElements, this.pagination.items + offsetElements)
        elements.map(el => {
            this.drawTask(el);
        })
    }
    this.drawTask = function (task) {
        const taskElement = `
            <div class="todo-task" id="${task.id}" onClick="taskDialog.open(this.id)">
                <div class="todo-task_info">
                    <h4 class="todo-task_title">${task.name}</h4>
                    <p class="todo-task_description">${task.shortDesc}</p>
                </div>
                <div class="todo-task_after">
                    <i class="icon ${task.status ? 'task-done-svg' : ''}"></i>
                    <p class="todo-task_date">${this.formatDate(task.date)}</p>
                </div>
            </div>
        `;

        $(".todo-tasks-wrapper").append(taskElement);
    }
    this.formatDate = function (string) {
        const date = new Date(string);
        let result = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
        result += " ";

        let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
        let minutes = date.getMinutes() === 0 ? '00' : date.getMinutes()

        result += hours + ":" + minutes;
        return result;
    }
})();