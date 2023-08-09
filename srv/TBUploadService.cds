using {tbuploadtables} from '../db/data-model';


service TBUploadService @(path: '/service'){


    entity TrialBalance as projection on tbuploadtables.TrialBalance;

    @cds.persistence.skip
    @odata.singleton
    entity ExcelUpload {
        @Core.MediaType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        excel : LargeBinary;
    };

    action UploadData(data: String) returns String;

}
