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

