import express, { Request, Response } from 'express'
import cors from 'cors'
import { accounts } from './database'
import { ACCOUNT_TYPE } from './types'

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

app.get("/ping", (req: Request, res: Response) => {
    res.send("Pong!")
})

app.get("/accounts", (req: Request, res: Response) => {
    res.send(accounts)
})

//Atráves do metodo abaixo conseguimos pegar apenas os items selecionasdos em vez de todo o objetivo:
app.get("/accounts/:id",(req: Request, res: Response )=>{
    const idToFind = req.params.id

    const result = accounts.find((account) => {
        return account.id === idToFind
    })

    res.send(result)
})


//Criando o delete para os items:
app.delete("/accounts/:id", (req: Request, res: Response) => {
    const idToDelete = req.params.id

    const accountIndex = accounts.findIndex((account) => account.id === idToDelete)


    if(accountIndex >= 0){
        accounts.splice(accountIndex, 1)
    }

    res.send("Item deletado com sucesso!")
})



//Alterando informações:
app.put("/accounts/:id",(req: Request, res: Response) => {
    //Recebendo o id:
    const idToEdit = req.params.id

    //Classificando as infos recebidas:
    const newId = req.body.id as string | undefined
    const newOwnerName = req.body.ownerName as string | undefined
    const newType = req.body.type as ACCOUNT_TYPE | undefined
    const newBalance = req.body.balance as number | undefined

    const result = accounts.find((account) => account.id === idToEdit)


    if(result){
        result.id = newId || result.id
        result.ownerName = newOwnerName || result.ownerName
        result.type = newType || result.type
        result.balance = isNaN(Number(newBalance)) ? result.balance : newBalance as number
        
    }

    res.status(200).send("Atualização feita com sucesso!")
})