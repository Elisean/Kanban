'use client'
import { useEffect, useState } from 'react';
import styles from './TaskFields.module.scss'
import { observer } from 'mobx-react-lite';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, onValue, ref as dbRef, update } from 'firebase/database';
import { Task } from '../ui/Task/Task';

interface Task{
    task:string;
    index:string;
    taskId: string;
    taskDescription: string;
    taskName: string;
    taskColor:string;
    createdAt:string;
}


export const TaskFields:React.FC = observer(() =>{

    const [startedTasks, setStartedTasks] = useState<Task[]>([]);
    const [progressTasks, setProgressTasks] = useState<Task[]>([]);
    const [doneTask, setDoneTask] = useState<Task[]>([]);
    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const db = getDatabase();
                const userId = user.uid;
                const tasksRef = dbRef(db, `tasks/${userId}`);
                onValue(tasksRef, (snapshot) => {
                    const data = snapshot.val();
                   
                    if (data) {
                        const tasksList = Object.keys(data).map(key => ({
                            ...data[key],
                        }));

                        // Сортировка задач по статусам
                        const started = tasksList.filter(task => task.taskStatus === 'in started');
                        const progress = tasksList.filter(task => task.taskStatus === 'in progress');
                        const done = tasksList.filter(task => task.taskStatus === 'done');

                        setStartedTasks(started);
                        setProgressTasks(progress);
                        setDoneTask(done);
                    } else {
                        setStartedTasks([]);
                        setProgressTasks([]);
                        setDoneTask([]);
                    }
                });
            } else {
                setStartedTasks([]);
                setProgressTasks([]);
                setDoneTask([]);
            }
        });
    }, []);

    const handleDragStart = (taskId: string) => {
        setDraggedTaskId(taskId);
        
    };

    const dropTask = (event: DragEvent) => {
        event.preventDefault();
        
        if (event.target instanceof HTMLElement && event.target.children.length > 0) {
            const locationTask = event.target.children[0].textContent?.toLowerCase();
            console.log('Dropped task location:', locationTask);
            if (draggedTaskId) {
                const auth = getAuth();
                const user = auth.currentUser;
                if (user) {
                    const db = getDatabase();
                    const taskRef = dbRef(db, `tasks/${user.uid}/${draggedTaskId}`);
                    update(taskRef, { taskStatus: locationTask })
                        .then(() => {
                            console.log('Task status updated successfully');
                        })
                        .catch((error) => {
                            console.error('Error updating task status:', error);
                        });
                }
            }
        } else {
            console.error('Invalid drop target');
        }
    };

    return (

            <div className={styles.kanbanFields}>

                <ul className={styles.kanbanFields__field} onDrop={(event:React.DragEvent<HTMLUListElement>) => dropTask(event.nativeEvent)} onDragOver={(event) => event.preventDefault()}>
                            <p className={styles.kanbanFields__titles}>In started</p>
                            <span>{startedTasks.length}</span>
                      {startedTasks?.map((task, index) => (
                        <Task
                            date={task.createdAt}
                            bgColor={task.taskColor}
                            key={index} 
                            id={task.taskId}
                            taskDescription={task.taskDescription}
                            taskName={task.taskName}
                            onDragStart={() => handleDragStart(task.taskId)}
                            draggable
                        />
                    ))}

                </ul>

                <ul className={styles.kanbanFields__field} onDrop={(event:React.DragEvent<HTMLUListElement>) => dropTask(event.nativeEvent)} onDragOver={(event) => event.preventDefault()}>
                      <p className={styles.kanbanFields__titles}>In progress</p>
                      <span>{progressTasks.length}</span>
                      {progressTasks?.map((task, index) => (
                        <Task
                            date={task.createdAt}
                            bgColor={task.taskColor}
                            key={index} 
                            id={task.taskId}
                            taskDescription={task.taskDescription}
                            taskName={task.taskName}
                            onDragStart={() => handleDragStart(task.taskId)}
                            draggable
                        />
                    ))}
                </ul>

                <ul className={styles.kanbanFields__field} onDrop={(event:React.DragEvent<HTMLUListElement>) => dropTask(event.nativeEvent)} onDragOver={(event) => event.preventDefault()}>
                      <p className={styles.kanbanFields__titles}>Done</p>
                      <span>{doneTask.length}</span>
                      {doneTask?.map((task, index) => (
                        <Task
                            date={task.createdAt}
                            bgColor={task.taskColor}
                            key={index} 
                            id={task.taskId}
                            taskDescription={task.taskDescription}
                            taskName={task.taskName}
                            onDragStart={() => handleDragStart(task.taskId)}
                            draggable
                        />
                    ))}
                </ul>

            </div>
      
    );
})