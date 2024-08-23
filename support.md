'use client'
import { Button } from '@/components/ui/Button/Button';
import styled from './kanban.module.scss'
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/Input/Input';
import { TaskFields } from '@/components/Task-fields/TaskFields';
import { nanoid } from 'nanoid';
import { observer } from 'mobx-react-lite';
import { Textarea } from '@/components/ui/Textarea/Textarea';




const colors = ['#E93636', '#44AE41', '#1853E9', '#FF7A00', '#717171'];

function Kanbanpage(){


    const [isOpen, setIsOpen] = useState(false);
    const [taskName, setTaskName] = useState<any>('');
    const [taskDescription, setTaskDescription] = useState('');
    const [color, setColor] = useState('');
    const [inputError, setInputError] = useState('');
    const [textareaError, setTextareaError] = useState('');
    const modalRef = useRef<HTMLFormElement>(null);


    const handleClickOutside = (event: React.MouseEvent<HTMLElement>) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            setIsOpen(false);
          }
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside as any);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside as any);
        };
    }, []);

  
    const formSubmit = (event: React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
        const id = nanoid(3)
      
        const newTask = {id:id, name: taskName, task: taskDescription, bgColor: color };
       
        // Получаем текущие задачи из localStorage или инициализируем новый массив
        const startedTask = JSON.parse(localStorage.getItem("inStartedTask") || "[]");
        const progressTask = JSON.parse(localStorage.getItem("inProgressTask") || "[]");
        const doneTask = JSON.parse(localStorage.getItem("inDoneTask") || "[]");

 

        if(!taskName && !taskDescription){
            return false
        }else if(!taskName){

            if(!taskName){
                setInputError('Empty field')
            }
            return false
        }else if(!taskDescription){
           
            if(!taskDescription){
                setTextareaError('Empty field');
            }

            return false
        }else{
            // Добавляем новую задачу в массив
            startedTask.push(newTask);
            setTaskName('');
            setTaskDescription('');
            setTextareaError('');   
            setInputError('');   
        }
    
        // Сохраняем обновленный массив обратно в localStorage
        localStorage.setItem("inStartedTask", JSON.stringify(startedTask));
        localStorage.setItem("inProgressTask", JSON.stringify(progressTask));
        localStorage.setItem("inDoneTask", JSON.stringify(doneTask));

    
        // Закрываем окно
        setIsOpen(!isOpen);
      
    }
  
    return (
        <section className={styled.kanban}>
            <p>Board</p>
            
            <ul className={styled.kanban__inner}>
                <li className={styled.kanban__item}>In started {}</li>
                <li className={styled.kanban__item}>In progress {}</li>
                <li className={styled.kanban__item}>Done {}</li>
                
            </ul>
            <TaskFields />
            <Button onClick={() => setIsOpen(!isOpen)} id='add-card'>
                <div>Add task</div>
                <div className={styled.buttonPlus}>+</div>
            </Button>
            {
                isOpen && (
                    <form className={styled.formWindow} onSubmit={formSubmit} ref={modalRef}>
                        <div className={styled.formInputs}>
                            <Input type='text' id='name' label='name' placeholder='Task name' onChange={(event)=> setTaskName(event.target.value)} error={inputError} value={taskName}/>
                            <Textarea label='description' placeholder='Task description' textChange={(event)=> setTaskDescription(event.target.value)} error={textareaError} value={taskDescription}></Textarea>
                        </div>

                        <div className={styled.formAction}>
                            <div className={styled.actionColors}>
                                {
                                    colors.map((color:string, id:number) =>{
                                    return <div className={styled.actionColor} key={id} style={{ backgroundColor: color }} onClick={()=> setColor(color)}></div>
                                    })
                                }
                            </div>
                            <Button>
                                Add card
                            </Button>

                        </div>
                      
                    </form>
                )
            }
        </section>
    )
}

export default observer(Kanbanpage)








<!-- store -->
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




