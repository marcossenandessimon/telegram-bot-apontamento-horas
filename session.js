var redis = require('redis');
var q = require('q');

client = redis.createClient();
client.on("error", function (err) {
  console.log("Error " + err);
})

function createUser(id) {  
  client.hset(id, "id", id, redis.print);
}

function setToken(id,token){
  client.hset(id, ["token", token], redis.print);
}

function getToken(id){
  var deferred = q.defer();
  client.hget(id, "token", function (err, reply) {
    if(err){
      return deferred.reject(err);
    }
    deferred.resolve(reply)
  })
  return deferred.promise
}

function setComando(id, comando){
  var deferred = q.defer();
  client.hset(id, "comando", comando, function(err, reply){
    if(err){
      return deferred.reject(err);
    }    
    deferred.resolve(reply)
  })
  return deferred.promise;
}

function setDia(id, data){
  var deferred = q.defer();
  client.hset(id, "data", data, function (err, reply) {
    if(err){
      return deferred.reject(err);
    }
    deferred.resolve(reply)    
  })
  return deferred.promise;
}

function getDia(id) {
  var deferred = q.defer();
  client.hget(id, "data", function (err, reply) {
    if(err){
      return deferred.reject(err);      
    }
    deferred.resolve(reply)
  })
  return deferred.promise;
}

function getComando(id){
  var deferred = q.defer();
  client.hget(id, "comando", function(err,reply){
    if(err){
      return deferred.reject(err);
    }
    deferred.resolve(reply)
  })
  return deferred.promise;
}

function setEntrada(id, entrada){
  var deferred = q.defer();
  client.hset(id, "horaEntrada", entrada, function(err, reply){
    if(err){
      return deferred.reject(err);
    }
    deferred.resolve(reply)
  })
  return deferred.promise;
}

function getEntrada(id){
  var deferred = q.defer();
  client.hget(id, "horaEntrada", function(err, reply){
    if(err){
      return deferred.reject(err);
    }
    deferred.resolve(reply)
  })
  return deferred.promise;
}

function setSaida(id, saida){
  var deferred = q.defer();
  client.hset(id, "horaSaida", saida, function(err, reply){
    if(err){
      return deferred.reject(err);
    }
    deferred.resolve(reply)
  })
  return deferred.promise;
}

function getSaida(id){
  var deferred = q.defer();
  client.hget(id, "horaSaida", function(err, reply){
    if(err){
      return deferred.reject(err);
    }
    deferred.resolve(reply)
  })
  return deferred.promise;
}

function setPendencia(id, pendencia){
  var deferred = q.defer();
  client.hset(id, "pendencia", pendencia, function(err, reply){
    if(err){
      return deferred.reject(err);
    }
    deferred.resolve(reply)
  })
  return deferred.promise;
}

function getPendencia(id){
  var deferred = q.defer();
  client.hget(id, "pendencia", function(err, reply){
    if(err){
      return deferred.reject(err);
    }
    deferred.resolve(reply)
  })
  return deferred.promise;
}

function setClassificacaoHoras(id, classificacaoHoras){
  var deferred = q.defer();
  client.hset(id, "classificacaoHoras", classificacaoHoras, function(err, reply){
    if(err){
      return deferred.reject(err);
    }
    deferred.resolve(reply)
  })
  return deferred.promise;
}

function getClassificacaoHoras(id){
  var deferred = q.defer();
  client.hget(id, "classificacaoHoras", function(err, reply){
    if(err){
      return deferred.reject(err);
    }
    deferred.resolve(reply)
  })
  return deferred.promise;
}

function setTipoAtividade(id, tipoAtividade){
  var deferred = q.defer();
  client.hset(id, "tipoAtividade", tipoAtividade, function(err, reply){
    if(err){
      return deferred.reject(err);
    }
    deferred.resolve(reply)
  })
  return deferred.promise;
}

function getTipoAtividade(id){
  var deferred = q.defer();
  client.hget(id, "tipoAtividade", function(err, reply){
    if(err){
      return deferred.reject(err);
    }
    deferred.resolve(reply)
  })
  return deferred.promise;
}

function setAtividadeAlocada(id, atividadeAlocada){
  var deferred = q.defer();
  client.hset(id, "atividadeAlocada", atividadeAlocada, function(err, reply){
    if(err){
      return deferred.reject(err);
    }
    deferred.resolve(reply)
  })
  return deferred.promise;
}

function getAtividadeAlocada(id){
  var deferred = q.defer();
  client.hget(id, "atividadeAlocada", function(err, reply){
    if(err){
      return deferred.reject(err);
    }
    deferred.resolve(reply)
  })
  return deferred.promise;
}

function setProjeto(id, projeto){
  var deferred = q.defer();
  client.hset(id, "projeto", projeto, function(err, reply){
    if(err){
      return deferred.reject(err);
    }
    deferred.resolve(reply)
  })
  return deferred.promise;
}

function getProjeto(id){
  var deferred = q.defer();
  client.hget(id, "projeto", function(err, reply){
    if(err){
      return deferred.reject(err);
    }
    deferred.resolve(reply)
  })
  return deferred.promise;
}

