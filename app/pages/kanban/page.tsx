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
    const [taskName, setTaskName] = useState('');
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

  
    const openTaskWindow = () =>{
        setIsOpen(!isOpen)
    }
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
                <li className={styled.kanban__item}>+</li>
            </ul>
            <TaskFields />
            <Button onClick={()=> openTaskWindow()}>
                <div>Add task</div>
                <div className={styled.buttonPlus}>+</div>
            </Button>
            {
                isOpen && (
                    <form className={styled.formWindow} onSubmit={formSubmit} ref={modalRef}>
                        <div className={styled.formInputs}>
                            <Input type='text' name='name' placeholder='Task name' onChange={(event)=> setTaskName(event.target.value)} error={inputError}/>
                            <Textarea name='description' placeholder='Task description' textChange={(event)=> setTaskDescription(event.target.value)} error={textareaError}></Textarea>
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