//modulos externos
const inquirer = require('inquirer')
const chalk = require('chalk')

//modulos internos
const fs = require('fs')
const {
    constants
} = require('buffer')

//iniciando a função ao executar o programa
operation()

//operações 
function operation() {
    inquirer.prompt([{
            type: 'list',
            //qual ação será execultada
            name: 'action',
            //mensagem para o usuário
            message: 'oque você deseja fazer?',
            //funções que serão adicionadas nas contas
            choices: ['Criar Conta', 'Consultar Saldo', 'Depositar', 'Sacar', 'Sair', ],
        }, ])
        .then((answer) => {
            //conjuntos de ações
            const action = answer['action']
            if (action === 'Criar Conta') {
                //função para criar conta
                criarConta()

                //função para depositar
            } else if (action === 'Depositar') {

                depositar()
                //função para consultar saldo
            } else if (action === 'Consultar Saldo') {
                getAccountBalance()

                //função para sacar
            } else if (action === 'Sacar') {
                withDraw()

                //função para sair
            } else if (action === 'Sair') {
                //mensagem para o usuário
                console.log(chalk.bgBlue.black('OBRIGADO POR USAR O ACCOUNTS!'))
                //função sair
                process.exit()

            }
        }).catch((err) => console.log(err))
}

//criando conta
//create an account
function criarConta() {
    //Mensagem para usuário
    console.log(chalk.green('Parabens por Escolher o nosso Banco!'))
    console.log(chalk.green('Defina as Opções da Sua Conta a Seguir'))

    buidAccount()
}

//nome para conta
function buidAccount() {
    inquirer.prompt([{
        //Nome da Conta
        name: 'accountName',
        message: 'Digite um Nome Para a Sua Conta: '
    }]).then(answe => {
        //imprimir a variavel
        //ou seja o nome que o usuário digitou
        const accountName = answe['accountName']
        //logar o nome da conta
        console.info(accountName)

        //criar banco de dados para checar as contas
        if (!fs.existsSync('accounts')) {

            //VERIFICAR SE TEM O DIRETÓRIO
            //se não existir será criado um diretório
            fs.mkdirSync('accounts')
        }

        //VERIFICAÇÃO PARA SABER SE NOME DA CONTA EXISTE 
        //SE JÁ EXISTE NÃO DEIXARÁ PROSSEGIR
        //o arquivo será salvo em json
        if (fs.existsSync(`accounts/${accountName}.json`)) {
            //se já existir mostrar mensagem de erro
            console.log(chalk.bgRed.yellow.bold('esta conta já existe, escolha outro nome! '))

            //inicando um novo ciclo reiniciando a parte de criação
            buidAccount()

            return
        }
        //se não houver este arquivo vai ser a criação
        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance":0}',
            //
            function (err) {
                console.log(err)
            },
        )
        //mensagem de sucesso
        console.log(chalk.green('Parabens, A Sua Conta Foi Criada!'))
        //voltando  para escolher uma nova ação 
        operation()
    }).catch((err) => console.log(err))

}

//função de depositar
function depositar() {
    inquirer.prompt([{
            name: 'accountName',
            message: 'Qual o Nome da Conta?',
        }, ])
        .then((answer) => {
            //
            const accountName = answer['accountName']

            //verificar se a conta existe
            if (!checkAccount(accountName)) {
                //retornando para o deposito
                return depositar()
            }

            inquirer.prompt([{
                //valor a depositar
                name: 'amount',
                message: 'Quanto Você deseja Depositar',
            }, ]).then((answer) => {

                const amount = answer['amount']
                //adição de amount
                adicionarValor(accountName, amount)

                operation()

            }).catch((err) => console.log(err))

        }).catch((err) => console.log(err))
}


//função checar se aconta existe
//checando o nome da conta
function checkAccount(accountName) {
    //verifiacando se a não existe
    if (!fs.existsSync(`accounts/${accountName}.json`)) {
        //mensagem informando que não existe
        console.log(chalk.bgRed.black('Esta conta Não Existe, Tente Novamente!'))
        //se não existir retorne falso
        return false
    }
    //se existir retorno verdadeiro
    return true
}


//função de adicionar valores as contas
//a função recebe um nome de uma conta e um valor
function adicionarValor(accountName, amount) {
    const accountData = getAccount(accountName)

    if (!amount) {
        console.log(chalk.bgRed.black('ocorreu um erro, tente novamente mais tarde'))
        return depositar()
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {

            console.log(err)

        },
    )
    console.log(chalk.green(`Foi Depositado o Valor de R$${amount} Na Sua Conta`), )

}


function getAccount(accountName) {
    //lendo arquivo
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        //padrão brasil
        encoding: 'utf-8',
        flag: 'r'
    })
    //transformando em json
    return JSON.parse(accountJSON)
}

//show account balance
//mostrar o saldo  da conta
function getAccountBalance() {
    inquirer.prompt([{ //nome da conta
        name: 'accountName',
        message: 'Qual o Nome da Conta',
    }]).then((answer) => {
        const accountName = answer["accountName"]
        //verify if account exists
        if (!checkAccount(accountName)) {
            return getAccountBalance()
        }

        const accountData = getAccount(accountName)

        console.log(chalk.bgBlue.black(
            `O Valor do Seu Saldo é R$${accountData.balance}`,
        ), )
        operation()
    }).catch(err => console.log(err))
}

//sacar
function withDraw() {
    inquirer.prompt([{
        name: 'accountName',
        message: 'Qual o nome da sua Conta?',
    }, ]).then((answer) => {
        const accountName = answer['accountName']
        if (!checkAccount(accountName)) {
            return withDraw()
        }
        inquirer.prompt([{
            name: 'amount',
            message: 'Valor do Saque?',

        }, ]).then((answer) => {
            const amount = answer['amount']

            removeAmount(accountName, amount)
        


        }).catch(err => console.log(err))

    }).catch(err => console.log(err))
}

//Função para remover valor
function removeAmount(accountName, amount) {
    const accountData = getAccount(accountName)

    //Mensagem caso não seja informado o valor
    if (!amount) {
        console.log(chalk.bgRed.black('ocorreu um erro tente novamente mais tarde!'))
        return withDraw()
    }
    if (accountData.balance < amount) {
        console.log(chalk.bgRed.black('Valor Indisponovel'))
        return withDraw()
    }
    //Removendo valores da conta
    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)
    //escrevendo as alterações no arquivo
    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err){
            console.log(err)
        },
    )
    console.log(chalk.green(`FOI REALIZADO UM SAQUE DE R$${amount} NA SUA CONTA`))
        operation()
}