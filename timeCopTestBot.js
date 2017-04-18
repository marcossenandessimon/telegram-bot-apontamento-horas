var TelegramBot = require('node-telegram-bot-api');
var Apontamento = require('./apontamento');
var session = require('./session');
var optsClassificacaoHoras = {
    reply_markup:JSON.stringify(
        {
            keyboard: [['FH','FS','PL','PT'],['VI','NO','VS']],
            one_time_keyboard: true
        }
    )};

var opts = {
  reply_markup: JSON.stringify(
    {
      force_reply: true
    }
  )};
var optsTipoData = {
    reply_markup: JSON.stringify(
        {
            keyboard: [['Hoje'],['Outra data']],
            one_time_keyboard: true
        }
    )
}
var optsHide = {
  reply_markup: JSON.stringify(
    {
      hide_keyboard: true
    }
  )};  

var token = '<<TOKEN>>';
// Setup polling way
var bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, function (msg) {
    session.createUser(msg.from.id);
    session.setComando(msg.from.id, "comandoZero");
})

bot.onText(/\/pegaToken/, function(msg){
    session.getToken(msg.from.id);
})


//função para enviar token junto com o comando.
bot.onText(/\/token (.+)/, function (msg) {
    var token = msg.text.slice(6).trim();
    console.log(token);
    session.setToken(msg.from.id, token)
    bot.sendMessage(msg.chat.id, 'Token cadastrado com sucesso!');    
})

// Função para enviar o token do google.
bot.onText(/\/token$/, function(msg){
    bot.sendMessage(msg.chat.id, 'Insira o token.', opts)
        .then(function(sendedToken){
            var messageId = sendedToken.message_id;
            var chatId = sendedToken.chat.id;
            bot.onReplyToMessage(chatId, messageId, function (messageToken) {
                session.setToken(msg.from.id, messageToken.text);
                bot.sendMessage(msg.chat.id, 'Token cadastrado com sucesso!');
            });
        });
});

