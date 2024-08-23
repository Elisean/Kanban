'use client'

import { useEffect, useState } from 'react';
import styles from './TaskFields.module.scss'
import { observer } from 'mobx-react-lite';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, onValue, ref as dbRef } from 'firebase/database';
import { Task } from '../ui/Task/Task';



interface Task{
    task:string
    index:string
    taskId: string;
    taskDescription: string;
    taskName: string;
}


export const TaskFields:React.FC = observer(() =>{

    const [startedTasks, setStartedTasks] = useState<Task[]>([]);

    const [progressTasks, setProgressTasks] = useState<Task[]>([]);

    const [doneTask, setDoneTask] = useState<Task[]>([])

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
                            ...data[key]
                        }));
                        setStartedTasks(tasksList);
                    } else {
                        setStartedTasks([]);
                    }
                });
            } else {
                setStartedTasks([]);
            }
        });
    }, []);



    return (

            <div className={styles.kanbanFields}>

                <ul className={styles.kanbanFields__field}>
                      <p className={styles.kanbanFields__titles}>In started</p>

                      {startedTasks?.map((task, index) => (
                        <Task
                            key={index} 
                            id={task.taskId}
                            taskDescription={task.taskDescription}
                            taskName={task.taskName}
                            draggable
                        />
                    ))}

                </ul>

                <ul className={styles.kanbanFields__field}>
                      <p className={styles.kanbanFields__titles}>In progress</p>
                      {progressTasks?.map((task, index) => (
                        <Task
                            key={index} 
                            id={task.taskId}
                            taskDescription={task.taskDescription}
                            taskName={task.taskName}
                            draggable
                        />
                    ))}
                </ul>

                <ul className={styles.kanbanFields__field}>
                      <p className={styles.kanbanFields__titles}>Done</p>
                      {doneTask?.map((task, index) => (
                        <Task
                            key={index} 
                            id={task.taskId}
                            taskDescription={task.taskDescription}
                            taskName={task.taskName}
                            draggable
                        />
                    ))}
                </ul>

            </div>
      
    );
})