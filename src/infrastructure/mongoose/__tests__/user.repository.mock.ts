import { MongooseErrorMock } from "./errors/mock.error"


export class MongooseUserRepositoryMock {

    static users: { email: string, password: string, id: string }[] = []

    public email: string
    public password: string
    public id: string

    constructor(info?: { email: string, password: string }) {
        if (info) {
            this.email = info.email
            this.password = info.password
        }
    }
    async save() {
        const entity = await MongooseUserRepositoryMock.findOne({ email: this.email }).exec()
        if (entity) {
            throw new MongooseErrorMock('11000')
        }
        return Promise.resolve({
            email: this.email,
            password: this.password,
            id: 'auto-generado'
        })
    }


    static findOne({ email }: { email: string }) {

        return {
            exec: () => {
                return Promise.resolve(this.users.find(u => u.email == email))
            }
        }
    }
    static clearUsers() {
        this.users = []
    }
    static setUsers(users: { email: string, password: string, id: string }[]) {
        this.users = users
    }


}
export const mongooseUserRepositoryMock = new MongooseUserRepositoryMock()