bot.onText(/^(?!cancelar$|\/.*).*/, function (msg) {

    session.getComando(msg.from.id).then(function (replyComando) {
        console.log("teste: " + replyComando);
        if(replyComando === "definirCodigoProjeto"){
            if(msg.text === "+ Adicionar Projeto"){
                session.setComando(msg.from.id, "adicionarProjeto").then(function (replyComando) {
                    bot.sendMessage(msg.chat.id, "Digite o projeto a ser adicionado ou digite /cancelar para cancelar.");
                })
            }else{
                session.setComando(msg.from.id, "definirSubsistema").then(function (replyComando) {
                    session.setProjeto(msg.from.id, msg.text).then(function (reply) {
                        var subsistemas = session.getSubsistemas(msg.from.id, msg.text).then(function (replySubsistemas) {
                            replySubsistemas.push(new Array ("+ Adicionar subsistema"));
                            var optSubsistemas = {
                                reply_markup:JSON.stringify(
                                    {
                                        keyboard: replySubsistemas,
                                        one_time_keyboard: true
                                    })
                            }
                            bot.sendMessage(msg.chat.id, "Selecione o subsistema.", optSubsistemas);   
                        })                          
                    })                    
                })
            }
        }else if(replyComando === "adicionarProjeto"){
            if(msg.text !== "/cancelar"){
                session.adicionarProjeto(msg.from.id, msg.text).then(function (replyAdicionar) {
                    session.setComando(msg.from.id, "definirSubsistema").then(function (replyComando) {
                        var subsistemas = session.getSubsistemas(msg.from.id, msg.text).then(function (replySubsistemas) {
                            replySubsistemas.push(new Array ("+ Adicionar subsistema"));
                            var optSubsistemas = {
                                reply_markup:JSON.stringify(
                                    {
                                        keyboard: replySubsistemas,
                                        one_time_keyboard: true
                                    })
                            }   
                        })
                        session.setProjeto(msg.from.id, msg.text).then( function (replyAdicionado) {
                            bot.sendMessage(msg.chat.id, "Selecione o subsistema.", optSubsistemas)
                        })
                    })
                })
            }else{
                var projetos = session.getProjetos(msg.from.id).then(function (replyProjetos) {
                    replyProjetos.push(new Array(" + Adicionar Projeto"));
                    var optProjetos = {
                    reply_markup:JSON.stringify(
                        {
                            keyboard: replyProjetos,
                            one_time_keyboard: true
                        }
                    )};
                    session.setComando(msg.from.id, "definirCodigoProjeto").then(function (replyComando) {
                        bot.sendMessage(msg.chat.id, "Selecione o projeto", optProjetos )
                    })
                })
            }
        }else if(replyComando === "definirSubsistema"){
            if(msg.text === "+ Adicionar subsistema"){
                session.setComando(msg.from.id, "adicionarSubsistema").then(function (replyComando){
                    bot.sendMessage(msg.chat.id, "Digite o subsistema a ser adicionado ou digite /cancelar para cancelar.");
                })
            }else{
                session.setComando(msg.from.id, "definirAtividadeAlocada").then(function (replyComando) {
                    session.setSubSistema(msg.from.id, msg.text).then(function (reply) {
                        var atividadesAlocadas = session.getAtividadesAlocadas(msg.from.id, msg.text).then(function (replyAtividades) {
                            replyAtividades.push(new Array ("+ Adicionar atividade alocada"));
                            var optAtividades = {
                                reply_markup:JSON.stringify(
                                    {
                                        keyboard: replyAtividades,
                                        one_time_keyboard: true
                                    })
                            }
                            bot.sendMessage(msg.chat.id, "Selecione a atividade Alocada.", optAtividades);
                        })
                    })
                })
            }
        }else if(replyComando === "adicionarSubsistema"){
            if(msg.text !== "/cancelar"){
                var projetoSelecionado;
                session.getProjeto(msg.from.id).then(function (replyProjeto) {
                    projetoSelecionado = replyProjeto;
                    session.adicionarSubsistema(msg.from.id, projetoSelecionado, msg.text).then(function (replyAdicionar) {
                        session.setComando(msg.from.id, "definirAtividadeAlocada").then(function (replyComando) {
                            var atividades = session.getAtividadesAlocadas(msg.from.id, msg.text).then(function (replyAtividades) {
                                replyAtividades.push(new Array ("+ Adicionar atividade alocada"));
                                var optAtividades = {
                                    reply_markup:JSON.stringify(
                                        {
                                            keyboard: replyAtividades,
                                            one_time_keyboard: true
                                        })
                                }
                                session.setSubSistema(msg.from.id, msg.text).then( function (replyAdicionado) {
                                    bot.sendMessage(msg.chat.id, "Selecione a atividade alocada.", optAtividades)
                                })   
                            })
                        })
                    })
                })
                
            }else{                
                session.getProjeto(msg.from.id).then( function (replyProjeto) {                    
                    var subsistemas = session.getSubsistemas(msg.from.id, replyProjeto).then(function (replySubsistemas) {
                        replySubsistemas.push(new Array(" + Adicionar Subsistema"));
                        var optSubsistemas = {
                            reply_markup:JSON.stringify(
                                {
                                    keyboard: replySubsistemas,
                                    one_time_keyboard: true
                                }
                            )};
                        session.setComando(msg.from.id, "definirSubsistema").then(function (replyComando) {
                            bot.sendMessage(msg.chat.id, "Selecione o subsistema.", optSubsistemas )
                        })
                    })  
                })                
            }
        
        }else if(replyComando === "definirAtividadeAlocada"){
            if(msg.text === "+ Adicionar atividade alocada"){                
                session.setComando(msg.from.id, "adicionarAtividadeAlocada").then(function (replyComando) {
                    bot.sendMessage(msg.chat.id, "Digite a atividade a ser adicionada ou digite /cancelar para cancelar.");
                })                
            }else{
                session.setComando(msg.from.id, "definirClassificacaoHoras").then( function (replyComando) {
                    session.setAtividadeAlocada(msg.from.id, msg.text).then( function (replyAtividades) {
                        bot.sendMessage(msg.chat.id, "Qual a classificação das horas?", optsClassificacaoHoras);
                    })
                })
            }
        }else if(replyComando === "adicionarAtividadeAlocada"){
            if(msg.text !== "/cancelar"){
                var subsistemaSelecionado;
                session.getSubSistema(msg.from.id).then(function (replySubsistema) {
                    subsistemaSelecionado = replySubsistema;
                    session.adicionarAtividadesAlocadas(msg.from.id, subsistemaSelecionado, msg.text).then( function (replyAdicionar) {
                        session.setComando(msg.from.id, "definirClassificacaoHoras").then( function (replyComando) {
                            session.setAtividadeAlocada(msg.from.id, msg.text).then( function (replyAdicionado) {
                                bot.sendMessage(msg.chat.id, "Qual a classificação das horas?", optsClassificacaoHoras);
                            })
                        })
                    })
                })
            }else{
                session.getSubSistema(msg.from.id).then( function (replySubsistema) {
                    var atividades = session.getAtividadesAlocadas(msg.from.id, replySubsistema).then( function (replyAtividades) {
                        replyAtividades.push(new Array("+ Adicionar atividade alocada"));
                        var optAtividades = {
                            reply_markup:JSON.stringify(
                                {
                                    keyboard: replyAtividades,
                                    one_time_keyboard: true
                                }
                            )
                        }
                        session.setComando(msg.from.id, "definirAtividadeAlocada").then(function (replyComando) {
                            bot.sendMessage(msg.chat.id, "Selecione a atividade Alocada.", optAtividades)
                        })
                    })                    
                })
            }
        }

    })
})

