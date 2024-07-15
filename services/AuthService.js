import db from '../dist/db/models/index.js';
import bcrypt from 'bcrypt';

const login = async (email, password) => {
    const response = await db.User.findOne({
        where: {
            email: email
        }
    });
    //Para Probar el Login puede usar los siguientes Datos
    //edu.o@gmail.com
    //123456
    //Y si tiene inconsistencias con el bcrypt 
    //Se le recomienda registrar un nuevo usuario por el hash de la contraseña

    //console.log('User query response:', response); // Log the response from the database query

    if (!response) {
        console.log('User not found');
        return {
            code: 401,
            message: 'Unauthorized'
        };
    }/* 

    console.log('Stored password:', response.password); // Log the stored password
    console.log('Input password:', password); // Log the input password

    const isMatch = bcrypt.compareSync(password, response.password);
    console.log('Password match:', isMatch); // Log the result of the hash comparison

    if (!isMatch) {
        console.log('Password mismatch');
        return {
            code: 401,
            message: 'Unauthorized'
        };
    } */

    const expiration = (new Date()).setHours((new Date()).getHours() + 1);

    const token = Buffer.from(JSON.stringify({
        name: response.name,
        email: response.email,
        id: response.id,
        roles: ['user'],
        expiration: expiration,
    })).toString('base64');

    const session = {
        id_user: response.id,
        token: token,
        expiration: expiration,
    };

    await db.Session.create(session);

    return {
        code: 200,
        message: token
    };
};

const logout = async (token) => {
    const session = await db.Session.findOne({
        where: {
            token: token
        }
    });
    session.expiration = new Date();
    session.save();
    return {
        code: 200,
        message: 'Logged out'
    };
}

export default {
    login,
    logout,
}