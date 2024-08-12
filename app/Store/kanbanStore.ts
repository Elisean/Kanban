import { action, makeAutoObservable, observable } from "mobx";

type Task = {
    id: string;
    name: string;
    bgColor: string;
    task: string;
}

class KanbanStore {

    id:string = '';
    @observable storage:string | null = '';
    @observable dynamicStateStorage:string | null = '';
    @observable inStartedTask:any;
    @observable inProgressTask:any;
    @observable inDoneTask:any;
    @observable prevStateStorage:string | null = '';
    
    constructor(){
        makeAutoObservable(this)
    }

    @action getTask(id:string, storage:string | null, dynamicStateStorage:string | null, prevStateStorage:string | null){
        this.id = id
        this.storage = storage
        this.dynamicStateStorage = dynamicStateStorage
        this.inStartedTask = JSON.parse(localStorage.getItem("inStartedTask") || '[]')
        this.inProgressTask = JSON.parse(localStorage.getItem("inProgressTask") || '[]')
        this.inDoneTask = JSON.parse(localStorage.getItem("inDoneTask") || '[]')
        this.prevStateStorage = prevStateStorage
    }

    @action handleTask(event: any) {
       
        switch (event.nativeEvent.target.id) {
            case 'dragStartField':

            const newStartItem:Task[] = [];

            const newStartState = JSON.parse(this.dynamicStateStorage ?? '[]').filter((task:{id:string, name:string, bgColor:string, task:string})=>{
                if (task.id === this.id) {
                    newStartItem.push(task);
                    return false; // Убираем элемент из newTask
                }
                    return true; // Оставляем элемент в newTask
              });

            const currentInStartTask = JSON.parse(localStorage.getItem("inStartedTask") || '[]');
            const updatedInStartTask = [...currentInStartTask, ...newStartItem];

            this.storage = 'inStartedTask'
            localStorage.setItem(this.prevStateStorage ?? '', JSON.stringify(newStartState));
            localStorage.setItem(this.storage, JSON.stringify(updatedInStartTask));
            break; 
            
            case 'dragProgressField':

                const newProgressItem:Task[] = [];
               
              const newProgressState = JSON.parse(this.dynamicStateStorage ?? '[]').filter((task:{id:string, name:string, bgColor:string, task:string})=>{
                if (task.id === this.id) {
                    newProgressItem.push(task);
                    return false; // Убираем элемент из newTask
                }
                    return true; // Оставляем элемент в newTask
              });
             
              const currentInProgressTask = JSON.parse(localStorage.getItem("inProgressTask") || '[]');
              const updatedInProgressTask = [...currentInProgressTask, ...newProgressItem];
       
              this.storage = 'inProgressTask'

              localStorage.setItem(this.prevStateStorage ?? '', JSON.stringify(newProgressState));
              localStorage.setItem(this.storage, JSON.stringify(updatedInProgressTask));
           
            break;

            case 'dragDoneField':

            const newDoneItem:Task[] = [];
              
            const newDoneState = JSON.parse(this.dynamicStateStorage ?? '[]').filter((task:{id:string, name:string, bgColor:string, task:string})=>{
                if (task.id === this.id) {
                    newDoneItem.push(task);
                    return false; // Убираем элемент из newTask
                }
                    return true; // Оставляем элемент в newTask
              });

            const currentInDoneTask = JSON.parse(localStorage.getItem("inDoneTask") || '[]');
            const updatedInDoneTask = [...currentInDoneTask, ...newDoneItem];

            this.storage = 'inDoneTask'

            localStorage.setItem(this.prevStateStorage ?? '', JSON.stringify(newDoneState));
            localStorage.setItem(this.storage, JSON.stringify(updatedInDoneTask));

            break;
        }
  
    }
    
    @action deleteTask(taskToArray: string | null, id: string, storage: string | null) {
        if (id && taskToArray && storage) {
            const tasks = JSON.parse(taskToArray);
            const deletedTask = tasks.filter((task:{id:string, name:string, bgColor:string, task:string}) => task.id !== id);
            localStorage.setItem(storage, JSON.stringify(deletedTask));
        }
    }  
}


const kanbanStore = new KanbanStore();

export default kanbanStore;

