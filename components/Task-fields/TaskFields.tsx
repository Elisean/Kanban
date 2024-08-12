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