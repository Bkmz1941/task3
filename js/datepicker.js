const datepicker = new (function Datepicker() {
    this.defaultOffsetDay = 7;
    this.from = null;
    this.to = null;
    this.dateFormat = "mm/dd/yy";
    this.init = function () {
        this.from = $("#from")
            .datepicker({
                changeMonth: true,
                changeYear: true
            })
            .datepicker("setDate", new Date())
            .on("change", function () {
                datepicker.fetchTasks();
            });
        this.to = $("#to")
            .datepicker({
                changeMonth: true,
                changeYear: true
            })
            .datepicker("setDate", this.defaultOffsetDay)
            .on("change", function () {
                datepicker.fetchTasks();
            });
    }
    this.fetchTasks = function () {
        if (tasks.filters.search.length > 0) {
            return;
        }
        let dateFrom = new Date(this.getDate(this.from[0]));
        let dateTo = new Date(this.getDate(this.to[0]));

        const payload = {
            from: dateFrom.valueOf(),
            to: dateTo.valueOf(),
            status: tasks.filters.statusActive
        }
        api.getDateTasks(payload)
            .then(results => {
                tasks.setList(results);
            })
            .catch(error => {
                console.log(error)
            });
    }
    this.getDate = function (element) {
        let date;
        try {
            date = $.datepicker.parseDate(this.dateFormat, element.value);
        } catch (error) {
            date = null;
        }

        return date;
    }
})();