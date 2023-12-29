const API_URL = "https://corsproxy.io/?https://todo.doczilla.pro/api";

const api = new (function Api() {
    this.getDateTasks = function (payload) {
        return new Promise((resolve, reject) => {
            const {from, to, status} = payload;
            let params = `from=${from}&to=${to}`;
            if (status === false) {
                params += `&status=${status}`;
            }

            fetch(`${API_URL}/todos/date?${params}`)
                .then(response => response.json())
                .then(data => {
                    resolve(data);
                })
                .catch(error => {
                    reject(error);
                })
        })
    }
    this.findTask = function (payload) {
        return new Promise((resolve, reject) => {
            const {from, to, status, search} = payload;
            let params = `q=${search}`;

            fetch(`${API_URL}/todos/find?${params}`)
                .then(response => response.json())
                .then(data => {
                    resolve(data);
                })
                .catch(error => {
                    reject(error);
                })
        })
    }
})();