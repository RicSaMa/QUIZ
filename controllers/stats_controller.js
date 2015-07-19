var models = require('../models/models.js');

exports.load = function(req, res){

    models.Quiz.findAll({
        include: [{model: models.Comment}]
    }).then(function (quizes) {
        var stats = {"numeroPreguntas": quizes.length};

        var comentarios = quizes.reduce(function(obj, quiz) {
            obj["total"] = (obj["total"]||0)+quiz.Comments.length;
            if (quiz.Comments.length > 0){
                obj["con"] = (obj["con"]||0)+1;
                return obj;
            } else {
                obj["sin"] = (obj["sin"]||0)+1;
                return obj;
            }
        }, {});

        stats["comentariosTotales"] = comentarios["total"];
        stats["comentariosMedios"] = comentarios["total"]/quizes.length;
        stats["preguntasConComentarios"] = comentarios["con"];
        stats["preguntasSinComentarios"] = comentarios["sin"];

        res.render('quizes/statistics.ejs', {stats: stats, errors: []});
    }).catch(function (error) {
        //next(error)
    })
};