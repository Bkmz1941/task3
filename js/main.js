const app = new (function () {
    this.debounceTimeout;
    this.init = function () {
        datepicker.init();
        fetchInitialTasks();

        $("#task-status-filter").change(function () {
            tasks.filters.statusActive = !this.checked;
            datepicker.fetchTasks();
        });

        $("#todo-button_today").click(function () {
            datepicker.from.datepicker("setDate", new Date());
            datepicker.to.datepicker("setDate", new Date());
            datepicker.fetchTasks();
        });
        $("#todo-button_week").click(function () {
            datepicker.from.datepicker("setDate", new Date());
            datepicker.to.datepicker("setDate", 7);
            datepicker.fetchTasks();
        });
        $(".todo-search-input").on("input", function () {
            (app.debounce(function (searchValue) {
                tasks.filters.search = searchValue;
                tasks.resetPagination();
                if (searchValue.length > 0) {
                    tasks.searchTasks();
                } else {
                    datepicker.fetchTasks();
                }
            }, 314))(this.value);
        });
    }
    this.debounce = function (func, ms) {
        return function () {
            clearTimeout(app.debounceTimeout);
            app.debounceTimeout = setTimeout(() => func.apply(this, arguments), ms);
        };
    }
})();

function fetchInitialTasks() {
    let dateFrom = new Date();
    let dateTo = new Date();
    dateTo.setDate(dateTo.getDate() + datepicker.defaultOffsetDay);

    api.getDateTasks({from: dateFrom.valueOf(), to: dateTo.valueOf()})
        .then(results => {
            tasks.setList(results);
        })
        .catch(error => {
            console.log(error)
        });
}

app.init();