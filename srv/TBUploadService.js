const cds = require('@sap/cds');
const { randomUUID } = require('crypto');
const { response } = require('express');
const { type } = require('os');
const PassThrough = require('stream').PassThrough;
const XLSX = require('xlsx');

module.exports = async function (srv) {

    async function CallEntity(entity, data) {
        // Table Declarations
        var TrialBalanceTable = [];

        for (var i = 0; i < data.length; i++) {
            var TrialBalanceID = randomUUID();
            var TrialBalanceEntry = {
                "ID": TrialBalanceID,
                "companyCode": data[i].CompanyCode,
                "year": data[i].Year,
                "ledger": data[i].Ledger,
                "glaccount": data[i].GLAccount,
                "period": data[i].Period,
                "lc": data[i].LocalCurrency,
                "gc": data[i].GlobalCurrency,
                "source": data[i].Source,
                "profitCenter": data[i].ProfitCenter,
                "costCenter": data[i].CostCenter,
                "businessArea": data[i].BusinessArea,
                "division": data[i].Division,
                "functionalArea": data[i].FunctionalArea,
                "chartOfAccounts": data[i].ChartOfAccounts
            };
            TrialBalanceTable.push(TrialBalanceEntry)
        }

        return TrialBalanceTable;

    };

    srv.on("UploadData", async (req) => {
        console.log(JSON.parse(req.data.data));
        var extract = JSON.parse(req.data.data);
        var extractedData = [];

        // Loop through the array and extract fields
        extract.forEach(item => {
            extractedData.push({
                companyCode: item.CompanyCode,
                year: item.Year,
                ledger: item.Ledger,
                glaccount: item.GLaccount,
                period: item.Period,
                lc: item.LocalCurrency,
                gc: item.GlobalCurrency,
                source: item.Source,
                profitCenter: item.ProfitCenter,
                costCenter: item.CostCenter,
                businessArea: item.BusinessArea,
                division: item.Division,
                functionalArea: item.FunctionalArea,
                chartOfAccounts: item.ChartOfAccounts
            });
        });
        
        const { TrialBalance } = cds.entities;

        let srv = await cds.connect.to('TBUploadService');

        const insertQuery = INSERT.into('TrialBalance').entries(extractedData);
        const insertResult = await srv.run(insertQuery);

        return insertResult;
    });

    srv.on('PUT', "ExcelUpload", async (req, res) => {
        
        var responseData;

        if (req.data.excel) {
            var buffers = [];
            var entity = req.headers.slug;

            const stream = new PassThrough();
            req.data.excel.pipe(stream);

            await new Promise((resolve, reject) => {

                stream.on('data', dataChunk => {
                    buffers.push(dataChunk);
                });

                stream.on('end', async () => {

                    let data = [];
                    var buffer = Buffer.concat(buffers);
                    var workbook = XLSX.read(buffer, { type: 'buffer' })

                    const worksheet = workbook.SheetNames[0];
                    const sheets = workbook.SheetNames

                    for (let i = 0; i < sheets.length; i++) {
                        const temp = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[i]])
                        temp.forEach((res) => {
                            data.push(res)
                        })
                    }

                    if (data) {
                        const responseCall = await CallEntity(entity, data);
                        if (responseCall == -1)
                            reject(req.error(400, JSON.stringify(data)));
                        else {
                            responseData = JSON.stringify(responseCall);

                            resolve(req.notify({
                                message: 'Upload Successful',
                                status: 200
                            }));
                        }
                    }
                });
            });
        }
    })
}