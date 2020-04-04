import { Request, Response } from 'express'
import { CSVReader } from '../services/csv-reader.service'
import credentials from '../credentials'

// export const getOpenOrders = async (req: Request, res: Response) => {
//     try {
//         const { bot, status } = req.params
//         const { start } = req.query

//         const exchange = await new BitmeClient(credentials[bot])

//         const statuses = status.toLowerCase() == 'new' ? ['New', 'PartiallyFilled'] : [status.charAt(0).toUpperCase() + status.slice(1)]

//         let orders = await exchange.getOrders('XBTUSD', statuses, start)

//         if (status != 'All') {
//             orders = orders.filter((o: any) => statuses.includes(o.ordStatus)).sort((a: any, b: any) => a.timestamp < b.timestamp)
//         }

//         res.status(200).json(orders)
//     } catch (e) {
//         console.error(e)
//     }
// }

export const getCovidData = async (req: Request, res: Response) => {
    try {
        const { data } = req.params

        // const exchange = await new BitmeClient(credentials[bot])
        // const position = await exchange.getOpenPosition('XBTUSD')

        const newDeaths = await CSVReader.readFile(`./${data}.csv`)

        res.status(200).json(newDeaths)
    } catch (e) {
        console.error(e)
    }
}

// export const getBalance = async (req: Request, res: Response) => {
//     try {
//         const { bot } = req.params

//         const exchange = await new BitmeClient(credentials[bot])
//         const wallet = await exchange.getWallet('XBt')
//         const balance = wallet[0]['walletBalance'] / 100000000

//         res.status(200).json(balance)
//     } catch (e) {
//         console.error(e)
//     }
// }

// export const getWalletHistory = async (req: Request, res: Response) => {
//     try {
//         const { bot } = req.params

//         const exchange = await new BitmeClient(credentials[bot])
//         const walletHistory = await exchange.getWallet('XBt')

//         res.status(200).json(walletHistory)
//     } catch (e) {
//         console.error(e)
//     }
// }

// export const getOrderBook = async (req: Request, res: Response) => {
//     try {
//         const { symbol, bot } = req.params
//         const { depth, side } = req.query

//         const exchange = await new BitmeClient(credentials[bot])

//         const orderBook = await exchange.getOrderBook(symbol, depth, side)

//         res.status(200).json(orderBook)
//     } catch (e) {
//         console.error(e)
//     }
// }

// export const getCandleHistory = async (req: Request, res: Response) => {
//     try {
//         const { symbol, bot } = req.params
//         const { count, timeframe } = req.query

//         const exchange = await new BitmeClient(credentials[bot])

//         const candles = await exchange.getCandleHistory(count, timeframe, symbol)

//         res.status(200).json(candles)
//     } catch (e) {
//         console.error(e)
//     }
// }

// export const getOrders = async (req: Request, res: Response) => { 
//     try { 
//         const serviceResponse = await new ServiceOrder().getDashOrders(req.params.instance, req.query) 
//         res.status(serviceResponse.statusCode).json(serviceResponse) 
//     } catch (e) { 
//         const error = ExceptionResponse.exec(e) 
//         res.status(error.statusCode).json(error) 
//     } 
// } 