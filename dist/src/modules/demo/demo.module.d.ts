import { AssetService } from '~/processors/helper/helper.asset.service';
import { BackupService } from '../backup/backup.service';
export declare class DemoModule {
    private readonly backupService;
    private readonly assetService;
    constructor(backupService: BackupService, assetService: AssetService);
    reset(): void;
}
