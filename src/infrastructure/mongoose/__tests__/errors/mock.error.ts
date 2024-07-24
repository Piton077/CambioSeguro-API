export class MongooseErrorMock extends Error {
    constructor(public code: string) {
        super(MongooseErrorMock.name)
    }

}