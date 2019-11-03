class TodoList {
  constructor (id) {
    this.todolist = document.getElementById(id);
    this.createBtn = document.querySelector('.create-btn');
    this.createForm = document.querySelector('.create-form');
    this.cancelBtn = document.querySelector('.cancel-btn');
    this.saveBtn = document.querySelector('.save-btn');
    this.tasks = document.querySelector('.tasks');
    this.taskTemplate = document.querySelector('.task');
    this.statusControlTemplate = document.querySelector('.task-status-control');
    this.titleFilter = document.querySelector('.filter-title');
    this.statusFilter = document.querySelector('.filter-status');
    this.priorityFilter = document.querySelector('.filter-priority');
    this.taskStatus = document.querySelector('.task-status-control');
    this.taskPriority = document.querySelector('.task-priority');
    this.taskNum = 1;
    this.tasksData = {};
    this.loadTasks();
    this.createEvents();
  }

  loadTasks () {
    this.getFromLocalStorage();
    const PRIORITY_LABELS = ['high', 'normal', 'low'];
    if (this.tasksData) {
      for (const currentTask in this.tasksData) {
        const currentTaskTemplate = this.taskTemplate.cloneNode();
        currentTaskTemplate.id = `task${this.taskNum}`;
        currentTaskTemplate.className += ` ${this.tasksData[currentTaskTemplate.id].className}`;
        currentTaskTemplate.innerHTML += `<div
class="task-title">${this.tasksData[currentTask].title}</div>
<div
class="task-description">${this.tasksData[currentTask].description}</div>
<div
class="task-priority">${PRIORITY_LABELS[this.tasksData[currentTask].priority]}</div>`;

        const statusControlTemplate = this.statusControlTemplate.outerHTML;
        currentTaskTemplate.innerHTML += statusControlTemplate;
        this.tasks.appendChild(currentTaskTemplate);
        currentTaskTemplate.querySelector('.task-status-control').onchange = this.manageTask.bind(this);
        this.taskNum = this.taskNum + 1;
      }
    }
  }

  showCreateForm () {
    this.createForm.classList.add('shown');
  }

  hideCreateForm () {
    this.createForm.classList.remove('shown'); this.clearForm();
  }

  manageTask (event) {
    const currentAction = event.target.value;
    const currentTaskId = event.target.parentElement.id;
    this[currentAction](currentTaskId);
  }

  filterTasksByTitle (event) {
    if (event.keyCode === 13) {
      const filterTitle = event.target.value;
      const tasks = document.querySelectorAll('.task');

      for (let i = 1; i < tasks.length; i + 1) {
        if (tasks[i].querySelector('.task-title').innerText === filterTitle) {
          tasks[i].style.display = 'block';
        } else {
          tasks[i].style.display = 'none';
        }
      }
    }
  }

  filterTasksByStatus (event) {
    console.log(event);
    const filterPriority = event.target.value;
    const tasks = document.querySelectorAll('.task');
		 	for (let i = 1; i < tasks.length; i++) {
      if (tasks[i].className.search('done-task') != -1 && filterPriority == 'done' || tasks[i].className.search('done-task') === -1 && filterPriority == 'open' || filterPriority == 'all') {
        tasks[i].style.display = 'block';
      } else {
        tasks[i].style.display = 'none';
      }
    }
  }

  filterTasksByPriority (event) {
    // console.log(event);
    const filterPriority = event.target.value;
    const tasks = document.querySelectorAll('.task');
    console.log(filterPriority);
    console.log('tasks', tasks);
    for (let i = 1; i < tasks.length; i++) {
      console.log('priority', tasks[i].querySelector('.task-priority'));
      if (tasks[i].querySelector('.task-priority').innerText != filterPriority && filterPriority != 'all') {
        tasks[i].style.display = 'none';
      } else {
        tasks[i].style.display = 'block';
      }
    }
  }

  clearForm () {
    const createFormItems = this.createForm.childNodes;
    for (let i = 0; i < createFormItems.length; i++) {
      if (createFormItems[i].tagName === 'INPUT') {
        createFormItems[i].value = '';
      } else if (createFormItems[i].tagName ===
		'SELECT') {
        createFormItems[i].selectedIndex = 0;
      }
    }
  }

  saveToLocalStorage () {
    localStorage.setItem('tasksData', JSON.stringify(this.tasksData));
  }

  getFromLocalStorage () {
    // console.log(JSON.parse("tasksData"));
    this.tasksData = JSON.parse(localStorage.getItem('tasksData')) ? JSON.parse(localStorage.getItem('tasksData')) : {};
  }

  createTodoItem (event) {
    event.preventDefault();
    const PRIORITY_LABELS = ['high', 'normal', 'low'];
    const createFormItems = this.createForm.childNodes;
    const currentTaskTemplate = this.taskTemplate.cloneNode();
    currentTaskTemplate.id = `task${this.taskNum}`;
    this.tasksData[currentTaskTemplate.id] = {};
    const currentTaskJSON = this.tasksData[currentTaskTemplate.id];

    for (let i = 0; i < createFormItems.length; i++) {
      if (createFormItems[i].tagName === 'INPUT' || createFormItems[i].tagName ===
		'SELECT') {
        currentTaskTemplate.innerHTML += ` <div
		class="task-${createFormItems[i].name}">${createFormItems[i].tagName ===
		'SELECT' ? PRIORITY_LABELS[createFormItems[i].value] : createFormItems[i].value}</div> `;

        currentTaskJSON[createFormItems[i].name] = createFormItems[i].value;
        // console.log(currentTaskJSON);
      }
    }

    const statusControlTemplate = this.statusControlTemplate.outerHTML;
    currentTaskTemplate.innerHTML += statusControlTemplate;

    this.taskNum++;

    this.tasks.appendChild(currentTaskTemplate);
    const selects = document.querySelectorAll('.task-status-control');
    for (let i = 0; i < selects.length; i++) {
      selects[i].onchange = this.manageTask.bind(this);
    }

    this.saveToLocalStorage();
    this.hideCreateForm();
    console.log(this.tasksData);
  }

  editTodoItem (sCurrentTaskId) {
    const currentTask = document.getElementById(sCurrentTaskId);
    const createFormItems = this.createForm.childNodes;
    let className = '';
    let taskKey = ''
			;
			// console.log(this.tasksData);

    for (let i = 0; i < createFormItems.length; i++) {
      if (createFormItems[i].tagName === 'INPUT') {
        className = createFormItems[i].className;
        taskKey = className.replace('item-', ''); // ???
        createFormItems[i].value = this.tasksData[sCurrentTaskId][taskKey];
      } else if (createFormItems[i].tagName ===
			'SELECT') {
        taskKey = createFormItems[i].className.replace('item-', '');
        createFormItems[i].selectedIndex = this.tasksData[sCurrentTaskId][taskKey];
      }
    }
    this.showCreateForm();
    this.saveBtn.onclick = (event) => {
      event.preventDefault();
      console.log('createFormItems', createFormItems);
      this.changeTodoItem(sCurrentTaskId, createFormItems);
    };
  }

  changeTodoItem (sCurrentTaskId, oCreateFormItems) {
    const PRIORITY_LABELS = ['high', 'normal', 'low'];
    this.getFromLocalStorage();
    const currentTaskData = this.tasksData[sCurrentTaskId];
    const createFormItems = oCreateFormItems;
    let className = '';
    let taskKey = ''
			;
    // console.log(currentTaskData);

    for (let i = 0; i < createFormItems.length; i++) {
      if (createFormItems[i].tagName === 'INPUT' || createFormItems[i].tagName ===
			'SELECT') {
        className = createFormItems[i].className.replace('item', 'task');
        taskKey = className.replace('task-', '');
        console.log(taskKey);
        currentTaskData[taskKey] = createFormItems[i].value;
        console.log(document.querySelector(`#${sCurrentTaskId} .${className}`));
        document.querySelector(`#${sCurrentTaskId} .${className}`).innerText = createFormItems[i].tagName ===
			'SELECT' ? PRIORITY_LABELS[createFormItems[i].value] : createFormItems[i].value;
      }
    }
    console.log('currentTaskData', currentTaskData);
    this.tasksData[sCurrentTaskId] = currentTaskData;

    this.saveToLocalStorage();
    this.hideCreateForm();
  }

  deleteTodoItem (sCurrentTaskId) {
    // console.log(sCurrentTaskId);

    document.getElementById(sCurrentTaskId).remove();
    delete this.tasksData[sCurrentTaskId];
    this.saveToLocalStorage();
  }

  doneTodoItem (sCurrentTaskId) {
    document.getElementById(sCurrentTaskId).classList.add('done-task');
    this.tasksData[sCurrentTaskId].className = 'done-task';
    this.saveToLocalStorage();
  }

  createEvents () {
    this.createBtn.onclick = this.showCreateForm.bind(this);
    this.cancelBtn.onclick = this.hideCreateForm.bind(this);
    this.saveBtn.onclick = this.createTodoItem.bind(this);
    this.statusFilter.onchange = this.filterTasksByStatus.bind(this);
    this.priorityFilter.onchange = this.filterTasksByPriority.bind(this);
    this.titleFilter.onkeyup = this.filterTasksByTitle.bind(this);
  }
}

const todo = new TodoList('todolist');
