import express from 'express'
import * as controller from '../controllers/covid'
 
const exchangeRoute = express.Router()

exchangeRoute.route('/covid/:data').get(controller.getCovidData)

// exchangeRoute.route('/balance/:bot').get(controller.getBalance)

// exchangeRoute.route('/walletHistory/:bot').get(controller.getWalletHistory)

// exchangeRoute.route('/order/:bot/:status').get(controller.getOpenOrders)

// exchangeRoute.route('/orderbook/:bot/:symbol').get(controller.getOrderBook)

// exchangeRoute.route('/candle/:bot/:symbol').get(controller.getCandleHistory)

export default exchangeRoute