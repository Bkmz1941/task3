const taskDialog = new (function TaskDialog() {
    this.dialogEl = $("#task-dialog").dialog({
        autoOpen: false,
        height: 620,
        width: 650,
        buttons: {
            "Закрыть": function () {
                taskDialog.dialogEl.dialog("close");
            }
        },
        close: function () {
            taskDialog.clear();
        }
    });
    this.clear = function () {
        $("#task-dialog").empty();
    }
    this.open = function (taskId) {
        const task = tasks.list.find(el => el.id === taskId);
        this.dialogEl.dialog("open");
        this.dialogEl.dialog('option', 'title', task.name);
        const taskElement = `
            <div class="task-dialog_content">
                <div class="task-dialog_content__meta">
                    <p class="task-dialog_date">${tasks.formatDate(task.date)}</p>
                    <i class="icon ${task.status ? 'task-done-svg' : ''}"></i>
                </div>
                <p class="task-dialog_description">${task.fullDesc}</p>
            </div>
        `;
        $("#task-dialog").append(taskElement);
    }
})();