<!-- task -->




import { observer } from 'mobx-react-lite';
import styled from './Task.module.scss'
import kanbanStore from '@/app/Store/kanbanStore';
import { useRef, useState,useEffect } from 'react';
import { Button } from '../Button/Button';

interface Itask{
    name:string;
    task:string;
    draggable:boolean
    id:string;
    bgColor:string
}

export const Task: React.FC<Itask> = observer(({ name, task, id, draggable, bgColor}) => {
    const [renderingButton, setRenderingButton] = useState(false);
    const [changeModal, setChangeModal] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

        

    const staredTask = JSON.parse(localStorage.getItem("inStartedTask") || '[]').find((task:{id:string, name:string, bgColor:string, task:string}) => task.id === id);
    const progressTask = JSON.parse(localStorage.getItem("inProgressTask") || '[]').find((task:{id:string, name:string, bgColor:string, task:string}) => task.id === id);
    const doneTask = JSON.parse(localStorage.getItem("inDoneTask") || '[]').find((task:{id:string, name:string, bgColor:string, task:string}) => task.id === id);


    const handleClickOutside = (event: React.MouseEvent<HTMLElement>) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            setChangeModal(false);
          }
    };

    const getItemStorage = (id:string) =>{

        let storage; // ключ нужного localStorage
        let dynamicStateStorage; // При переносе автоматически определять в каком поле находится таска
        let prevStateStorage; // Предыдущий localStorage


        // Получение предыдущего storage где был элемент до его перетаскивания
        if (staredTask) {
            prevStateStorage = "inStartedTask";
        } else if (progressTask) {
            prevStateStorage = "inProgressTask";
        } else if(doneTask) {
            prevStateStorage = "inDoneTask";
        }else {
            prevStateStorage = null; // Или можно вернуть пустой массив, если элемент не найден в обоих массивах
        }


        // Получение storage 
        if (staredTask) {
            storage = "inStartedTask";
        } else if (progressTask) {
            storage = "inProgressTask";
        } else if(doneTask) {
            storage = "inDoneTask";
        }else {
            storage = null; // Или можно вернуть пустой массив, если элемент не найден в обоих массивах
        }

        // получение тогго storage в котором сейчас находится перетаскиваемый элемент 
        if (staredTask) {
            dynamicStateStorage = localStorage.getItem("inStartedTask") || '[]';
        } else if (progressTask) {
            dynamicStateStorage = localStorage.getItem("inProgressTask") || '[]';
        } else if(doneTask) {
            dynamicStateStorage = localStorage.getItem("inDoneTask") || '[]';
        }else {
            dynamicStateStorage = null; // Или можно вернуть пустой массив, если элемент не найден в обоих массивах
        }
      
     
        kanbanStore.getTask(id, storage, dynamicStateStorage, prevStateStorage)

    } 

    const closedModal = (id:string) =>{
  
        let taskArray; // нужный localStorage без parce
        let storage; // ключ нужного localStorage
    
        if (staredTask) {
            storage = "inStartedTask";
        } else if (progressTask) {
            storage = "inProgressTask";
        } else if(doneTask){
            storage = "inDoneTask";
        } else {
            storage = null; // Или можно вернуть пустой массив, если элемент не найден в обоих массивах
        }

        
        if (staredTask) {
            taskArray = localStorage.getItem("inStartedTask") || '[]';
        } else if (progressTask) {
            taskArray = localStorage.getItem("inProgressTask") || '[]';
        }else if(doneTask){
            taskArray = localStorage.getItem("inDoneTask") || '[]';
        }else {
            taskArray = null; // Или можно вернуть пустой массив, если элемент не найден в обоих массивах
        }
    
        kanbanStore.deleteTask(taskArray, id, storage)
        setChangeModal(false)
    }
 
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside as any);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside as any);
        };
    }, []);

    return (
        <>
            <li
                style={{ backgroundColor: bgColor}}
                className={styled.task}
                draggable={draggable}
                onDragStart={() => getItemStorage(id)}
                onMouseEnter={() => setRenderingButton(true)}
                onMouseLeave={() => setRenderingButton(false)}
            >
                {renderingButton && (
                    <button className={styled.task__closed} onClick={() => setChangeModal(true)}>
                        +
                    </button>
                )}
                <div>
                    <h3 className={styled.task__name}>{name}</h3>
                    <p className={styled.task__description}>{task}</p>
                </div>
  
            </li>

            {changeModal && (
                <div className={styled.task__modal} ref={modalRef}>
                    <h2 className={styled.task__modalTitle}>Вы действительно хотите удалить данную задачу</h2>
                    <Button style={{ width: 120 }} onClick={()=> closedModal(id)}>Да</Button>
                    <Button style={{ width: 120 }} onClick={() => setChangeModal(false)}>Нет</Button>
                </div>
            )}
        </>
    );
});






