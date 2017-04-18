var http = require('http');
var Q = require('q');
var session = require('./session');

function envio(objeto){
    
}

function enviarHoras(id) {
    
    var promise = Q.defer();
    var objeto;

    session.getTipoApontamento(id).then( function (reply) {        
        if( reply === "porPendencia"){
            criaObjetoPendencia(id).then(function (replyObjeto) {
                session.getToken(id).then(function (replyToken) {
                    function callback(res){
                        var str = '';
                        res.on('data', function (chunk) {
                            str += chunk;
                        });
                        res.on('end', function () {
                            console.log(res.statusCode)        
                            jsonResponse = JSON.parse(str);                                                        
                            if( res.statusCode === 200 ){                                
                                promise.resolve({code: res.statusCode, message: ''});                                                                                
                            }else if (res.statusCode === 401){
                                promise.resolve({code: res.statusCode, message: ''});
                            }else if (res.statusCode === 400){
                                console.log(str);
                                promise.resolve({code: res.statusCode, message: jsonResponse.error.description});
                            }else if (res.statusCode === 500){
                                console.log(str);
                            }                            
                        })
                    }
                    var req = http.request({
                        host: '<<HOST>>',
                        port: 8190,
                        path: '/api/v1/apontamentos',
                        method: 'POST',
                        headers: {                                    
                            'Content-Type': 'application/json',
                            'Google-Token': replyToken                               
                        }
                    }, callback);
                    console.log(JSON.parse(replyObjeto));
                    req.write(replyObjeto);
                    req.end();                                        
                })
            })
        }else if (reply === "porProjeto"){
            criaObjetoProjeto(id).then(function (replyObjeto) {
                session.getToken(id).then(function (replyToken) {
                    function callback(res){
                        var str = '';
                        res.on('data', function (chunk) {
                            str += chunk;
                        });
                        res.on('end', function () {
                            console.log(str)        
                            jsonResponse = JSON.parse(str);                                                        
                            if( res.statusCode === 200 ){
                                promise.resolve({code: res.statusCode, message: ''});                                                
                            }else if (res.statusCode === 401){
                                promise.resolve({code: res.statusCode, message: ''});
                            }else if (res.statusCode === 400){                                
                                promise.resolve({code: res.statusCode, message: jsonResponse.error.description});
                            }                                       
                        })
                    }
                    var req = http.request({
                        host: '<<HOST>>',
                        port: 8190,
                        path: '/api/v1/apontamentos',
                        method: 'POST',
                        headers: {                                    
                            'Content-Type': 'application/json',
                            'Google-Token': replyToken                               
                        }
                    }, callback);
                    console.log(JSON.parse(replyObjeto));
                    req.write(replyObjeto);
                    req.end();  
                })
            })
        }                    
    })
    return promise.promise;
}

function objetoGeral(id){
    var deferred = Q.defer();
    var classificacaoHoras;
    var tipoAtividade;
    var resposta;
    session.getClassificacaoHoras(id).then(function (reply) {
        classificacaoHoras = reply;
        session.getTipoAtividade(id).then(function (replyTipo) {
            tipoAtividade = replyTipo;
            var resposta = '"codigoClassificacaoHoras": "' + classificacaoHoras + '", "codigoTipoAtividade": "' + tipoAtividade + '"'
            deferred.resolve(resposta);
        })
    })
    return deferred.promise;
}

function criaObjetoPendencia(id){
    var deferred = Q.defer();
    var horaEntrada;
    var horaSaida;
    var pendencia;
    var objeto;
    objetoGeral(id).then(function (reply) {
        session.getEntrada(id).then(function (replyEntrada) {
            horaEntrada = replyEntrada;
            session.getSaida(id).then(function (replySaida) {
                horaSaida = replySaida;
                session.getPendencia(id).then(function (replyPendencia) {
                    pendencia = replyPendencia;
                    objeto = '{ "dataHoraInicio" : "' + horaEntrada + '", "dataHoraFim" : "' + horaSaida + '", "pendenciaId" : "' + pendencia + '", ' + reply + ' }'
                    deferred.resolve(objeto);
                })
            })
        })
    })
    return deferred.promise;
}

function criaObjetoProjeto(id){
    var deferred = Q.defer();
    var horaEntrada;
    var horaSaida;
    var atividadeAlocada;
    var projeto;
    var subsistema;

    objetoGeral(id).then(function (reply) {
        session.getEntrada(id).then(function (replyEntrada) {
            horaEntrada = replyEntrada;
            session.getSaida(id).then(function (replySaida) {
                horaSaida = replySaida;
                session.getProjeto(id).then(function (replyProjeto) {
                    projeto = replyProjeto;
                    session.getSubSistema(id).then(function (replySubsistema) {
                        subsistema = replySubsistema;
                        session.getAtividadeAlocada(id).then(function (replyAtividade) {
                            atividadeAlocada = replyAtividade;
                            objeto = '{ "dataHoraInicio" : "' + horaEntrada + '", "dataHoraFim" : "' + horaSaida + '", "atividadeAlocada" : "' + atividadeAlocada + '", "codigoProjeto" : "' + projeto +  '", "codigoSubsistema" : "' + subsistema + '", ' + reply + ' }'
                            deferred.resolve(objeto);
                        })
                    })
                })
            })
        })
    })
    return deferred.promise;
}



module.exports.enviarHoras = enviarHoras;