"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronDescription = void 0;
const common_1 = require("@nestjs/common");
const meta_constant_1 = require("../../constants/meta.constant");
const CronDescription = (description) => (0, common_1.SetMetadata)(meta_constant_1.CRON_DESCRIPTION, description);
exports.CronDescription = CronDescription;
