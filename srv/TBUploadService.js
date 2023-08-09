const cds = require('@sap/cds');
const { randomUUID } = require('crypto');
const { response } = require('express');
const { type } = require('os');
const PassThrough = require('stream').PassThrough;
const XLSX = require('xlsx');

module.exports = async function (srv) {

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

}