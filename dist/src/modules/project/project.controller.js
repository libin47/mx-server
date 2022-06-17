"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const openapi = require("@nestjs/swagger");
const crud_factor_transformer_1 = require("../../transformers/crud-factor.transformer");
const project_model_1 = require("./project.model");
class ProjectController extends (0, crud_factor_transformer_1.BaseCrudFactory)({
    model: project_model_1.ProjectModel,
}) {
}
exports.ProjectController = ProjectController;
