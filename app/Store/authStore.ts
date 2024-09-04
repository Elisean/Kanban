import { action, makeAutoObservable, observable } from "mobx";


class AuthStore {

   @observable ISAUTH:boolean = false;

    constructor(){
        makeAutoObservable(this);
    }

   @action isAuth(auth:boolean){
        this.ISAUTH = auth;
   }

}


const authStore = new AuthStore();

export default authStore;