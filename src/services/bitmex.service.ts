import axios, { AxiosRequestConfig, AxiosInstance, AxiosError } from 'axios'
import * as crypto from 'crypto'
import * as http from 'http'
import * as https from 'https'

export class BitmeClient {
    
    private static httpAgent = new http.Agent({ keepAlive: true })
    private static httpsAgent = new https.Agent({ keepAlive: true })

    private readonly client: AxiosInstance
    
    constructor(private credentials: { key: string, secret: string, url: string}|any) {
		this.client = axios.create({
			httpAgent: BitmeClient.httpAgent,
			httpsAgent: BitmeClient.httpsAgent
        })
    }

    public async getCandleHistory(count: number, timeframe: string, symbol = 'XBTUSD') {
        const params = {
            symbol: symbol,
            count: count,
            binSize: timeframe,
            reverse: true,
            partial: false
        }
    
        const response = await this.privateRequest('GET', '/api/v1/trade/bucketed', params)
        return response.data.reverse()
    }


    public async getOpenPosition(symbol: string) {
        const positions = await this.privateRequest('GET', '/api/v1/position', {})
        return positions.data.filter((p: any) => p.symbol == symbol && p.isOpen == true).sort((a:any, b:any) => a.timestamp < b.timestamp)
    }

    public async getOrders(symbol: string, statuses: string[], startDate: string) {
        const params: any = {
            reverse: true,
            count: 500,
            symbol
        }

        if (!statuses.includes('All')) {
            params['ordStatus'] = statuses
        }
        if (startDate) {
            params['startTime'] = startDate
        }

        const orders = await this.privateRequest('GET', '/api/v1/order', params)
        return orders.data
    }

    public async limit(symbol: string, side: string, quantity: number, price: number, force = false, text = '') {

        if (price <= 0) {
            throw new Error('Price incorrect!')
        }
        price = Math.round(price * 2) / 2
        const params = {
            orderQty: quantity,
            ordType: 'Limit',
            execInst: 'Close',
            price,
            text,
            symbol,
            side
        }

        const order = await this.privateRequest('POST', '/api/v1/order', params)
        return order.data
    }

    public async cancelAllOpenOrders(symbol: string, note: string = '') {
        const params = {
            text: note,
            symbol
        }

        const response = await this.privateRequest('DELETE', '/api/v1/order/all', params)
        return response.data
    }

    public async getOrderBook(symbol: string, depth: number, side: string) {
        const params = {
            depth: depth,
            side,
            symbol
        }

        const orderBook = await this.privateRequest('GET', '/api/v1/orderBook/L2', params)
        return orderBook.data
    }

    public async getWallet(currency: string) {
        const params = {
            currency
        }

        const wallet = await this.privateRequest('GET', '/api/v1/user/walletHistory', params)
        return wallet.data
    }

    public async ordersNewBulk(orders: any[]) {
        const params = {
            orders
        }

        const bulkOrders = await this.privateRequest('POST', '/api/v1/order/bulk', params)
        return bulkOrders.data
    }

    public async ordersDeleteBulk(orders: any[]) {
        const params = {
            orderID: orders
        }

        const bulkOrders = await this.privateRequest('DELETE', '/api/v1/order', params)
        return bulkOrders.data
    }
    
    private privateRequest(method: string, path: string, data: any = {}): Promise<any> {
        const expires = Math.round(new Date().getTime() / 1000) + 60
        const apiKey = this.credentials.key
        const apiSecret = this.credentials.secret
        const signature = crypto.createHmac('sha256', apiSecret)
            .update(method + path + expires + JSON.stringify(data))
            .digest('hex')
    ​
        const headers = {
            'content-type' : 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'api-expires': expires,
            'api-key': apiKey,
            'api-signature': signature
        }
    ​
        return this.httpJSONRequest({
            baseURL: this.credentials.url,
            url: path,
            method: method as any,
            data,
            headers
        })
    }
    ​
    private httpJSONRequest(options: AxiosRequestConfig): Promise<any> {
        return this.client
            .request(options)
            .catch((error: AxiosError) => {
                console.log(error.response)
            })
    }
}