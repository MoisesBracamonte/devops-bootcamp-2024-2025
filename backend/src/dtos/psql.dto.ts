export class PsqlDto{
    constructor(
        public severity:string,
        public table:string,
        public code:string,
        public detail:string,
        public constraint:string
    ){}

    static error(object:{[key:string]:any}):PsqlDto{
        let _detail='';
        if(object.code === '23505'){
            _detail='The email already exists'
        }
        const _i = new PsqlDto(object.severity, object.table, object.code, _detail, object.constraint);
        return _i;
    }
}