bot.onText(/(^cancelar$|^Cancelar$)/, function (msg) {
    session.getComando(msg.from.id).then(function (replyGetComando) {        
        session.setComando(msg.from.id, "comandoZero").then( function (replyComando) {
            bot.sendMessage(msg.chat.id, "Ok, cancelando, caso queira recomeçar é só digitar /apontar ;) ", optsHide)
        })
    })
})

/*
 * reset do banco.
bot.onText(/\/testar/, function (msg) {    
    session.testeRemocao(msg.from.id);
       
})
*/

//Recebe um Horário no formato HH:MM ou H:MM e verifica se é entrada ou saída
bot.onText(/^[0-2]?[0-9]:[0-5][0-9]$/, function (msg) {
    session.getComando(msg.from.id).then(function (reply) {
        if(reply === "apontarEntrada"){
            session.getDia(msg.from.id).then(function (replyDia) {
                session.setEntrada(msg.from.id, replyDia + 'T' + msg.text).then(function (replyEntrada) {
                  session.setComando(msg.from.id, "apontarSaida").then(function (replyComando) {
                        bot.sendMessage(msg.chat.id, "Qual a hora de saída?")
                    })
                })    
            })
            
        }else if(reply === "apontarSaida"){
            session.getDia(msg.from.id).then(function (replyDia) {
                session.setSaida(msg.from.id, replyDia + 'T' + msg.text).then(function (replySaida) {
                    session.getTipoApontamento(msg.from.id).then(function (replyTipoApontamento) {
                        if(replyTipoApontamento === "porPendencia"){
                            session.setComando(msg.from.id, "definirPendencia").then(function (replyPendencia) {
                                bot.sendMessage(msg.chat.id, "Qual a pendência?")
                            })
                        }else if (replyTipoApontamento === "porProjeto"){
                            console.log("a")
                            var projetos = session.getProjetos(msg.from.id).then(function (replyProjetos) {
                                replyProjetos.push(new Array(" + Adicionar Projeto"));
                                var optProjetos = {
                                reply_markup:JSON.stringify(
                                    {
                                        keyboard: replyProjetos,
                                        one_time_keyboard: true
                                    }
                                )};
                                session.setComando(msg.from.id, "definirCodigoProjeto").then(function (replyComando) {
                                    bot.sendMessage(msg.chat.id, "Selecione o projeto?", optProjetos )
                                })                            
                            })                                                
                        }
                    })
                })  
            })
            
        }
    })
})

bot.onText(/\/link/, function (msg) {
    bot.sendMessage(msg.chat.id, "o link para adquirir o token é <<LINK>>");
})

// Recebe uma pendencia com 6 ou 7 digitos
bot.onText(/\d\d\d\d\d\d?\d/, function(msg){
    
        

    session.getComando(msg.from.id).then(function (replyComando) {
        if(replyComando === "definirPendencia"){
            session.setPendencia(msg.from.id, msg.text).then(function (replyPendencia) {
                session.setComando(msg.from.id, "definirClassificacaoHoras").then(function (replyClassificacao) {
                    bot.sendMessage(msg.chat.id, "Qual a classificação das horas?",optsClassificacaoHoras)
                })
            })
        }
    })
})