<!-- task fields -->





import { useEffect, useState } from 'react'
import styled from './TaskFields.module.scss'
import { Task } from '../ui/Task/Task'
import { observer } from 'mobx-react-lite';
import kanbanStore from '@/app/Store/kanbanStore';


interface Itask{
    name:string;
    task:string;
    id:string;
    bgColor:string
}


export const TaskFields:React.FC = observer(() =>{
  
    const [startedTasks, setStartedTasks] = useState<Itask[]>([]);

    const [progressTasks, setProgressTasks] = useState<Itask[]>([]);

    const [doneTask, setDoneTask] = useState<Itask[]>([])

    
    useEffect(() => {
        const intervalId = setInterval(() => {
            const inStartedTask = localStorage.getItem('inStartedTask');
            
            const inProgressTasks = localStorage.getItem('inProgressTask') || '[]';

            const inDoneTask = localStorage.getItem('inDoneTask') || '[]';


            if(inProgressTasks){
                const parsedProgressTasks = JSON.parse(inProgressTasks);
                setProgressTasks(parsedProgressTasks);
            }
    
            if (inStartedTask) {
                const parsedTasks = JSON.parse(inStartedTask);
                setStartedTasks(parsedTasks);
            }
            if (inDoneTask) {
                const parsedDoneTasks = JSON.parse(inDoneTask);
                setDoneTask(parsedDoneTasks);
            }
         
        }, 1000); // Проверяем данные каждую секунду
    
        // Чистим интервал при размонтировании компонента
        return () => clearInterval(intervalId);
    }, []);


    // Рендеринг списка задач
    return (
        <div className={styled.taskFieldsWrapper}>
            <ul className={styled.taskList} id='dragStartField' onDragOver={(event) => event.preventDefault()} onDrop={(event)=> kanbanStore.handleTask(event)}>
                {startedTasks.map((task, index) => (
                    <Task 
                        bgColor={task.bgColor}
                        name={task.name} 
                        task={task.task} 
                        id={task.id}
                        key={index}
                        draggable
                    />
                ))}
            </ul>
            <ul className={styled.taskList} id='dragProgressField' onDragOver={(event) => event.preventDefault()} onDrop={(event)=> kanbanStore.handleTask(event)}>
            {progressTasks.map((task, index) => (
                    <Task 
                        bgColor={task.bgColor}
                        name={task.name} 
                        task={task.task} 
                        id={task.id}
                        key={index}
                        draggable
                    />
                ))}
            </ul>
            <ul className={styled.taskList} id='dragDoneField' onDragOver={(event) => event.preventDefault()} onDrop={(event)=> kanbanStore.handleTask(event)}>
            {doneTask.map((task, index) => (
                    <Task 
                        bgColor={task.bgColor}
                        name={task.name} 
                        task={task.task} 
                        id={task.id}
                        key={index}
                        draggable
                    />
                ))}
            </ul>
            <ul className={styled.taskList}>
      
            </ul>
        </div>
      
    );
})