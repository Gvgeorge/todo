function sendRequest(url, method, data){
    var r = axios({
        method: method,
        url: url,
        data: data,
        xsrfCookieName: 'csrftoken',
        xsrfHeaderName: 'X-CSRFToken',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    return r
}

var app = new Vue({
    el: '#app',
    delimiters: ['[[', ']]'],
    data: {
        edited_id: false,
        edited_idx: false,
        task: '',
        tasks: [
        ]
    },
    created(){ 
        var vm = this;
        var r = sendRequest('', 'get')
            .then(function(response){
                vm.tasks = response.data.tasks;

            })
    },
    computed: {
        taskList(){
            function compare(a, b){
                if (a.completed > b.completed){
                    return 1
                }
                if (a.completed < b.completed){
                    return -1
                }
                return 0

            }
            return this.tasks.sort(compare)
        }
    },
    methods: {
        createTask (){
            var vm = this;
            var formData = new FormData();
            formData.append('title', vm.task);
            if (vm.edited_id) {
                formData.append('task_id', vm.edited_id);
            }

            sendRequest('', 'post', formData)
                .then(function(response){
                    if (vm.edited_id) {
                        console.log(vm.edited_idx)
                        vm.tasks.splice(vm.edited_idx, 1);
                    }
                    vm.tasks.push(response.data.task);
                    vm.task = '';
                    vm.edited_id = false;
                    vm.edited_idx = false;
                })
        },
        completeTask(id, index){
            var vm = this;
            sendRequest('' + id + '/complete', 'post')
                .then(function(response){
                    //using splice because lists and dicts elements in vue are not reactive
                    vm.tasks.splice(index, 1);
                    vm.tasks.push(response.data.task);
                })

        },
        deleteTask(id, index){
            var vm = this;
            sendRequest('' + id + '/delete', 'post')
                .then(function(response){
                    //using splice because lists and dicts elements in vue are not reactive
                    vm.tasks.splice(index, 1);
                })
        },

        editTask(id, index){
            console.log('editing task')
            this.edited_id = id;
            this.edited_idx = index;
            this.task = this.tasks[index].title
            // console.log(this.tasks[i])
            // sendRequest('' + id + '/edit', 'post')
            //     .then(function(response){
            //         //using splice because lists and dicts elements in vue are not reactive
            //         vm.tasks.splice(index, 1);
            //     })
        }
    }
})