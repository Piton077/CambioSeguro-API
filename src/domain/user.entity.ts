
export class UserEntity {
    private _id: string
    constructor(
        private _username: string,
        private _password: string,
    ) { }

    set id(id: string) {
        this._id = id
    }

    get username() {
        return this._username
    }

    get password() {
        return this._password
    }



}