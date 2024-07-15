Para Probar el Login puede usar los siguientes Datos y obtener el Token
{ "email": "edu.o@gmail.com", "password":"123456" }

Puertos que se Ocupan:
http://localhost:3001/api/v1/auth/login
http://localhost:3001/api/v1/auth/register
http://localhost:3001/api/v1/users/bulkCreate
http://localhost:3001/api/v1/users/getAllUsers
http://localhost:3001/api/v1/users/findUsers?name=jean

findUsers: Usa deleted, name, loginBefore, loginAfter como parametros para Queryparams
bulkCreate: Usa esta estructura de parametros y se puede probar a validar 

Para crear un token se pueden utilizar las siguientes credenciales:
{
"email": "alexos.88@gmail.com",
"password":"aom"
}

Para el findUsers se deben utilizar los siguientes parametros:
name
deleted
loggedInBefore (Para consultar fechas anteriores)
loggedInAfter (Para consultar fechas posteriores)

Para bulkCreate se deben ingresar los siguientes parametros:
name
email
password
password_second
cellphone
{
        "name": "Uno",
        "email": "uno@gmail.com",
        "password": "123456",
        "password_second": "123456",
        "cellphone": 982323833
    },

Ejemplo de validación en BulkCreate:
{
    "a": 1,
    "failureCount": 1,
    "errors": [
        {
            "email": "ganotheruser@gmail.com",
            "error": "All fields (name, email, password, password_second, cellphone) are required"
        }
    ]
}