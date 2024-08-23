import { action, makeAutoObservable } from "mobx";
import { getDatabase, ref, remove } from 'firebase/database';
import { getAuth } from "firebase/auth";


class KanbanStore {

    constructor(){
        makeAutoObservable(this);
    }

    @action async deleteTask(id: string) {
        if (id) {
            try {
                const auth = getAuth(); // получение авторизации юзреа
                if (!auth.currentUser) {
                    return;
                }
                const db = getDatabase(); // получение бд авторизованного юзера
                const userId = auth.currentUser.uid; // получение авторизованного юзера
             
                const taskRef = ref(db, `tasks/${userId}/${id}`); // получение ссылки на удаление таски
                await remove(taskRef); // удаления таски из базы данных
       
            } catch (error) {
                console.error("Error deleting task: ", error);
            }
        }
    }
    
}


const kanbanStore = new KanbanStore();

export default kanbanStore;