// Recebe a classificação das Horas
bot.onText(/FH|FS|NO|PL|PT|VI|VS/, function(msg){
    var optsTipoAtividade = {
        reply_markup:JSON.stringify(
            {
                keyboard: [['AD','PR','FJ'],['CODIF','TESTE']],
                one_time_keyboard: true
            }
        )};
    session.getComando(msg.from.id).then(function (replyComando) {
        if(replyComando === "definirClassificacaoHoras"){
            session.setClassificacaoHoras(msg.from.id, msg.text).then(function (replyClassificacao) {
                session.setComando(msg.from.id, "definirTipoAtividade").then(function (replyTipoAtividade) {
                    bot.sendMessage(msg.chat.id, "Qual o tipo da atividade?", optsTipoAtividade)
                })
            })
        }
    })   
})

bot.onText(/\/repetir/, function(msg){
    console.log(msg.from.first_name + " " + msg.from.last_name);
    session.setComando(msg.from.id, "comandoZero").then(function (replyComando) {
        bot.sendMessage(msg.chat.id, "Reenviando horas");
        Apontamento.enviarHoras(msg.from.id).then(function (replyEnvio) {
            if(replyEnvio.code === 200){
                bot.sendMessage(msg.chat.id, "Horas enviadas com sucesso!");
            }else if (replyEnvio.code === 401){
                bot.sendMessage(msg.chat.id, "Seu token aparentemente expirou :( tente renovar o token e apontar novamente.  Você pode tentar reenviar com o comando /repetir");
            }else if(replyEnvio.code === 400){                
                bot.sendMessage(msg.chat.id, "Ocorreu um erro ao enviar suas horas: Erro " + replyEnvio.code + " " + replyEnvio.message);
            }
            
        })
    })
})

bot.onText(/AD|PR|FJ|CODIF|TESTE/, function (msg) {
    session.getComando(msg.from.id).then(function (replyComando) {
        if(replyComando === "definirTipoAtividade"){
            console.log(msg.from.first_name + " " + msg.from.last_name);
            session.setTipoAtividade(msg.from.id, msg.text).then(function (replyTipoAtividade) {
                session.setComando(msg.from.id, "comandoZero").then(function (replyFinal) {
                    bot.sendMessage(msg.chat.id, "Enviando horas");
                    Apontamento.enviarHoras(msg.from.id).then(function (replyEnvio) {
                        console.log("retorno", replyEnvio);
                        if(replyEnvio.code === 200){
                            bot.sendMessage(msg.chat.id, "Horas enviadas com sucesso!");
                        }else if (replyEnvio.code === 401){
                            bot.sendMessage(msg.chat.id, "Seu token aparentemente expirou :( tente renovar o token e apontar novamente. Você pode tentar reenviar com o comando /repetir");
                        }else if(replyEnvio.code === 400){
                            bot.sendMessage(msg.chat.id, "Ocorreu um erro ao enviar suas horas: Erro " + replyEnvio.code + " " + replyEnvio.message);
                            console.log("erro");
                        }
                        
                    })
                })
            })
        }
    })
})

// Recebe se o tipo do apontemento é por pendência
bot.onText(/Por pendência/, function (msg) {
    session.getComando(msg.from.id).then(function (reply) {
        if(reply === "apontar"){
            session.setTipoApontamento(msg.from.id, "porPendencia").then(function (reply) {
                session.setComando(msg.from.id, "definirData").then(function (replyComando) {
                    bot.sendMessage(msg.chat.id, "Quando deseja apontar?", optsTipoData);
                })
            })
        }
    })
})

//recebe se a data do apontamento for hoje
bot.onText(/Hoje/, function (msg) {
    session.getComando(msg.from.id).then(function (replyComando) {
        if(replyComando === "definirData"){
            session.setDia(msg.from.id, formatDate( new Date())).then(function (replyDia) {
                session.setComando(msg.from.id, "apontarEntrada").then(function (replyEntrada) {
                    bot.sendMessage(msg.chat.id, "Qual a hora de entrada?");
                })  
            })            
        }        
    })
})

//recebe se for outra data
bot.onText(/Outra data/, function (msg) {
    session.getComando(msg.from.id).then(function(replyComando) {
        if(replyComando === "definirData"){
            session.setComando(msg.from.id, "adicionarData").then(function(replyDia){
                bot.sendMessage(msg.chat.id, "Qual o dia que deseja apontar <dd/mm>");
            })
        }
    })
})

