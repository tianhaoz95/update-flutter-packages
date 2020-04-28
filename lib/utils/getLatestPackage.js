"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const semver_diff_1 = __importDefault(require("semver-diff"));
/**
 * Returns the Latest version that the package can
 * automatically update to following semver.
 */
function getLatestPackage(dependency) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const dependencyKey = dependency.key;
        const dependencyValue = dependency.value;
        let dependencyName = dependencyKey.value;
        let dependencyVersion = (_b = (_a = dependencyValue.value) === null || _a === void 0 ? void 0 : _a.replace('^', '')) !== null && _b !== void 0 ? _b : undefined;
        const packageEndpoint = `https://pub.dev/api/packages/${dependencyName}`;
        const response = yield axios_1.default.get(packageEndpoint);
        const responseData = response.data;
        let versions = responseData.versions;
        let latestVersion = undefined;
        versions.reverse().every((element, index) => {
            let diff = semver_diff_1.default(dependencyVersion, element.version);
            if (diff == 'patch') {
                latestVersion = element;
                return false;
            }
            return true;
        });
        return latestVersion;
    });
}
exports.getLatestPackage = getLatestPackage;
