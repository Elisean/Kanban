'use client'
import React, { useState, useRef, useEffect } from 'react';
import styles from './kanban.module.scss';
import { Input } from '@/components/ui/Input/Input';
import { Textarea } from '@/components/ui/Textarea/Textarea';
import { Button } from '@/components/ui/Button/Button';
import { getDatabase, ref as dbRef, push, set } from "firebase/database";
import { getAuth } from 'firebase/auth'
import { TaskFields } from '@/components/Task-fields/TaskFields';

function Kanbanpage() {
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = useRef<HTMLFormElement>(null);
    const auth = getAuth();

    const [tasks, setTasks] = useState<any>({
        taskName: '',
        taskDescription: ''
    });

    const handleClickOutside = (event: any) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!tasks.taskName || !tasks.taskDescription) {
            console.error("Task name or task description is undefined");
            return;
        }

        if (!auth.currentUser) {
            console.error('User is not authenticated');
            return;
        }

        try {
            const db = getDatabase();
            const userId = auth.currentUser.uid;
            const taskRef = push(dbRef(db, `tasks/${userId}`));
            await set(taskRef, {
                taskId: taskRef.key,
                taskName: tasks.taskName,
                taskDescription: tasks.taskDescription,
                taskStatus: 'in started',
                createdAt: new Date().toISOString(),
            });
            setIsOpen(false);
        } catch (error) {
            console.error('Error creating task: ', error);
        }
    };

    return (
        <div className={styles.kanban}>
            <div className={styles.kanban__wrapper}>
                <p>Board</p>
                <TaskFields />
                <Button id='add-card' onClick={() => setIsOpen(!isOpen)}>Add card</Button>
            </div>

            {isOpen && (
                <form action="#" className={styles.kanban__window} ref={modalRef} onSubmit={handleSubmit}>
                    <Input type='text' id='task-name-input' placeholder='Task name' value={tasks.taskName} onChange={event => setTasks({ ...tasks, taskName: event.target.value })} />
                    <Textarea id='task-description-input' placeholder='Task description' value={tasks.taskDescription} textChange={event => setTasks({ ...tasks, taskDescription: event.target.value })} />
                    <Button id='add-task' type='submit'>Add task</Button>
                </form>
            )}
        </div>
    );
}

export default Kanbanpage;



