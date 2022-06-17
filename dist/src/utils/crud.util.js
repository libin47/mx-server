"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCrudFactory = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const nestjs_typegoose_1 = require("nestjs-typegoose");
const pluralize_1 = __importDefault(require("pluralize"));
const auth_decorator_1 = require("../common/decorator/auth.decorator");
const http_decorator_1 = require("../common/decorator/http.decorator");
const id_dto_1 = require("../shared/dto/id.dto");
const pager_dto_1 = require("../shared/dto/pager.dto");
function BaseCrudFactory({ model }) {
    const prefix = model.name.toLowerCase().replace(/model$/, '');
    const tagPrefix = prefix.charAt(0).toUpperCase() + prefix.slice(1);
    class PDto extends (0, swagger_1.PartialType)(model) {
    }
    class Dto extends model {
    }
    let BaseCrud = class BaseCrud {
        constructor(_model) {
            this._model = _model;
        }
        get model() {
            return this._model;
        }
        async get(param) {
            const { id } = param;
            return await this._model.findById(id).lean();
        }
        async gets(pager) {
            const { size, page, select, state } = pager;
            return await this._model.paginate(state !== undefined ? { state } : {}, {
                limit: size,
                page,
                sort: { created: -1 },
                select,
            });
        }
        async getAll() {
            return await this._model.find({}).sort({ created: -1 }).lean();
        }
        async create(body) {
            return await this._model.create({ ...body, created: new Date() });
        }
        async update(body, param) {
            return await this._model
                .findOneAndUpdate({ _id: param.id }, {
                ...body,
                modified: new Date(),
            }, { new: true })
                .lean();
        }
        async patch(body, param) {
            await this.update(body, param);
            return;
        }
        async delete(param) {
            await this._model.deleteOne({ _id: param.id });
            return;
        }
    };
    __decorate([
        (0, common_1.Get)('/:id'),
        __param(0, (0, common_1.Param)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [id_dto_1.MongoIdDto]),
        __metadata("design:returntype", Promise)
    ], BaseCrud.prototype, "get", null);
    __decorate([
        (0, common_1.Get)('/'),
        http_decorator_1.Paginator,
        __param(0, (0, common_1.Query)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [pager_dto_1.PagerDto]),
        __metadata("design:returntype", Promise)
    ], BaseCrud.prototype, "gets", null);
    __decorate([
        (0, common_1.Get)('/all'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], BaseCrud.prototype, "getAll", null);
    __decorate([
        (0, common_1.Post)('/'),
        (0, auth_decorator_1.Auth)(),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Dto]),
        __metadata("design:returntype", Promise)
    ], BaseCrud.prototype, "create", null);
    __decorate([
        (0, common_1.Put)('/:id'),
        (0, auth_decorator_1.Auth)(),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Param)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Dto, id_dto_1.MongoIdDto]),
        __metadata("design:returntype", Promise)
    ], BaseCrud.prototype, "update", null);
    __decorate([
        (0, common_1.Patch)('/:id'),
        (0, auth_decorator_1.Auth)(),
        (0, common_1.HttpCode)(204),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Param)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [PDto, id_dto_1.MongoIdDto]),
        __metadata("design:returntype", Promise)
    ], BaseCrud.prototype, "patch", null);
    __decorate([
        (0, common_1.Delete)('/:id'),
        (0, auth_decorator_1.Auth)(),
        (0, common_1.HttpCode)(204),
        __param(0, (0, common_1.Param)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [id_dto_1.MongoIdDto]),
        __metadata("design:returntype", Promise)
    ], BaseCrud.prototype, "delete", null);
    BaseCrud = __decorate([
        (0, swagger_1.ApiTags)(tagPrefix + ' Routes'),
        (0, common_1.Controller)((0, pluralize_1.default)(prefix)),
        __param(0, (0, nestjs_typegoose_1.InjectModel)(model)),
        __metadata("design:paramtypes", [Object])
    ], BaseCrud);
    return BaseCrud;
}
exports.BaseCrudFactory = BaseCrudFactory;
//# sourceMappingURL=crud.util.js.map