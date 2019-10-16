nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'judge.es2019@gmail.com',
           pass: 'jes20192'
       }
   });

const welcome = (email, nick) =>{
    return {
            template: 'hello',
            message: {
                from: 'Judge UFCG <judge.es2019@gmail.com>',
                to: email,
            },
            locals: {
            nick:nick,
            },
    }
}

const forgetPass = (email, nick, n_pass) => {
    return {
        template: 'forget',
        message: {
            from: 'Judge UFCG <judge.es2019@gmail.com>',
            to: email,
        },
        locals: {
            nick:nick,
            n_pass: n_pass,
        },
    }
}

module.exports = {transporter, welcome, forgetPass}