Para Probar el Login puede usar los siguientes Datos y obtener el Token
{ "email": "edu.o@gmail.com", "password":"123456" }

findUsers: Usa deleted, name, loginBefore, loginAfter como parametros para Queryparams

bulkCreate: Usa esta estructura de parametros y se puede probar a validar 
{
        "name": "Uno",
        "email": "uno@gmail.com",
        "password": "123456",
        "password_second": "123456",
        "cellphone": 982323833
},

# API for Authentication

- This is a readme with all routes

## Auth Routes

### POST ```/api/v1/auth/login```

- method must include a user and password
- method return a BASE64 token with this information:
- ```{ "name": ..., "email": ..., "roles": ..., "expiration":... }```