function setSubSistema(id, subSistema){
  var deferred = q.defer();
  client.hset(id, "subSistema", subSistema, function(err, reply){
    if(err){
      return deferred.reject(err);
    }
    deferred.resolve(reply)
  })
  return deferred.promise;
}

function getSubSistema(id){
  var deferred = q.defer();
  client.hget(id, "subSistema", function(err, reply){
    if(err){
      return deferred.reject(err);
    }
    deferred.resolve(reply)
  })
  return deferred.promise;
}

function setTipoApontamento(id, tipoApontamento){
  var deferred = q.defer();
  client.hset(id, "tipoApontamento", tipoApontamento, function(err, reply){
    if(err){
      return deferred.reject(err);
    }
    deferred.resolve(reply)
  })
  return deferred.promise;
}

function getTipoApontamento(id){
  var deferred = q.defer();
  client.hget(id, "tipoApontamento", function(err, reply){
    if(err){
      console.log(err);
      return deferred.reject(err);
    }
    deferred.resolve(reply)
  })
  return deferred.promise;
}

function adicionarProjeto(id, projeto){
  var deferred = q.defer();
  client.sadd(id + 'Projetos', projeto, function (err,reply) {
    if(err){
      deferred.reject(err);
    }
    deferred.resolve(reply);
  })
  return deferred.promise;
}

function getProjetos(id){

  var deferred = q.defer();
  var projetos = [];
  client.smembers(id + 'Projetos',function (err,reply) {
    if(err){
      return deferred.reject(err);
    }    
    reply.forEach(function (value) {
      projetos.push(new Array(value))
    })
    deferred.resolve(projetos);
  })
  return deferred.promise;  
}

function adicionarSubsistema(id, projeto, subsistema) {
  var deferred = q.defer();
  client.sadd(id + projeto + "Subsistema", subsistema, function (err,reply) {
    if(err){
      deferred.reject(err);
    }
    deferred.resolve(reply);  
  })
  return deferred.promise;
}

function getSubsistemas(id, projeto){
  var deferred = q.defer();
  var subsistemas = [];
  client.smembers(id + projeto + "Subsistema", function (err,reply) {
    if(err){
      deferred.reject(err);
    }
    reply.forEach(function (value) {
      subsistemas.push(new Array(value));
    })
    deferred.resolve(subsistemas);
  })
  return deferred.promise;
}

function adicionarAtividadesAlocadas(id, subsistema, atividade){
  var deferred = q.defer();
  client.sadd(id + subsistema + "Atividade", atividade, function(err, reply){
    if(err){
      deferred.reject(err);
    }
    deferred.resolve(reply);
  })
  return deferred.promise;
}

function getAtividadesAlocadas(id, subsistema){
  var deferred = q.defer();
  var atividades = [];
  client.smembers(id + subsistema + "Atividade", function(err, reply){
    if(err){
      deferred.reject(err);
    }
    reply.forEach(function (value){
      atividades.push(new Array(value));
    })
    deferred.resolve(atividades);
  })
  return deferred.promise;
}

function testeRemocao(id){    
  client.flushall();
  client.flushdb();
}

module.exports.createUser = createUser;
module.exports.setComando = setComando;
module.exports.getComando = getComando;
module.exports.getToken = getToken;
module.exports.setToken = setToken;
module.exports.setEntrada = setEntrada;
module.exports.getEntrada = getEntrada;
module.exports.setSaida = setSaida;
module.exports.getSaida = getSaida;
module.exports.setPendencia = setPendencia;
module.exports.getPendencia = getPendencia;
module.exports.setClassificacaoHoras = setClassificacaoHoras;
module.exports.getClassificacaoHoras = getClassificacaoHoras;
module.exports.setTipoAtividade = setTipoAtividade;
module.exports.getTipoAtividade = getTipoAtividade;
module.exports.setAtividadeAlocada = setAtividadeAlocada;
module.exports.getAtividadeAlocada = getAtividadeAlocada;
module.exports.setProjeto = setProjeto;
module.exports.getProjeto = getProjeto;
module.exports.setSubSistema = setSubSistema;
module.exports.getSubSistema = getSubSistema;
module.exports.setTipoApontamento = setTipoApontamento;
module.exports.getTipoApontamento = getTipoApontamento;
module.exports.adicionarProjeto = adicionarProjeto;
module.exports.getProjetos = getProjetos;
module.exports.adicionarAtividadesAlocadas = adicionarAtividadesAlocadas;
module.exports.getAtividadesAlocadas = getAtividadesAlocadas;
module.exports.getSubsistemas = getSubsistemas;
module.exports.adicionarSubsistema = adicionarSubsistema;
module.exports.setDia = setDia
module.exports.getDia = getDia
module.exports.testeRemocao = testeRemocao;

/**
 * LISTA DE METODOS
 * apontarEntrada
 * apontarSaida
 * definirPendencia
 * definirClassificacaoHoras
 * definirTipoAtividade
 * definirAtividadeAlocada
 * definirCodigoProjeto
 * definirSubsistema
 * definirData 
 * apontar
 * adicionarProjeto
 * adicionarData
 */