//adiciona nova data
bot.onText(/[0-9]?[0-9]\/[0-9]?[0-9]/, function(msg){
    session.getComando(msg.from.id).then(function (replyComando) {
        if(replyComando === "adicionarData"){
            var posicaoDaBarra = msg.text.search("/");
            var dia = msg.text.slice(0,posicaoDaBarra);
            var mes = msg.text.slice(posicaoDaBarra + 1);
            var ano = new Date().getFullYear();
            var data = formatDate(new Date(mes + '/' + dia + '/' + ano));
            session.setDia(msg.from.id, data).then(function (replyDia) {
                session.setComando(msg.from.id, "apontarEntrada").then(function (replyEntrada) {
                    bot.sendMessage(msg.chat.id, "Qual a hora de entrada?");
                })  
            })            
        }
    })
})

// Recebe se o tipo do apontamento é por projeto
bot.onText(/Por projeto/, function (msg) {
    session.getComando(msg.from.id).then(function (replyComando) {
        if(replyComando === "apontar"){
            session.setTipoApontamento(msg.from.id, "porProjeto").then(function(replyTipoApontamento){
                session.setComando(msg.from.id, "definirData").then(function (replyComando) {
                    bot.sendMessage(msg.chat.id, "Quando deseja apontar?", optsTipoData);                   
                })
            })
        }
    })
})

bot.onText(/\/apontar/, function(msg){

    var optsTipoApontamento = {
        reply_markup:JSON.stringify(
            {
                keyboard: [['Por projeto'],['Por pendência']],
                one_time_keyboard: true
            }
        )};    
    session.setComando(msg.from.id, 'apontar').then(function (reply) {
        bot.sendMessage(msg.chat.id, 'Como deseja apontar suas horas?', optsTipoApontamento);
    })
        

/*
    bot.sendMessage(msg.chat.id, 'Qual a hora de entrada?', opts)
    .then(function (sendedEntrada) {
        var chatId = sendedEntrada.chat.id;
        var messageId = sendedEntrada.message_id;
        bot.onReplyToMessage(chatId, messageId, function (messageEntrada) {
            horaEntrada = formatDate(new Date()) + 'T' + messageEntrada.text;
            bot.sendMessage(msg.chat.id, 'Qual a hora de saída?', opts)
            .then(function(sendedSaida){
                messageId = sendedSaida.message_id;
                bot.onReplyToMessage( chatId, messageId, function(messageSaida){
                    horaSaida = formatDate(new Date()) + 'T' + messageSaida.text;
                    bot.sendMessage(msg.chat.id, 'Qual a pendencia?', opts)
                    .then(function(sendedPendencia){
                        messageId = sendedPendencia.message_id;
                        bot.onReplyToMessage( chatId, messageId, function(messagePendencia){
                            pendencia = messagePendencia.text;
                            bot.sendMessage(msg.chat.id, 'Qual a classificação das horas?', opts)
                            .then(function(sendedClassificacao){
                                messageId = sendedClassificacao.message_id;
                                bot.onReplyToMessage(chatId, messageId, function (messageClassificacao) {
                                    classificacaoHoras = messageClassificacao.text;
                                    bot.sendMessage(msg.chat.id, 'Qual o tipo da atividade?', opts)
                                    .then(function (sendedTipoAtividade) {
                                        messageId = sendedTipoAtividade.message_id;
                                        bot.onReplyToMessage(chatId, messageId, function (messageTipoAtividade) {
                                            tipoAtividade = messageTipoAtividade.text;
                                            session.getToken(msg.from.id)
                                            .then(function(token){                                                
                                                console.log(token);
                                                var valores = {
                                                    horaEntrada: horaEntrada,
                                                    horaSaida: horaSaida,
                                                    pendencia: pendencia,
                                                    classificacaoHoras: classificacaoHoras,
                                                    tipoAtividade: tipoAtividade,
                                                    googleToken: token
                                                };
                                                Apontamento.envio(msg, valores).then(chamaApontamento);
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
    
    function chamaApontamento(statusCode) {
        console.log(statusCode);
        bot.sendMessage(msg.chat.id, 'Horas enviadas com sucesso!');
    }
    */
})


function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}