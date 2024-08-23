import { observer } from 'mobx-react-lite';
import styles from './Task.module.scss'
import { Button } from '../Button/Button';
import { useEffect, useRef, useState } from 'react';
import kanbanStore from '@/app/Store/kanbanStore';



interface Itask{
    taskName:string;
    taskDescription:string;
    draggable:boolean
    id:string;
}

export const Task: React.FC<Itask> = observer(({taskName, taskDescription, draggable, id}) => {

   
    const modalRef = useRef<HTMLDivElement>(null);

    const [changeModal, setChangeModal] = useState(false);

    const [renderingButton, setRenderingButton] = useState(false);


    const handleClickOutside = (event: React.MouseEvent<HTMLElement>) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            setChangeModal(false);
          }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside as any);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside as any);
        };
    }, []);


    const closedModal = (id:string) =>{
    
        kanbanStore.deleteTask(id)
        setChangeModal(false)
    }

    return (

    <>
        <li 
            className={styles.task} 
            draggable={draggable} 
            id={id}
            onMouseEnter={() => setRenderingButton(true)}
            onMouseLeave={() => setRenderingButton(false)}
        >
            <div>   
                <h3 className={styles.task__name}>{taskName}</h3>
                <p className={styles.task__description}>{taskDescription}</p>
            </div>
        
          {renderingButton && (
                    <button className={styles.task__closed} onClick={() => setChangeModal(true)}>
                        +
                    </button>
            )}
        </li>

        {changeModal && (
            <div className={styles.task__modal} ref={modalRef}>
                <h2 className={styles.task__modalTitle}>Вы действительно хотите удалить данную задачу</h2>
                <Button style={{ width: 120 }} onClick={()=> closedModal(id)}>Да</Button>
                <Button style={{ width: 120 }} onClick={() => setChangeModal(false)}>Нет</Button>
            </div>
        )}
      
        </>
        )

        
});

