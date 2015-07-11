var models = require('../models/models.js');

/*exports.question = function (req, res){
    //res.render('quizes/question',{pregunta: 'Capital de Italia'});
    models.Quiz.findAll().success(function (quiz){
        res.render('quizes/question',{pregunta: quiz[0].pregunta});
    })
};*/

exports.load = function (req, res, next, quizId){
    models.Quiz.find(quizId).then(
        function(quiz){
            if (quiz) {
                req.quiz = quiz;
                next();
            } else {
                next(new Error('No existe quizId=' + quizId));
            }
        }
    ).catch(function(error){next(error);});
};

exports.index = function(req, res){
    if(req.query.search){
        var texto = req.query.search;
        texto = texto.replace(new RegExp(" ", 'g'), "%");
        texto = "%"+texto+"%";
        models.Quiz.findAll({where:["pregunta like ?",texto],order:[['pregunta','DESC']]}).then(function (quizes) {
            res.render('quizes/index.ejs', {quizes: quizes, errors: []});
        }).catch(function (error) {
            res.render('quizes/index.ejs', {quizes: [], errors: []});
        })
    }else{
        models.Quiz.findAll().then(function (quizes) {
            res.render('quizes/index.ejs', {quizes: quizes, errors: []});
        }).catch(function (error) {
            //next(error)
        })
    }
};

exports.show = function (req, res){
    res.render('quizes/show',{quiz: req.quiz, errors: []});
    //models.Quiz.find(req.params.quizId).then(function (quiz){
    //    res.render('quizes/show',{ quiz: quiz});
    //})
};

exports.answer = function (req, res){
    var resultado = 'Incorrecto';
    if(req.query.respuesta === req.quiz.respuesta){
        resultado = 'Correcto';
    }
    res.render('quizes/answer',{quiz: req.quiz, respuesta: resultado, errors: []});
};

exports.author = function (req, res) {
    res.render('author', {errors: []});
};

exports.new = function (req, res){
    var quiz = models.Quiz.build(
        {pregunta:"Pregunta", respuesta:"Respuesta"}
    );
    res.render('quizes/new',{quiz:quiz, errors: []});
};

exports.create = function (req, res){
    var quiz = models.Quiz.build(req.body.quiz);

    quiz.validate().then(
        function (err){
            if (err){
                res.render('quizes/new',{quiz:quiz,errors: err.errors});
            } else {
                quiz.save({fields: ["pregunta","respuesta"]}).then(function(){
                    res.redirect('/quizes');
                })
            }
        }
    );
};