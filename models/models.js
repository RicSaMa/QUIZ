var path = require('path');

//cargar modelo orm
var Sequelize = require('sequelize');

//usar BBDD SQLite
var sequelize = new Sequelize(null, null, null,
                                {dialect: "sqlite", storage: "quiz.sqlite"});

var Quiz = sequelize.import(path.join(__dirname,'quiz'));

exports.Quiz = Quiz;

sequelize.sync().success(function (){
    Quiz.count().success(function(count){
        if(count === 0) {
            Quiz.create({pregunta:'Capital de Italia',respuesta:'Roma'})
                .success(function(){console.log('Base de datos inicializada')});
        };
    });
});