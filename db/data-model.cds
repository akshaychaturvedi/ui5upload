using {cuid} from '@sap/cds/common';

context tbuploadtables {

    entity TrialBalance : cuid {
        key companyCode     : String(4)  @title: 'Company Code';
        key year            : String(4)  @title: 'Year';
        key ledger          : String(3)  @title: 'Ledger';
            glaccount       : String(10) @title: 'GL Account';
            period          : String(3)  @title: 'Period';
            lc              : String(3)  @title: 'Local Currency';
            gc              : String(3)  @title: 'Global Currency';
            source          : String(3)  @title: 'Source';
            profitCenter    : String(10) @title: 'Profit Center';
            costCenter      : String(10) @title: 'Cost Center';
            businessArea    : String(4)  @title: 'Business Area';
            division        : String(2)  @title: 'Division';
            functionalArea  : String(16) @title: 'Functional Area';
            chartOfAccounts : String(4)  @title: 'Chart of Accounts';
    }

}
