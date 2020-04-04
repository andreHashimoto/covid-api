import csv from 'csvtojson'

export class CSVReader {

    public static readFile = async (file: string) => {
        const jsonArray = await csv().fromFile(file)

        return jsonArray
    }

}
